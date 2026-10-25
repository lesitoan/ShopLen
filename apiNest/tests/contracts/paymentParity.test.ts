import "../harness/testEnvironment.js";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { TokenService } from "@/modules/auth/security/token.service.js";
import { startAuthApplication } from "../harness/authApplication.js";
import { startLegacyServer } from "../harness/contractHarness.js";
import { createPaymentState } from "../fixtures/paymentState.js";

test("seven payment/admin-order endpoints preserve Express HTTP, raw-body signatures and email/queue/socket side effects", async (context) => {
  context.mock.timers.enable({ apis: ["Date"], now: new Date("2026-10-25T07:00:00.000Z") });
  const state = await createPaymentState();
  state.user.role = "STAFF_ORDER";
  const nest = await startAuthApplication(async () => state);
  let legacy: Awaited<ReturnType<typeof startLegacyServer>> | undefined;
  try {
    legacy = await startLegacyServer("legacyPaymentServer.mjs");
    const token = nest.app.get(TokenService).signAdminAccessToken({ sub: state.user.id, email: state.user.email, role: "STAFF_ORDER", tokenType: "ADMIN" });
    const routes = new Set<string>();
    const compare = async (method: string, path: string, body?: unknown, signed = true, contentType = "application/json") => {
      const raw = body === undefined ? undefined : typeof body === "string" ? body : JSON.stringify(body);
      const headers: Record<string, string> = { "content-type": contentType, ...(path.startsWith("/admin") ? { Authorization: `Bearer ${token}` } : {}) };
      if (path.endsWith("/webhook") && signed && raw) {
        headers["x-sepay-timestamp"] = "1234567890";
        headers["x-sepay-signature"] = `sha256=${createHmac("sha256", "test-sepay-secret").update(`1234567890.${raw}`).digest("hex")}`;
      }
      const results = [];
      for (const url of [legacy!.url, nest.url]) {
        const response = await fetch(`${url}/api/v1${path}`, { method, headers, body: raw });
        results.push({ status: response.status, body: await response.json(), type: response.headers.get("content-type") });
      }
      assert.deepEqual(results[1], results[0], `${method} ${path}`);
      routes.add(`${method} ${path.split("?")[0]!.replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, ":id")}`);
      return results[1]!;
    };
    const id = state.seed.id;
    await compare("GET", `/payments/${id}/qr`);
    await compare("POST", "/payments/sepay/webhook", {}, false);
    await compare("POST", "/payments/sepay/webhook", {});
    await compare("POST", "/payments/sepay/webhook", "transferAmount=1&content=unrelated", true, "application/x-www-form-urlencoded");
    await compare("POST", "/payments/sepay/webhook", '{ "content": "Thanh toán dhsepay01", "transferAmount": 50000, "referenceCode": "TX01" }');
    const paid = { code: "DHSEPAY01", transferAmount: 100000, referenceCode: "TX01" };
    await compare("POST", "/payments/sepay/webhook", paid);
    await compare("POST", "/payments/sepay/webhook", paid);
    await compare("GET", "/admin/orders?status=PAID&startDate=2026-01-01&endDate=2026-01-01");
    await compare("GET", `/admin/orders/${id}`);
    await compare("POST", `/admin/orders/${id}/confirm-payment`);
    await compare("POST", `/admin/orders/${id}/confirmPayment`);
    await compare("PATCH", `/admin/orders/${id}/status`, { orderStatus: "PACKING", adminNotes: "Notes", shippingUnit: "GHN", trackingCode: "TRACK" });
    await compare("PATCH", `/admin/orders/${id}/status`, { orderStatus: "CANCELLED" });
    await compare("PATCH", `/admin/orders/${id}/status`, { orderStatus: "CANCELLED", cancelReason: "Khách yêu cầu" });
    await compare("POST", `/admin/orders/${id}/confirm-payment`);
    assert.equal(routes.size, 7);
    const effects = await (await fetch(`${legacy.url}/fixtures/effects`)).json();
    assert.deepEqual(JSON.parse(JSON.stringify({ events: nest.events, paidEvents: nest.paidEvents, paidEmails: nest.paidEmails, notifications: state.notifications })), effects);
  } finally { await legacy?.close(); await nest.close(); }
});
