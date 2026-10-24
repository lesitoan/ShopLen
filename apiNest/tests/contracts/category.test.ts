import "../harness/testEnvironment.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { TokenService } from "@/modules/auth/security/token.service.js";
import { authRequest, startAuthApplication } from "../harness/authApplication.js";
import { createCategoryState } from "../fixtures/categoryState.js";

test("category mutations preserve permissions, constraints, response shape and cache invalidation", async () => {
  const state = await createCategoryState();
  const server = await startAuthApplication(async () => state);
  const token = server.app.get(TokenService).signAdminAccessToken({ sub: state.user.id, email: state.user.email, role: "ADMIN", tokenType: "ADMIN" });
  const request = (path: string, method = "GET", body?: unknown) => authRequest(server.url, path, body, { token, method });
  try {
    const listed = await request("/categories");
    assert.equal(listed.response.headers.get("cache-control"), "public, max-age=300, s-maxage=86400, stale-while-revalidate=86400");
    assert.equal(await state.redis.ttl("client:categories"), 86400);
    assert.equal(listed.body.data[0].description, null);
    const created = await request("/admin/categories", "POST", { name: "Móc khóa", slug: "moc-khoa", image: "" });
    assert.equal(created.response.status, 201);
    assert.deepEqual(created.body, { success: true, message: "Tạo danh mục thành công." });
    assert.equal(await state.redis.get("client:categories"), null);
    const item = [...state.categories.values()][1]!;
    assert.equal(item.code.length, 30);
    assert.match(item.code, /^[0-9a-f]{12}7[0-9a-f]{17}$/);
    assert.equal((await request("/admin/categories", "POST", { name: item.name, slug: item.slug })).body.errorCode, "CATEGORY_ALREADY_EXISTS");
    const detail = await request(`/admin/categories/${item.id}`);
    assert.equal(detail.body.data.image, null);
    assert.equal(detail.body.data.createdAt, "2026-01-01T00:00:00.000Z");
    await request("/categories");
    assert.deepEqual((await request(`/admin/categories/${item.id}`, "PATCH", { name: "Tên mới" })).body, { success: true, message: "Cập nhật danh mục thành công." });
    assert.equal(await state.redis.get("client:categories"), null);
    assert.equal((await request(`/admin/categories/${item.id}`, "PATCH", {})).response.status, 422);
    const adminList = await request("/admin/categories?page=2&limit=5&sort=NAME_ASC&search=%20len%20");
    assert.deepEqual(adminList.body.data.pagination, { page: 2, limit: 5, total: 2 });
    assert.deepEqual(state.queries.at(-1)?.args.orderBy, [{ name: "asc" }, { createdAt: "desc" }]);
    assert.equal(state.queries.at(-1)?.args.skip, 5);
    state.productCounts.set(item.id, 1);
    assert.equal((await request(`/admin/categories/${item.id}`, "DELETE")).body.errorCode, "CATEGORY_HAS_PRODUCTS");
    assert.equal(state.categories.has(item.id), true);
    state.productCounts.delete(item.id);
    assert.deepEqual((await request(`/admin/categories/${item.id}`, "DELETE")).body, { success: true, message: "Xóa danh mục thành công." });
    assert.equal((await request(`/admin/categories/${item.id}`)).body.errorCode, "CATEGORY_NOT_FOUND");
    for (const role of ["STAFF_ORDER", "STAFF_CONTENT"] as const) {
      state.user.role = role;
      assert.equal((await request("/admin/categories")).body.errorCode, "FORBIDDEN");
      assert.equal((await request("/admin/categories", "POST", { name: "Denied", slug: "denied" })).body.errorCode, "FORBIDDEN");
    }
  } finally { await server.close(); }
});
