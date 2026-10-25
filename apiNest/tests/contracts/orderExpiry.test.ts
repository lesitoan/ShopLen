import "../harness/testEnvironment.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { OrderExpiryService } from "@/modules/orders/services/orderExpiry.service.js";
import { PrismaService } from "@/infrastructure/prisma/prisma.service.js";
import { NotificationService } from "@/infrastructure/queues/notification.service.js";
import { ProductHomeCacheService } from "@/modules/products/services/productHomeCache.service.js";
import { RealtimeService } from "@/infrastructure/realtime/realtime.service.js";
import { ClientPaymentService } from "@/modules/payments/services/clientPayment.service.js";
import { startAuthApplication } from "../harness/authApplication.js";
import { createPaymentState } from "../fixtures/paymentState.js";
import { startLegacyServer } from "../harness/contractHarness.js";
import type { Row, Query } from "../harness/queryFixture.js";

async function fixture() {
  const state = await createPaymentState();
  state.seed.expiresAt = new Date(Date.now() - 1);
  const server = await startAuthApplication(async () => state);
  const stock: Array<{ productId: string; stock: number }> = [];
  const service = new OrderExpiryService(server.app.get(PrismaService), server.app.get(NotificationService), server.app.get(ProductHomeCacheService), {
    emitOrderStatusChanged: (orderId: string, orderStatus: string) => server.events.push({ orderId, orderStatus }),
    emitStockUpdate: (productId: string, quantity: number) => stock.push({ productId, stock: quantity }),
  } as unknown as RealtimeService);
  return { state, server, service, stock };
}

test("expiry CAS restores stock once, fails pending/mismatched payments and emits cache/socket/queue only after commit", async () => {
  const { state, server, service, stock } = await fixture();
  const before = Number(state.sale.stockQuantity);
  state.payments()[0]!.status = "MISMATCHED";
  (state.seed.items as Row[]).push({ productId: null, quantity: 99 });
  await state.redis.set("home:products:HOT_PRODUCT", "cached", { EX: 600 });
  try {
    assert.equal(await service.expirePendingOrders(), 1);
    assert.equal(state.seed.orderStatus, "CANCELLED");
    assert.equal(state.seed.paymentStatus, "FAILED");
    assert.equal(state.payments()[0]!.status, "FAILED");
    assert.equal(state.sale.stockQuantity, before + 2);
    assert.equal(stock.length, 1);
    assert.equal(await state.redis.get("home:products:HOT_PRODUCT"), null);
    assert.deepEqual(stock[0], { productId: state.sale.id, stock: before + 2 });
    assert.equal(server.events.length, 1);
    assert.equal(state.notifications[0]!.name, "ORDER_CANCELLED");
    assert.equal((state.notifications[0]!.data as Row).reason, "Đơn hàng đã hết hạn thanh toán.");
    assert.equal(await service.expirePendingOrders(), 0);
    assert.equal(state.sale.stockQuantity, before + 2);
    assert.equal(state.notifications.length, 1);
    await server.app.get(ClientPaymentService).handleSepayWebhook({ code: "DHSEPAY01", transferAmount: 100000, referenceCode: "LATE" });
    assert.equal(state.seed.orderStatus, "CANCELLED");
    assert.equal(server.paidEmails.length, 0);
  } finally { await server.close(); }
});

