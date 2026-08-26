import { baseApi, unwrapApiResponse } from "@/services/api/baseApi";
import type {
  DashboardSummary,
  DashboardRevenueQueryDto,
  DashboardRevenue,
} from "@/types/analytics.type";

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardSummary: builder.query<DashboardSummary, void>({
      query: () => "/admin/amalytics/dashboard/summary",
      transformResponse: unwrapApiResponse<DashboardSummary>,
    }),
    getDashboardRevenue: builder.query<
      DashboardRevenue,
      DashboardRevenueQueryDto
    >({
      query: (params) => ({
        url: "/admin/amalytics/dashboard/revenue",
        params,
      }),
      transformResponse: unwrapApiResponse<DashboardRevenue>,
    }),
  }),
});

export const { useGetDashboardSummaryQuery, useGetDashboardRevenueQuery } =
  analyticsApi;
