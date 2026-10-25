import "../harness/testEnvironment.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { TokenService } from "@/modules/auth/security/token.service.js";
import { authRequest, startAuthApplication } from "../harness/authApplication.js";
import { createPaymentState } from "../fixtures/paymentState.js";

test("admin orders retain role matrix, date filters, both confirmation aliases and payment/event side effects", async () => {
  const state = await createPaymentState();
  state.seedOrder({ createdAt: new Date("2026-01-03T00:00:00.000Z") });
  const server = await startAuthApplication(async () => state);
  const token = server.app.get(TokenService).signAdminAccessToken({ sub: state.user.id, email: state.user.email, role: "ADMIN", tokenType: "ADMIN" });
  const request = (path: string, method = "GET", body?: unknown) => authRequest(server.url, `/admin/orders${path}`, body, { token, method });
  const id = state.seed.id as string;
  try {
    for (const role of ["SUPER_ADMIN", "ADMIN", "STAFF_ORDER", "STAFF_CONTENT"] as const) {
      state.user.role = role;
      assert.equal((await request("")).response.status, role === "STAFF_CONTENT" ? 403 : 200);
      assert.equal((await request(`/${id}`)).response.status, role === "STAFF_CONTENT" ? 403 : 200);
    }
    state.user.role = "STAFF_ORDER";
    const listing = await request("?startDate=2026-01-01&endDate=2026-01-01&sort=PRICE_DESC&search=%20DHSEPAY01%20");
    assert.deepEqual(listing.body.data.pagination, { page: 1, limit: 20, total: 1 });
    assert.equal(listing.body.data.items[0].itemsCount, 1);
    assert.equal((await request("?startDate=2026-02-01&endDate=2026-01-01")).response.status, 422);
    assert.equal((await request(`/${id}`)).body.data.customer.id, state.customer.id);
    state.failure.paymentWrite = true;
    assert.equal((await request(`/${id}/confirm-payment`, "POST")).response.status, 500);
    assert.equal(state.seed.paymentStatus, "PENDING");
    assert.equal(server.events.length, 0);
    state.failure.paymentWrite = false;
    const confirmed = await request(`/${id}/confirm-payment`, "POST");
    assert.equal(confirmed.response.status, 200);
    assert.equal(confirmed.body.data.paymentStatus, "PAID");
    assert.equal(state.payments()[0]!.isMatched, true);
    assert.deepEqual(server.paidEvents, [id]);
    assert.equal(server.paidEmails.length, 0);
    assert.equal(state.notifications.length, 1);
    const alias = await request(`/${id}/confirmPayment`, "POST");
    assert.equal(alias.response.status, 200);
    assert.equal(server.paidEvents.length, 1);
    assert.equal(state.notifications.length, 1);
    await request(`/${id}/status`, "PATCH", { orderStatus: "PACKING", adminNotes: "Ghi chú", shippingUnit: "GHN", trackingCode: "ABC" });
    assert.equal(state.seed.orderStatus, "PACKING");
    assert.equal(state.seed.trackingCode, "ABC");
    assert.equal((await request(`/${id}/status`, "PATCH", { orderStatus: "CANCELLED" })).body.errorCode, "ORDER_CANCELLATION_REASON_REQUIRED");
    const cancelled = await request(`/${id}/status`, "PATCH", { orderStatus: "CANCELLED", cancelReason: "Khách yêu cầu" });
    assert.equal(cancelled.body.data.paymentStatus, "PAID");
    assert.equal(state.products.get(state.sale.id as string)!.stockQuantity, 7);
    await request(`/${id}/status`, "PATCH", { orderStatus: "CANCELLED", cancelReason: "Lặp lại" });
    assert.equal(state.products.get(state.sale.id as string)!.stockQuantity, 7);
    assert.equal((await request(`/${id}/confirm-payment`, "POST")).body.errorCode, "ORDER_STATUS_INVALID");
    state.user.role = "STAFF_CONTENT";
    assert.equal((await request(`/${id}/confirmPayment`, "POST")).body.errorCode, "FORBIDDEN");
    assert.equal((await request(`/${id}/status`, "PATCH", { orderStatus: "PAID" })).body.errorCode, "FORBIDDEN");
  } finally { await server.close(); }
});
