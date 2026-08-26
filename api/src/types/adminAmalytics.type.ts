export type DashboardSummary = {
  revenueToday: number;
  newOrdersToday: number;
  pendingPaymentOrders: number;
  newCustomersToday: number;
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

export type DashboardRevenueBucket = {
  label: string;
  start: Date;
  end: Date;
};
