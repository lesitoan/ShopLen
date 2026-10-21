import { createOrderState } from "./orderState.js";
import { queryRows, type Row, type Query } from "../harness/queryFixture.js";

export async function createPaymentState() {
  const state = await createOrderState();
  const instant = new Date("2026-01-01T00:00:00.000Z");
  Object.assign(state.seed, { orderCode: "DHSEPAY01", expiresAt: new Date(Date.now() + 300000), items: [{ id: "00000000-0000-4000-8000-000000000901", productId: state.sale.id, unitPrice: 50000, quantity: 2, totalPrice: 100000, productSnapshot: { name: "Product" }, createdAt: instant }] });
  state.seed.payments = [{ id: "00000000-0000-4000-8000-000000000902", orderId: state.seed.id, provider: "VIETQR", method: "BANK_TRANSFER", bankName: "OLD", bankBin: "OLD", accountNo: "old", accountName: "old", amount: 100000, transferContent: state.seed.orderCode, qrImageUrl: null, transactionRef: null, rawWebhookPayload: null, isMatched: false, status: "PENDING", paidAt: null, createdAt: instant, updatedAt: instant }];
  const payments = () => [...state.orders.values()].flatMap((order) => order.payments as Row[]);
  const hydrateOrder = (order: Row) => ({ ...order, customer: state.customers.get(order.customerId as string), _count: { items: (order.items as Row[]).length } });
  const rows = () => [...state.orders.values()].map(hydrateOrder);
  const mutations: Array<{ model: string; query: Query }> = [];
  const failure = { paymentWrite: false };
  const order = Object.assign(state.prisma.order, {
    findMany: async (query: Query) => { mutations.push({ model: "order.findMany", query }); return queryRows(rows(), query); },
    findFirst: async (query: Query) => queryRows(rows(), query)[0] ?? null,
    findUnique: async (query: Query) => queryRows(rows(), query)[0] ?? null,
    count: async (query: Query) => queryRows(rows(), { where: query.where }).length,
    update: async (query: Query) => { const item = state.orders.get(query.where!.id as string)!; Object.assign(item, query.data); return queryRows([hydrateOrder(item)], query)[0]; },
  });
  const payment = {
    findFirst: async (query: Query) => queryRows(payments().map((payment) => ({ ...payment, order: state.orders.get(payment.orderId as string) })), query)[0] ?? null,
    update: async (query: Query) => { if (failure.paymentWrite) throw new Error("payment update failed"); const item = payments().find((item) => item.id === query.where!.id)!; Object.assign(item, query.data); return item; },
    updateMany: async (query: Query) => {
      if (failure.paymentWrite) throw new Error("payment update failed");
      let count = 0;
      for (const item of payments()) if (queryRows([item], { where: query.where }).length) { Object.assign(item, query.data); count++; }
      return { count };
    },
  };
  const transaction = state.prisma.$transaction;
  const prisma = Object.assign(state.prisma, { order, payment,
    $transaction: async (input: Array<Promise<unknown>> | ((transaction: unknown) => Promise<unknown>), options?: unknown) => Array.isArray(input) ? Promise.all(input) : transaction(input, options),
  });
  return { ...state, prisma, payments, mutations, failure };
}
