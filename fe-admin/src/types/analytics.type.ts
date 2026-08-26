export type DashboardSummary = {
  revenueToday: number;
  newOrdersToday: number;
  pendingPaymentOrders: number;
  newCustomersToday: number;
};

export type DashboardRevenueQueryDto = {
  startDate: string;
  endDate: string;
};

export type DashboardRevenuePoint = {
  label: string;
  revenue: number;
  orders: number;
};

export type DashboardRevenue = {
  startDate: string;
  endDate: string;
  points: DashboardRevenuePoint[];
};
