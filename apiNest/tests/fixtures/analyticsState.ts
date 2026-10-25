import { createPaymentState } from "./paymentState.js";
import { queryRows, type Query, type Row } from "../harness/queryFixture.js";

export async function createAnalyticsState() {
  const state = await createPaymentState();
  state.user.role = "ADMIN";
  const today = new Date(); today.setHours(12, 0, 0, 0);
  Object.assign(state.seed, { paymentStatus: "PAID", orderStatus: "PAID", paidAt: today, createdAt: today });
  Object.assign(state.prisma.customer, { count: async (query: Query) => queryRows([...state.customers.values()], { where: query.where }).length });
  const grouped: Row[] = [{ productId: state.sale.id, _sum: { quantity: 2, totalPrice: 100000 } }];
  const calls: Array<{ model: string; query: Query }> = [];
  Object.assign(state.prisma.order, { aggregate: async (query: Query) => {
    calls.push({ model: "aggregate", query });
    const rows = queryRows([...state.orders.values()], { where: query.where });
    return { _sum: { totalAmount: rows.length ? rows.reduce((sum, row) => sum + Number(row.totalAmount), 0) : null } };
  } });
  Object.assign(state.prisma, { orderItem: { groupBy: async (query: Query) => { calls.push({ model: "groupBy", query }); return query.where?.order && queryRows([state.seed], { where: query.where.order as Row }).length ? grouped : []; } } });
  return { ...state, grouped, calls };
}
