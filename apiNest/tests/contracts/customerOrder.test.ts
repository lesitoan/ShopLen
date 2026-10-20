import "../harness/testEnvironment.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { TokenService } from "@/modules/auth/security/token.service.js";
import { ClientOrderService } from "@/modules/orders/services/clientOrder.service.js";
import { OrderLookupRateLimitService } from "@/modules/orders/http/orderLookupRateLimit.service.js";
import { authRequest, startAuthApplication } from "../harness/authApplication.js";
import { createOrderState } from "../fixtures/orderState.js";

test("checkout preserves grouped quantities, pricing, snapshots, transaction rollback and last-stock CAS", async () => {
  const state = await createOrderState();
  const server = await startAuthApplication(async () => state);
  const token = server.app.get(TokenService).signCustomerAccessToken({ sub: state.customer.id, email: state.customer.email, tokenType: "CUSTOMER" });
  const item = { productId: state.sale.id, quantity: 1, selectedOptions: [{ optionType: "COLOR", code: "red" }] };
  const payload = { items: [item, item], customerName: "Khách", customerPhone: "0901234567", shippingAddress: "Địa chỉ", shippingFee: 20000, customerId: state.user.id };
  try {
    const created = await authRequest(server.url, "/orders", payload, { token });
    assert.equal(created.response.status, 201);
    const data = created.body.data;
    assert.equal(data.subtotal, 160000);
    assert.equal(data.totalAmount, 180000);
    assert.equal(data.items.length, 1);
    assert.equal(data.items[0].quantity, 2);
    assert.equal(data.items[0].productSnapshot.selectedOptions[0].code, "RED");
    assert.equal(data.payments[0].amount, 180000);
    assert.equal(state.orders.get(data.id)!.customerId, state.customer.id);
    assert.equal(state.products.get(state.sale.id as string)!.stockQuantity, 3);
    assert.deepEqual(state.transactions[0], { timeout: 15000 });
    assert.equal(server.state.notifications.length, 0);
    const rollbackStock = state.products.get(state.sale.id as string)!.stockQuantity;
    state.failures.create = true;
    assert.equal((await authRequest(server.url, "/orders", { ...payload, items: [item] }, { token })).response.status, 500);
    assert.equal(state.products.get(state.sale.id as string)!.stockQuantity, rollbackStock);
    state.failures.create = false;
    const invalid = await authRequest(server.url, "/orders", { ...payload, items: [{ ...item, selectedOptions: [] }] }, { token });
    assert.equal(invalid.body.errorCode, "PRODUCT_OPTION_REQUIRED");
    assert.equal((await authRequest(server.url, "/orders", { ...payload, items: [{ ...item, selectedOptions: [{ optionType: "COLOR", code: "BLUE" }] }] }, { token })).body.errorCode, "PRODUCT_OPTION_INVALID");
    const beforeAttempts = state.updates.length;
    const stockBefore = state.products.get(state.reference.id as string)!.stockQuantity;
    state.failures.casProductId = state.sale.id as string;
    const partial = await authRequest(server.url, "/orders", { ...payload, items: [item, { ...item, productId: state.reference.id }] }, { token });
    assert.equal(partial.body.errorCode, "PRODUCT_OUT_OF_STOCK");
    assert.equal(state.products.get(state.reference.id as string)!.stockQuantity, stockBefore);
    assert.deepEqual(state.updates.slice(beforeAttempts).map((query) => query.where!.id), [state.reference.id, state.sale.id]);
    state.failures.casProductId = null;
    const service = server.app.get(ClientOrderService);
    const product = state.products.get(state.reference.id as string)!;
    product.stockQuantity = 1;
    const racePayload = { ...payload, items: [{ ...item, productId: state.reference.id as string, selectedOptions: [{ optionType: "COLOR" as const, code: "RED" }] }] };
    const race = await Promise.allSettled([service.createOrder(state.customer.id, racePayload), service.createOrder(state.customer.id, racePayload)]);
    assert.equal(race.filter((item) => item.status === "fulfilled").length, 1);
    assert.equal(state.products.get(state.reference.id as string)!.stockQuantity, 0);
  } finally { await server.close(); }
});

test("order queries enforce owner isolation while public lookup preserves phone normalization and 3-request limit", async () => {
  const state = await createOrderState();
  const server = await startAuthApplication(async () => state);
  const token = server.app.get(TokenService).signCustomerAccessToken({ sub: state.customer.id, email: state.customer.email, tokenType: "CUSTOMER" });
  try {
    assert.equal((await authRequest(server.url, "/orders")).response.status, 401);
    assert.equal((await authRequest(server.url, "/orders", undefined, { token })).body.data.length, 1);
    assert.equal((await authRequest(server.url, `/orders/${state.seed.id}`, undefined, { token })).body.data.orderCode, state.seed.orderCode);
    state.seed.customerId = state.user.id;
    assert.equal((await authRequest(server.url, `/orders/${state.seed.id}`, undefined, { token })).body.errorCode, "ORDER_NOT_FOUND");
    const lookup = () => authRequest(server.url, "/orders/lookup", { orderCode: String(state.seed.orderCode).toLowerCase(), customerPhone: "090 123 4567" });
    const found = await lookup();
    assert.equal(found.response.status, 200);
    assert.equal("payments" in found.body.data, false);
    const wrong = await authRequest(server.url, "/orders/lookup", { orderCode: state.seed.orderCode, customerPhone: "wrong" });
    assert.equal(wrong.body.errorCode, "ORDER_NOT_FOUND");
    await lookup();
    const limited = await lookup();
    assert.equal(limited.response.status, 429);
    assert.equal(limited.body.errorCode, "RATE_LIMIT_EXCEEDED");
    assert.ok(limited.response.headers.get("ratelimit"));
    server.app.get(OrderLookupRateLimitService).lookup.resetKey("127.0.0.1");
  } finally { await server.close(); }
});
