import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { Test } from "@nestjs/testing";
import { AppModule } from "@/app.module.js";
import { configureApplication } from "@/bootstrap.js";
import { PrismaService } from "@/infrastructure/prisma/prisma.service.js";
import { RedisService } from "@/infrastructure/redis/redis.service.js";
import { RedisCacheService } from "@/infrastructure/cache/redisCache.service.js";
import { EmailService } from "@/infrastructure/email/email.service.js";
import { NotificationService } from "@/infrastructure/queues/notification.service.js";
import { RealtimeService } from "@/infrastructure/realtime/realtime.service.js";
import { ProductHomeCacheService } from "@/modules/products/services/productHomeCache.service.js";
import { ClientOrderService } from "@/modules/orders/services/clientOrder.service.js";
import { AdminOrderService } from "@/modules/orders/services/adminOrder.service.js";
import { ClientPaymentService } from "@/modules/payments/services/clientPayment.service.js";
import { OrderExpiryService } from "@/modules/orders/services/orderExpiry.service.js";
import { RefreshSessionService } from "@/modules/auth/services/refreshSession.service.js";
import { hashPassword } from "@/modules/auth/security/hashPassword.js";

if (process.env.SHOPLEN_INTEGRATION_TESTS !== "1") throw new Error("Run integration tests through the verified test target runner.");

