import { createCatalogState } from "./catalogState.js";
import { queryRows, type Row, type Query } from "../harness/queryFixture.js";

export async function createOrderState() {
  const state = await createCatalogState();
  const instant = new Date("2026-01-01T00:00:00.000Z");
  const orders = new Map<string, Row>();
  const updates: Query[] = [];
  const transactions: Array<unknown> = [];
  const failures = { create: false, casProductId: null as string | null };
  let sequence = 800;
  const nextId = () => `00000000-0000-4000-8000-${String(sequence++).padStart(12, "0")}`;
  const seedOrder = (data: Row = {}) => {
    const id = nextId();
    const item: Row = { id, orderCode: `DH_TEST_${id.slice(-3)}`, customerId: state.customer.id, customerName: "Khách", customerPhone: "0901234567", customerEmail: state.customer.email,
      shippingAddress: "Địa chỉ cũ", shippingProvince: null, shippingDistrict: null, shippingWard: null, customerNote: null, adminNotes: null,
      subtotal: 100000, shippingFee: 0, discountAmount: 0, pointsDiscount: 0, totalAmount: 100000, usedPoints: 0, earnedPoints: 0,
      paymentMethod: "BANK_TRANSFER", paymentStatus: "PENDING", orderStatus: "PENDING_PAYMENT", expiresAt: instant,
      paidAt: null, cancelledAt: null, cancelReason: null, cancellationRequestedAt: null, cancellationRequestedFrom: null, cancellationRequestReason: null,
      shippingUnit: null, trackingCode: null, createdAt: instant, updatedAt: instant, items: [], payments: [], ...data };
    orders.set(id, item); return item;
  };
  const seed = seedOrder();
  const match = (item: Row, where?: Row) => queryRows([item], { where }).length > 0;
  const apply = (item: Row, data: Row) => {
    for (const [key, value] of Object.entries(data)) {
      if (value === undefined) continue;
      if (value !== null && typeof value === "object" && ("increment" in value || "decrement" in value)) {
        const amount = value as { increment?: number; decrement?: number };
        item[key] = Number(item[key]) + (amount.increment ?? 0) - (amount.decrement ?? 0);
      } else item[key] = value;
    }
  };
  const order = {
    findMany: async (query: Query) => queryRows([...orders.values()], query),
    findFirst: async (query: Query) => queryRows([...orders.values()], query)[0] ?? null,
    findUnique: async (query: Query) => queryRows([...orders.values()], query)[0] ?? null,
    findUniqueOrThrow: async (query: Query) => { const item = queryRows([...orders.values()], query)[0]; if (!item) throw new Error("missing order"); return item; },
    create: async (query: Query) => {
      if (failures.create) throw new Error("payment write failed");
      const { items, payments, ...data } = query.data!;
      const item = seedOrder(data);
      item.items = (items as { create: Row[] }).create.map((data) => ({ id: nextId(), orderId: item.id, createdAt: instant, ...data }));
      item.payments = [{ id: nextId(), orderId: item.id, qrImageUrl: null, transactionRef: null, rawWebhookPayload: null, paidAt: null, createdAt: instant, updatedAt: instant, ...(payments as { create: Row }).create }];
      return queryRows([item], query)[0];
    },
    updateMany: async (query: Query) => { let count = 0; for (const item of orders.values()) if (match(item, query.where)) { apply(item, query.data!); count++; } return { count }; },
  };
  Object.assign(state.prisma.product, {
    updateMany: async (query: Query) => { updates.push(query); if (query.where!.id === failures.casProductId) return { count: 0 }; let count = 0; for (const item of state.products.values()) if (match(item, query.where)) { apply(item, query.data!); count++; } return { count }; },
    update: async (query: Query) => { const item = state.products.get(query.where!.id as string)!; apply(item, query.data!); return item; },
  });
  let tail = Promise.resolve();
  const prisma = Object.assign(state.prisma, {
    order,
    payment: { updateMany: async (query: Query) => { for (const order of orders.values()) for (const payment of order.payments as Row[]) if (match(payment, query.where)) apply(payment, query.data!); } },
    $transaction: async (callback: (transaction: unknown) => Promise<unknown>, options?: unknown) => {
      transactions.push(options);
      let release!: () => void;
      const previous = tail;
      tail = new Promise<void>((resolve) => { release = resolve; });
      await previous;
      const orderSnapshot = structuredClone(orders), productSnapshot = structuredClone(state.products);
      try { return await callback(prisma); }
      catch (error) {
        for (const id of orders.keys()) if (!orderSnapshot.has(id)) orders.delete(id);
        for (const [id, item] of orderSnapshot) orders.set(id, Object.assign(orders.get(id) ?? {}, item));
        for (const id of state.products.keys()) if (!productSnapshot.has(id)) state.products.delete(id);
        for (const [id, item] of productSnapshot) state.products.set(id, Object.assign(state.products.get(id) ?? {}, item));
        throw error;
      } finally { release(); }
    },
  });
  return { ...state, prisma, orders, seed, seedOrder, updates, transactions, failures };
}
