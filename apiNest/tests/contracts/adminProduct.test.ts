import "../harness/testEnvironment.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { TokenService } from "@/modules/auth/security/token.service.js";
import { authRequest, startAuthApplication } from "../harness/authApplication.js";
import { createCatalogState } from "../fixtures/catalogState.js";

test("admin products preserve nested writes, transaction rollback, validation, soft delete and invalidation", async () => {
  const state = await createCatalogState();
  const server = await startAuthApplication(async () => state);
  const token = server.app.get(TokenService).signAdminAccessToken({ sub: state.user.id, email: state.user.email, role: "ADMIN", tokenType: "ADMIN" });
  const request = (path: string, method = "GET", body?: unknown) => authRequest(server.url, path, body, { token, method });
  const payload = { code: "SP_CREATED", name: "Sản phẩm mới", slug: "created", categoryId: state.category.id, originalPrice: 100000, salePrice: 90000, stockQuantity: 3,
    images: ["https://example.test/first.png", { url: "https://example.test/second.png", isThumbnail: true }],
    options: [{ optionType: "SIZE", name: "Size", values: [{ code: "S", label: "Nhỏ", priceDiff: 1000 }] }],
  };
  try {
    await request("/products/home?types=HOT_PRODUCT,BEST_SELLING,TODAY_DEAL,HOT_TIKTOK");
    const created = await request("/admin/products", "POST", payload);
    assert.equal(created.response.status, 201);
    assert.equal(created.body.data.thumbnail.url, "https://example.test/second.png");
    assert.equal(created.body.data.price, 90000);
    for (const type of ["HOT_PRODUCT", "BEST_SELLING", "TODAY_DEAL", "HOT_TIKTOK"]) assert.equal(await state.redis.get(`home:products:${type}`), null);
    const id = created.body.data.id;
    const detail = await request(`/admin/products/${id}`);
    assert.equal(detail.body.data.images[0].isThumbnail, false);
    assert.equal(detail.body.data.images[1].isThumbnail, true);
    assert.equal(detail.body.data.options[0].values[0].priceDiff, 1000);
    assert.equal((await request("/admin/products", "POST", payload)).body.errorCode, "PRODUCT_ALREADY_EXISTS");
    assert.equal((await request("/admin/products", "POST", { ...payload, code: "SP_OTHER", slug: "other", categoryId: "00000000-0000-4000-8000-000000000999" })).body.errorCode, "CATEGORY_NOT_FOUND");
    const original = structuredClone(state.products.get(id));
    const invalid = await request(`/admin/products/${id}`, "PATCH", { originalPrice: 80000 });
    assert.equal(invalid.response.status, 422);
    assert.deepEqual(state.products.get(id), original);
    state.failures.update = true;
    const failed = await request(`/admin/products/${id}`, "PATCH", { images: ["https://example.test/replaced.png"], options: [] });
    assert.equal(failed.body.errorCode, "PRODUCT_ALREADY_EXISTS");
    assert.deepEqual(state.products.get(id), original);
    state.failures.update = false;
    const updated = await request(`/admin/products/${id}`, "PATCH", { images: ["https://example.test/replaced.png"], options: [], salePrice: null, shortDescription: "" });
    assert.equal(updated.body.data.images.length, 1);
    assert.equal(updated.body.data.images[0].isThumbnail, true);
    assert.deepEqual(updated.body.data.options, []);
    assert.equal(updated.body.data.shortDescription, null);
    assert.equal(updated.body.data.price, 100000);
    const listing = await request(`/admin/products?categoryIds=${state.category.id},${state.category.id}&statuses=ACTIVE,HIDDEN&sort=STOCK_ASC&page=2&limit=5`);
    assert.deepEqual(listing.body.data.pagination, { page: 2, limit: 5, total: 5 });
    const args = state.productQueries.at(-1)!.args;
    assert.deepEqual(args.where, { deletedAt: null, categoryId: { in: [state.category.id] }, status: { in: ["ACTIVE", "HIDDEN"] } });
    assert.deepEqual(args.orderBy, [{ stockQuantity: "asc" }, { createdAt: "desc" }]);
    assert.deepEqual((await request(`/admin/products/${id}`, "DELETE")).body, { success: true, message: "Xóa sản phẩm thành công." });
    assert.ok(state.products.get(id)!.deletedAt instanceof Date);
    assert.equal((await request(`/admin/products/${id}`)).body.errorCode, "PRODUCT_NOT_FOUND");
    assert.equal((await request("/products/created")).body.errorCode, "PRODUCT_NOT_FOUND");
    assert.equal((await request(`/admin/categories/${state.category.id}`, "DELETE")).body.errorCode, "CATEGORY_HAS_PRODUCTS");
    for (const role of ["STAFF_ORDER", "STAFF_CONTENT"] as const) {
      state.user.role = role;
      for (const [path, method, body] of [["/admin/products", "GET", undefined], ["/admin/products", "POST", payload], [`/admin/products/${id}`, "GET", undefined], [`/admin/products/${id}`, "PATCH", { name: "Denied" }], [`/admin/products/${id}`, "DELETE", undefined]] as const) {
        assert.equal((await request(path, method, body)).body.errorCode, "FORBIDDEN");
      }
    }
  } finally { await server.close(); }
});