test("real PostgreSQL and Redis preserve critical order, auth and cache invariants", { timeout: 240000 }, async (context) => {
  const notifications: Array<{ name: string; data: unknown }> = [];
  const email: unknown[] = [];
  const events: unknown[] = [];
  const realtime = { emitOrderStatusChanged: (...args: unknown[]) => { events.push(args); }, emitStockUpdate: (...args: unknown[]) => { events.push(args); }, emitOrderPaid: (...args: unknown[]) => { events.push(args); } };
  const module = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(NotificationService).useValue({ enqueue: async (name: string, data: unknown) => { notifications.push({ name, data }); } })
    .overrideProvider(EmailService).useValue({ sendOrderPaidEmail: async (data: unknown) => { email.push(data); } })
    .overrideProvider(RealtimeService).useValue(realtime).compile();
  const app = configureApplication(module.createNestApplication({ rawBody: true, logger: false }));
  const db = app.get(PrismaService);
  const redis = await app.get(RedisService).getClient();
  const client = app.get(ClientOrderService), admin = app.get(AdminOrderService), payment = app.get(ClientPaymentService);
  const expiry = new OrderExpiryService(db, app.get(NotificationService), app.get(ProductHomeCacheService), realtime as unknown as RealtimeService);
  const suffix = randomUUID().replaceAll("-", "").slice(0, 16);
  const customerId = randomUUID(), categoryId = randomUUID();
  const productIds: string[] = [];
  const cacheKey = `integration:${suffix}:cache`;
  const sessions = app.get(RefreshSessionService);
  try {
    await db.customer.create({ data: { id: customerId, code: `IT${suffix}`, email: `${suffix}@example.test`, fullName: "Integration", passwordHash: await hashPassword("Integration123!"), isManualLogin: true } });
    await db.category.create({ data: { id: categoryId, code: `IT${suffix}`, slug: `integration-${suffix}`, name: "Integration" } });
    const product = async (stock = 1) => {
      const id = randomUUID(); productIds.push(id);
      return db.product.create({ data: { id, code: `IT${id.replaceAll("-", "").slice(0, 16)}`, slug: `integration-${id}`, name: "Integration product", categoryId, originalPrice: 100000, stockQuantity: stock } });
    };
    const checkout = (productId: string) => client.createOrder(customerId, { items: [{ productId, quantity: 1 }], customerName: "Integration", customerPhone: "0901234567", shippingAddress: "Test address", shippingFee: 0 });
    const seedOrder = async (productId: string, expired = false) => {
      const id = randomUUID(), code = `DH${id.replaceAll("-", "").toUpperCase()}`;
      return db.order.create({ data: { id, orderCode: code, customerId, customerEmail: `${suffix}@example.test`, customerName: "Integration", customerPhone: "0901234567", shippingAddress: "Test address", subtotal: 100000, totalAmount: 100000, expiresAt: new Date(Date.now() + (expired ? -60000 : 600000)), items: { create: { productId, unitPrice: 100000, quantity: 1, totalPrice: 100000, productSnapshot: { name: "Integration product" } } }, payments: { create: { provider: "VIETQR", bankName: "TEST", bankBin: "TEST", accountNo: "0000", accountName: "TEST", amount: 100000, transferContent: code } } } });
    };

    await context.test("last-stock contention and transaction rollback", async () => {
      const item = await product();
      const result = await Promise.allSettled([checkout(item.id), checkout(item.id)]);
      assert.equal(result.filter((value) => value.status === "fulfilled").length, 1);
      assert.equal((await db.product.findUniqueOrThrow({ where: { id: item.id } })).stockQuantity, 0);
      assert.equal(await db.order.count({ where: { customerId, items: { some: { productId: item.id } } } }), 1);
      await assert.rejects(db.$transaction(async (tx) => { await tx.product.update({ where: { id: item.id }, data: { stockQuantity: { increment: 50 } } }); throw new Error("rollback probe"); }), /rollback probe/);
      assert.equal((await db.product.findUniqueOrThrow({ where: { id: item.id } })).stockQuantity, 0);
    });

    await context.test("simultaneous admin cancellations restore inventory once", async () => {
      const item = await product(0), order = await seedOrder(item.id);
      const result = await Promise.allSettled(Array.from({ length: 3 }, () => admin.updateOrderStatus(order.id, { orderStatus: "CANCELLED", cancelReason: "Integration" })));
      assert.ok(result.some((value) => value.status === "fulfilled"));
      assert.equal((await db.product.findUniqueOrThrow({ where: { id: item.id } })).stockQuantity, 1);
      assert.equal((await db.order.findUniqueOrThrow({ where: { id: order.id } })).paymentStatus, "FAILED");
    });

    await context.test("admin confirmation races with cancellation without losing paid status", async () => {
      const item = await product(0), order = await seedOrder(item.id);
      await Promise.allSettled([admin.confirmPayment(order.id), admin.updateOrderStatus(order.id, { orderStatus: "CANCELLED", cancelReason: "Integration" })]);
      const stored = await db.order.findUniqueOrThrow({ where: { id: order.id }, include: { payments: true } });
      const stock = (await db.product.findUniqueOrThrow({ where: { id: item.id } })).stockQuantity;
      assert.ok(stored.orderStatus === "PAID" || stored.orderStatus === "CANCELLED");
      assert.equal(stock, stored.orderStatus === "CANCELLED" ? 1 : 0);
      assert.equal(stored.payments[0]!.status, stored.paymentStatus);
    });

    await context.test("duplicate webhooks commit payment and post-commit email once", async () => {
      const item = await product(0), order = await seedOrder(item.id);
      const before = email.length;
      await Promise.all([payment.handleSepayWebhook({ code: order.orderCode, transferAmount: 100000, referenceCode: `IT${suffix}` }), payment.handleSepayWebhook({ code: order.orderCode, transferAmount: 100000, referenceCode: `IT${suffix}` })]);
      assert.equal((await db.order.findUniqueOrThrow({ where: { id: order.id } })).orderStatus, "PAID");
      assert.equal(email.length - before, 1);
      assert.equal((await db.product.findUniqueOrThrow({ where: { id: item.id } })).stockQuantity, 0);
    });

    await context.test("expiry and payment/cancellation races cannot restore stock twice", async () => {
      const item = await product(0), order = await seedOrder(item.id, true);
      await Promise.allSettled([expiry.expirePendingOrders(), client.cancelOrder(customerId, order.id, { reason: "Integration" }), payment.handleSepayWebhook({ code: order.orderCode, transferAmount: 100000, referenceCode: `LATE${suffix}` })]);
      assert.equal((await db.product.findUniqueOrThrow({ where: { id: item.id } })).stockQuantity, 1);
      assert.equal((await db.order.findUniqueOrThrow({ where: { id: order.id } })).orderStatus, "CANCELLED");
      assert.equal(await expiry.expirePendingOrders(), 0);
    });

    await context.test("Redis Lua session eviction and atomic refresh consumption", async () => {
      const session = { accountId: customerId, actorType: "CUSTOMER" as const, jti: randomUUID() };
      await sessions.create(session, 120, 1);
      const results = await Promise.allSettled([sessions.consume(session), sessions.consume(session)]);
      assert.equal(results.filter((value) => value.status === "fulfilled").length, 1);
      const first = { ...session, jti: randomUUID() }, second = { ...session, jti: randomUUID() };
      await sessions.create(first, 120, 1); await sessions.create(second, 120, 1);
      await assert.rejects(sessions.consume(first), { errorCode: "REFRESH_TOKEN_INVALID" });
      await sessions.consume(second);
    });

    await context.test("real cache JSON/TTL and HTTP login/refresh on persisted accounts", async () => {
      const cache = app.get(RedisCacheService);
      let loads = 0;
      assert.deepEqual(await cache.rememberJson(cacheKey, { ttlSeconds: 60, useLock: true }, async () => { loads++; return { value: 1 }; }), { value: 1 });
      await cache.rememberJson(cacheKey, { ttlSeconds: 60, useLock: true }, async () => { loads++; return { value: 2 }; });
      assert.equal(loads, 1); assert.ok(await redis.ttl(cacheKey) > 0);
      await app.listen(0, "127.0.0.1");
      const url = await app.getUrl();
      const login = await fetch(`${url}/api/v1/auth/login`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: `${suffix}@example.test`, password: "Integration123!" }) });
      assert.equal(login.status, 200);
      const cookie = login.headers.get("set-cookie")!.split(";")[0]!;
      const refresh = await fetch(`${url}/api/v1/auth/refresh`, { method: "POST", headers: { Cookie: cookie } });
      assert.equal(refresh.status, 200);
      const replay = await fetch(`${url}/api/v1/auth/refresh`, { method: "POST", headers: { Cookie: cookie } });
      assert.equal(replay.status, 401);
    });
  } finally {
    try {
      await sessions.revokeAll("CUSTOMER", customerId);
      await redis.del([cacheKey, `${cacheKey}:lock`]);
      await db.payment.deleteMany({ where: { order: { customerId } } });
      await db.order.deleteMany({ where: { customerId } });
      await db.product.deleteMany({ where: { id: { in: productIds } } });
      await db.category.deleteMany({ where: { id: categoryId } });
      await db.customer.deleteMany({ where: { id: customerId } });
    } finally { await app.close(); }
  }
});
