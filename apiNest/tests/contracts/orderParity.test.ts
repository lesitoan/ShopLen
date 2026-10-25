import "../harness/testEnvironment.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { TokenService } from "@/modules/auth/security/token.service.js";
import { startAuthApplication } from "../harness/authApplication.js";
import { startLegacyServer } from "../harness/contractHarness.js";
import { createOrderState } from "../fixtures/orderState.js";

test("six customer order endpoints preserve Express HTTP contracts, limiter and post-commit side effects", async (context) => {
  context.mock.timers.enable({ apis: ["Date"], now: new Date("2026-10-25T07:00:00.000Z") });
  const state = await createOrderState();
  state.seed.customerId = state.user.id;
  const nest = await startAuthApplication(async () => state);
  let legacy: Awaited<ReturnType<typeof startLegacyServer>> | undefined;
  try {
    legacy = await startLegacyServer("legacyOrderServer.mjs");
    const token = nest.app.get(TokenService).signCustomerAccessToken({ sub: state.customer.id, email: state.customer.email, tokenType: "CUSTOMER" });
    const routes = new Set<string>();
    const compare = async (method: string, path: string, body?: unknown) => {
      const results = [];
      for (const url of [legacy!.url, nest.url]) {
        const response = await fetch(`${url}/api/v1${path}`, { method,
          headers: { "content-type": "application/json", ...(path === "/orders/lookup" ? {} : { Authorization: `Bearer ${token}` }) },
          ...(body === undefined ? {} : { body: JSON.stringify(body) }),
        });
        results.push({ status: response.status, body: await response.json(), type: response.headers.get("content-type"), limiter: response.headers.get("ratelimit"), policy: response.headers.get("ratelimit-policy") });
      }
      assert.deepEqual(results[1], results[0], `${method} ${path}`);
      routes.add(`${method} ${path.split("?")[0]!.replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, ":id")}`);
      return results[1]!;
    };
    const item = { productId: state.sale.id, quantity: 1, selectedOptions: [{ optionType: "COLOR", code: "red" }] };
    const order = await compare("POST", "/orders", { items: [item, item], customerName: "Khách", customerPhone: "0901234567", shippingAddress: "Địa chỉ", shippingFee: 20000 });
    assert.equal(order.status, 201);
    const id = order.body.data.id;
    await compare("GET", "/orders?status=PENDING_PAYMENT");
    await compare("GET", `/orders/${id}`);
    await compare("GET", `/orders/${state.seed.id}`);
    const lookup = { orderCode: order.body.data.orderCode.toLowerCase(), customerPhone: "090 123 4567" };
    await compare("POST", "/orders/lookup", lookup);
    await compare("POST", "/orders/lookup", { ...lookup, customerPhone: "wrong" });
    await compare("PATCH", `/orders/${id}/shipping-address`, { shippingAddress: "Địa chỉ mới", shippingProvince: "HCM", customerName: "Tên mới", customerPhone: "0901234567" });
    await compare("POST", `/orders/${id}/cancel`, { reason: "Đổi ý" });
    await compare("POST", `/orders/${id}/cancel`, { reason: "Đổi ý" });
    await compare("POST", "/orders/lookup", lookup);
    const limited = await compare("POST", "/orders/lookup", lookup);
    assert.equal(limited.status, 429);
    assert.equal(routes.size, 6);
    const effects = await (await fetch(`${legacy.url}/fixtures/effects`)).json();
    assert.deepEqual({ events: nest.events, notifications: state.notifications }, effects);
  } finally { await legacy?.close(); await nest.close(); }
});
