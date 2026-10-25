import "../harness/testEnvironment.js";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { EnvService } from "@/config/env.service.js";
import { EmailService } from "@/infrastructure/email/email.service.js";
import { ClientPaymentService } from "@/modules/payments/services/clientPayment.service.js";
import { ClientOrderService } from "@/modules/orders/services/clientOrder.service.js";
import { startAuthApplication, authRequest } from "../harness/authApplication.js";
import { createPaymentState } from "../fixtures/paymentState.js";

test("public QR and signed webhook retain raw bytes, validation precedence, amount matching and idempotent post-commit effects", async () => {
  const state = await createPaymentState();
  const server = await startAuthApplication(async () => state);
  const env = server.app.get(EnvService).values;
  const original = { ...env };
  Object.assign(env, { SEPAY_WEBHOOK_AUTH_TYPE: "HMAC", SEPAY_WEBHOOK_SECRET: "test-sepay-secret" });
  const send = async (raw: string, signature?: string, timestamp = "1234567890", contentType = "application/json") => {
    const response = await fetch(`${server.url}/api/v1/payments/sepay/webhook`, { method: "POST", headers: { "content-type": contentType, "x-sepay-timestamp": timestamp, ...(signature ? { "x-sepay-signature": signature } : {}) }, body: raw });
    return { response, body: await response.json() };
  };
  const signature = (raw: string) => `sha256=${createHmac("sha256", "test-sepay-secret").update(`1234567890.${raw}`).digest("hex")}`;
  const payload = (amount: number) => JSON.stringify({ id: 1, referenceCode: "TX_1", content: "Thanh toán dhsepay01", transferAmount: amount });
  try {
    const qr = await authRequest(server.url, `/payments/${state.seed.id}/qr`);
    assert.equal(qr.response.status, 200);
    assert.equal(qr.body.data.accountNo, "0000000000");
    assert.equal(new URL(qr.body.data.qrImageUrl).searchParams.get("des"), "DHSEPAY01");
    assert.equal(state.payments()[0]!.qrImageUrl, qr.body.data.qrImageUrl);
    assert.equal((await send('{}')).body.errorCode, "SEPAY_SIGNATURE_MISSING");
    assert.equal((await send('{}', "bad")).body.errorCode, "SEPAY_SIGNATURE_INVALID");
    assert.equal((await send('{}', signature('{}').slice(0, -1) + (signature('{}').endsWith("0") ? "1" : "0"))).body.errorCode, "SEPAY_SIGNATURE_INVALID");
    assert.equal((await send('{}', signature('{}'), "different-timestamp")).body.errorCode, "SEPAY_SIGNATURE_INVALID");
    const form = "transferAmount=1&content=unrelated";
    assert.equal((await send(form, signature(form), "1234567890", "application/x-www-form-urlencoded")).body.errorCode, "SEPAY_SIGNATURE_MISSING");
    assert.equal((await send('{}', signature('{}'))).body.errorCode, "SEPAY_WEBHOOK_PAYLOAD_INVALID");
    const pretty = '{ "content": "dhsepay01", "transferAmount": 50000 }';
    assert.equal((await send(pretty, signature(JSON.stringify(JSON.parse(pretty))))).response.status, 401);
    assert.equal((await send(pretty, signature(pretty))).response.status, 200);
    assert.equal(state.payments()[0]!.status, "MISMATCHED");
    assert.equal(state.seed.orderStatus, "PENDING_PAYMENT");
    assert.equal(server.paidEmails.length, 0);
    const paid = payload(100001);
    const replies = await Promise.all([send(paid, signature(paid)), send(paid, signature(paid))]);
    assert.deepEqual(replies.map((item) => item.body), [{ success: true }, { success: true }]);
    assert.equal(state.seed.orderStatus, "PAID");
    assert.equal(state.payments()[0]!.status, "PAID");
    assert.equal(server.paidEmails.length, 1);
    assert.equal(state.notifications.length, 1);
    assert.equal(server.events.length, 0);
    env.SEPAY_WEBHOOK_AUTH_TYPE = "NONE";
    assert.equal((await send(JSON.stringify({ transferAmount: 1, content: "unrelated" }))).response.status, 200);
    env.SEPAY_WEBHOOK_AUTH_TYPE = "HMAC";
    env.SEPAY_WEBHOOK_SECRET = undefined;
    assert.equal((await send(paid, signature(paid))).body.errorCode, "SEPAY_WEBHOOK_SECRET_MISSING");
  } finally { Object.assign(env, original); await server.close(); }
});

test("webhook payment rollback, expiry/cancel guards and email failure preserve durable payment state", async () => {
  const state = await createPaymentState();
  const server = await startAuthApplication(async () => state);
  const service = server.app.get(ClientPaymentService);
  const body = { code: "DHSEPAY01", transferAmount: 100000, referenceCode: "TX_TEST" };
  try {
    state.failure.paymentWrite = true;
    await assert.rejects(service.handleSepayWebhook(body), /payment update failed/);
    assert.equal(state.seed.orderStatus, "PENDING_PAYMENT");
    assert.equal(state.payments()[0]!.status, "PENDING");
    assert.equal(state.notifications.length, 0);
    state.failure.paymentWrite = false;
    state.seed.expiresAt = new Date(Date.now() - 1);
    await service.handleSepayWebhook(body);
    assert.equal(state.seed.orderStatus, "PENDING_PAYMENT");
    state.seed.expiresAt = new Date(Date.now() + 300000);
    state.seed.orderStatus = "CANCELLED";
    await service.handleSepayWebhook(body);
    assert.equal(state.seed.orderStatus, "CANCELLED");
    state.seed.orderStatus = "PENDING_PAYMENT";
    server.app.get(EmailService).sendOrderPaidEmail = async () => { throw new Error("email unavailable"); };
    await service.handleSepayWebhook(body);
    assert.equal(state.seed.orderStatus, "PAID");
    assert.equal(state.notifications.length, 1);
  } finally { await server.close(); }
});

test("payment/cancellation ordering preserves stock and payment invariants in both transaction orderings", async () => {
  for (const paymentFirst of [true, false]) {
    const state = await createPaymentState();
    const server = await startAuthApplication(async () => state);
    try {
      const pay = () => server.app.get(ClientPaymentService).handleSepayWebhook({ code: "DHSEPAY01", transferAmount: 100000 });
      const cancel = () => server.app.get(ClientOrderService).cancelOrder(state.customer.id, state.seed.id as string, { reason: "Khách hủy" });
      await Promise.all(paymentFirst ? [pay(), cancel()] : [cancel(), pay()]);
      assert.equal(state.seed.orderStatus, paymentFirst ? "CANCELLATION_REQUESTED" : "CANCELLED");
      assert.equal(state.seed.paymentStatus, paymentFirst ? "PAID" : "FAILED");
      assert.equal(state.products.get(state.sale.id as string)!.stockQuantity, paymentFirst ? 5 : 7);
      assert.equal(server.paidEmails.length, paymentFirst ? 1 : 0);
    } finally { await server.close(); }
  }
});
