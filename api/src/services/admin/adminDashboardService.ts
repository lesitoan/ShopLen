export const adminDashboardService = {
  async getOverview() {
    return {
      revenueToday: 0,
      orderToday: 0,
      pendingOrder: 0,
    };
  },
};
