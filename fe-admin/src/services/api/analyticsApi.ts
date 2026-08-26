import { baseApi, unwrapApiResponse } from "@/services/api/baseApi";

export type DashboardSummary = {
  revenueToday: number;
  newOrdersToday: number;
  pendingPaymentOrders: number;
  newCustomersToday: number;
};

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardSummary: builder.query<DashboardSummary, void>({
      query: () => "/admin/amalytics/dashboard/summary",
      transformResponse: unwrapApiResponse<DashboardSummary>,
    }),
  }),
});

export const { useGetDashboardSummaryQuery } = analyticsApi;
