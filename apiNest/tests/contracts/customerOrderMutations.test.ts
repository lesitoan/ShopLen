import "../harness/testEnvironment.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { TokenService } from "@/modules/auth/security/token.service.js";
import { authRequest, startAuthApplication } from "../harness/authApplication.js";
import { createOrderState } from "../fixtures/orderState.js";

test("order cancellations restore pending stock only once, preserve paid stock and emit after successful transactions", async () => {
  const state = await createOrderState();
  const server = await startAuthApplication(async () => state);
  const token = server.app.get(TokenService).signCustomerAccessToken({ sub: state.customer.id, email: state.customer.email, tokenType: "CUSTOMER" });
  const id = state.seed.id as string;
  state.seed.items = [{ productId: state.sale.id, quantity: 2 }, { productId: null, quantity: 9 }];
  state.seed.payments = [{ orderId: id, status: "PENDING" }, { orderId: id, status: "PAID" }];
  const cancel = (orderId: string) => authRequest(server.url, `/orders/${orderId}/cancel`, { reason: "Đổi ý" }, { token });
  try {
    state.seed.customerId = state.user.id;
    assert.equal((await cancel(id)).body.errorCode, "ORDER_NOT_FOUND");
    state.seed.customerId = state.customer.id;
    const results = await Promise.all([cancel(id), cancel(id)]);
    assert.deepEqual(results.map((item) => item.response.status).sort(), [200, 409]);
    assert.equal(state.products.get(state.sale.id as string)!.stockQuantity, 7);
    const order = state.orders.get(id)!;
    assert.equal(order.orderStatus, "CANCELLED");
    assert.equal(order.paymentStatus, "FAILED");
    assert.deepEqual((order.payments as Array<{ status: string }>).map((item) => item.status), ["FAILED", "PAID"]);
    assert.deepEqual(server.events, [{ orderId: id, orderStatus: "CANCELLED" }]);
    assert.equal(state.notifications.length, 1);
    for (const status of ["PAID", "PACKING"]) {
      const paid = state.seedOrder({ orderStatus: status, paymentStatus: "PAID", items: [{ productId: state.sale.id, quantity: 2 }] });
      const requested = await cancel(paid.id as string);
      assert.equal(requested.response.status, 200);
      assert.deepEqual(requested.body.data, { orderStatus: "CANCELLATION_REQUESTED" });
      assert.equal(paid.cancellationRequestedFrom, status);
      assert.equal(paid.paymentStatus, "PAID");
      assert.equal(state.products.get(state.sale.id as string)!.stockQuantity, 7);
    }
    const shipped = state.seedOrder({ orderStatus: "SHIPPING" });
    assert.equal((await cancel(shipped.id as string)).body.errorCode, "ORDER_CANCELLATION_NOT_ALLOWED");
    assert.equal(server.events.length, 3);
    assert.equal(state.notifications.length, 3);
  } finally { await server.close(); }
});

test("shipping address keeps owner/status restrictions and existing notification payload", async () => {
  const state = await createOrderState();
  const server = await startAuthApplication(async () => state);
  const token = server.app.get(TokenService).signCustomerAccessToken({ sub: state.customer.id, email: state.customer.email, tokenType: "CUSTOMER" });
  const body = { shippingAddress: "Địa chỉ mới", shippingProvince: "HCM", shippingWard: "", customerName: "Tên mới", customerPhone: "0901111111" };
  const update = () => authRequest(server.url, `/orders/${state.seed.id}/shipping-address`, body, { token, method: "PATCH" });
  try {
    for (const status of ["PENDING_PAYMENT", "PAID", "PACKING"]) {
      state.seed.orderStatus = status;
      const result = await update();
      assert.equal(result.response.status, 200);
      assert.equal(result.body.message, "Da cap nhat dia chi giao hang.");
      assert.equal(result.body.data.shippingWard, null);
      assert.equal(result.body.data.customerName, body.customerName);
    }
    assert.equal(state.notifications.length, 3);
    assert.equal(state.notifications[0]!.name, "ORDER_SHIPPING_ADDRESS_UPDATED");
    assert.equal((state.notifications[0]!.data as { oldShippingAddress: string }).oldShippingAddress, "Địa chỉ cũ, , , ");
    for (const status of ["SHIPPING", "COMPLETED", "CANCELLATION_REQUESTED", "CANCELLED"]) {
      state.seed.orderStatus = status;
      assert.equal((await update()).body.errorCode, "ORDER_SHIPPING_ADDRESS_UPDATE_NOT_ALLOWED");
    }
    state.seed.customerId = state.user.id;
    assert.equal((await update()).body.errorCode, "ORDER_NOT_FOUND");
    assert.equal(state.notifications.length, 3);
    assert.equal(server.events.length, 0);
  } finally { await server.close(); }
});