test("expiry rollback leaves inventory/payment intact and stale expiry candidates cannot cancel a payment winner", async () => {
  const { state, server, service, stock } = await fixture();
  const before = Number(state.sale.stockQuantity);
  try {
    state.failure.paymentWrite = true;
    await assert.rejects(service.expirePendingOrders(), /payment update failed/);
    assert.equal(state.seed.orderStatus, "PENDING_PAYMENT");
    assert.equal(state.sale.stockQuantity, before);
    assert.equal(stock.length, 0);
    assert.equal(state.notifications.length, 0);
    state.failure.paymentWrite = false;
    const findMany = state.prisma.order.findMany;
    let intercepted = false;
    state.prisma.order.findMany = async (query) => {
      const result = await findMany(query);
      if (!intercepted) {
        intercepted = true;
        state.seed.expiresAt = new Date(Date.now() + 60000);
        await server.app.get(ClientPaymentService).handleSepayWebhook({ code: "DHSEPAY01", transferAmount: 100000, referenceCode: "WIN" });
      }
      return result;
    };
    assert.equal(await service.expirePendingOrders(), 0);
    assert.equal(state.seed.orderStatus, "PAID");
    assert.equal(state.sale.stockQuantity, before);
    assert.equal(stock.length, 0);
    assert.equal(state.notifications.length, 1);
    assert.equal(state.notifications[0]!.name, "ORDER_PAID");
  } finally { await server.close(); }
});

test("expiry run caps scanning at ten batches of one hundred and keeps the transaction timeout", async () => {
  const { state, server, service } = await fixture();
  let scans = 0;
  state.prisma.order.findMany = async (query) => {
    assert.equal(query.take, 100);
    assert.deepEqual(query.orderBy, { expiresAt: "asc" });
    scans++;
    return Array.from({ length: 100 }, () => ({ id: "missing" }));
  };
  try {
    assert.equal(await service.expirePendingOrders(), 0);
    assert.equal(scans, 10);
    assert.equal(state.transactions.length, 1000);
    assert.deepEqual(state.transactions[0], { timeout: 15000 });
  } finally { await server.close(); }
});

test("expiry mutations and post-commit cache/socket/queue payloads match Express across repeated sweeps", async (context) => {
  context.mock.timers.enable({ apis: ["Date"], now: new Date("2026-10-25T07:00:00.000Z") });
  const { state, server, service, stock } = await fixture();
  const cacheKeys: string[] = [];
  server.app.get(ProductHomeCacheService).invalidateHomeProductCache = async () => { cacheKeys.push(...["BEST_SELLING", "TODAY_DEAL", "HOT_PRODUCT", "HOT_TIKTOK"].map((name) => `home:products:${name}`)); };
  let legacy: Awaited<ReturnType<typeof startLegacyServer>> | undefined;
  try {
    legacy = await startLegacyServer("legacyExpiryServer.mjs");
    for (let run = 0; run < 2; run++) {
      const expected = await (await fetch(`${legacy.url}/fixtures/expire`, { method: "POST" })).json();
      const count = await service.expirePendingOrders();
      const actual = JSON.parse(JSON.stringify({ count, orders: [...state.orders.values()], products: [...state.products.values()], events: server.events, stock, notifications: state.notifications, cacheKeys }));
      assert.deepEqual(actual, expected);
    }
  } finally { await legacy?.close(); await server.close(); }
});

test("expiry publishes committed cancellations even when a later order transaction fails", async () => {
  const { state, server, service, stock } = await fixture();
  const before = Number(state.sale.stockQuantity);
  state.seed.expiresAt = new Date(Date.now() - 2);
  const second = state.seedOrder({ expiresAt: new Date(Date.now() - 1), items: structuredClone(state.seed.items), payments: [] });
  const update = state.prisma.payment.updateMany;
  Object.assign(state.prisma.payment, { updateMany: async (query: Query) => {
    if (query.where?.orderId === second.id) throw new Error("second order failed");
    return update(query);
  } });
  await state.redis.set("home:products:HOT_PRODUCT", "cached", { EX: 600 });
  try {
    await assert.rejects(service.expirePendingOrders(), /second order failed/);
    assert.equal(state.seed.orderStatus, "CANCELLED");
    assert.equal(second.orderStatus, "PENDING_PAYMENT");
    assert.equal(state.sale.stockQuantity, before + 2);
    assert.equal(server.events.length, 1);
    assert.equal(stock.length, 1);
    assert.equal(state.notifications.length, 1);
    assert.equal(await state.redis.get("home:products:HOT_PRODUCT"), null);
  } finally { await server.close(); }
});
