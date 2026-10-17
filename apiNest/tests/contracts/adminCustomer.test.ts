import "../harness/testEnvironment.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { TokenService } from "@/modules/auth/security/token.service.js";
import { authRequest, startAuthApplication } from "../harness/authApplication.js";

test("customer administration preserves role matrix, pagination, order summary and immediate lock enforcement", async () => {
  const server = await startAuthApplication();
  const queries: Array<Record<string, unknown>> = [];
  const order = { id: "order-id", orderCode: "DH001", customerName: "Khách", customerPhone: "0123456789", totalAmount: 100000, paymentStatus: "PAID", orderStatus: "PACKING", createdAt: new Date("2026-01-02T00:00:00.000Z"), _count: { items: 3 } };
  const findUnique = server.state.prisma.customer.findUnique;
  Object.assign(server.state.prisma.customer, {
    findMany: async (query: Record<string, unknown>) => { queries.push(query); return [server.state.customer]; },
    count: async () => 1,
    findUnique: async (query: Parameters<typeof findUnique>[0]) => {
      const customer = await findUnique(query);
      return customer ? { ...customer, orders: [order] } : null;
    },
  });
  Object.assign(server.state.prisma, { $transaction: async (queries: Array<Promise<unknown>>) => Promise.all(queries) });
  const tokens = server.app.get(TokenService);
  const token = tokens.signAdminAccessToken({ sub: server.state.user.id, email: server.state.user.email, role: "ADMIN", tokenType: "ADMIN" });
  const customerToken = tokens.signCustomerAccessToken({ sub: server.state.customer.id, email: server.state.customer.email, tokenType: "CUSTOMER" });
  const detailPath = `/admin/customers/${server.state.customer.id}`;
  const request = (path: string, method = "GET", body?: unknown) => authRequest(server.url, path, body, { token, method });
  try {
    for (const role of ["SUPER_ADMIN", "ADMIN", "STAFF_ORDER", "STAFF_CONTENT"] as const) {
      server.state.user.role = role;
      assert.equal((await request("/admin/customers")).response.status, ["SUPER_ADMIN", "ADMIN"].includes(role) ? 200 : 403);
      assert.equal((await request(detailPath)).response.status, role === "STAFF_CONTENT" ? 403 : 200);
      assert.equal((await request(`${detailPath}/status`, "PATCH", { status: "ACTIVE" })).response.status, ["SUPER_ADMIN", "ADMIN"].includes(role) ? 200 : 403);
    }
    server.state.user.role = "ADMIN";
    const listed = await request("/admin/customers?page=2&limit=5&search=%20Test%20&status=ACTIVE");
    assert.deepEqual(listed.body.data.pagination, { page: 2, limit: 5, total: 1 });
    assert.equal(queries.at(-1)?.skip, 5);
    assert.equal(queries.at(-1)?.take, 5);
    assert.deepEqual(queries.at(-1)?.where, { status: "ACTIVE", OR: [{ fullName: { contains: "Test", mode: "insensitive" } }, { email: { contains: "Test", mode: "insensitive" } }, { phone: { contains: "Test" } }] });
    assert.equal("passwordHash" in listed.body.data.items[0], false);
    const detail = await request(detailPath);
    assert.deepEqual(detail.body.data.orders, [{ id: order.id, orderCode: order.orderCode, customerName: order.customerName, customerPhone: order.customerPhone, totalAmount: order.totalAmount, paymentStatus: "PAID", orderStatus: "PACKING", createdAt: order.createdAt.toISOString(), itemsCount: 3 }]);
    const locked = await request(`${detailPath}/status`, "PATCH", { status: "LOCKED" });
    assert.equal(locked.body.message, "Cập nhật trạng thái tài khoản thành công.");
    assert.equal(locked.body.data.status, "LOCKED");
    const denied = await authRequest(server.url, "/customers/me", undefined, { token: customerToken });
    assert.equal(denied.response.status, 403);
    assert.equal(denied.body.errorCode, "CUSTOMER_LOCKED");
    assert.equal((await request("/admin/customers?limit=101")).response.status, 422);
    assert.equal((await request("/admin/customers/00000000-0000-4000-8000-000000000099")).body.errorCode, "CUSTOMER_NOT_FOUND");
  } finally { await server.close(); }
});
