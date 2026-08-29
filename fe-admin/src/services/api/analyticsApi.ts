import { baseApi, unwrapApiResponse } from "@/services/api/baseApi";
import type {
  DashboardSummary,
  DashboardRevenueQueryDto,
  DashboardRevenue,
  TopSellingProductsQueryDto,
  TopSellingProductsResponse,
  LowStockProductsQueryDto,
  LowStockProductsResponse,
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
    getTopSellingProducts: builder.query<
      TopSellingProductsResponse,
      TopSellingProductsQueryDto | void
    >({
      query: (params) => ({
        url: "/admin/amalytics/dashboard/top-products",
        params: params || { limit: 5 },
      }),
      transformResponse: unwrapApiResponse<TopSellingProductsResponse>,
      providesTags: ["Order", "Product"],
    }),
    getLowStockProducts: builder.query<
      LowStockProductsResponse,
      LowStockProductsQueryDto | void
    >({
      query: (params) => ({
        url: "/admin/amalytics/dashboard/low-stock",
        params: params || { threshold: 5, limit: 5 },
      }),
      transformResponse: unwrapApiResponse<LowStockProductsResponse>,
      providesTags: ["Product"],
    }),
  }),
});

export const {
  useGetDashboardSummaryQuery,
  useGetDashboardRevenueQuery,
  useGetTopSellingProductsQuery,
  useGetLowStockProductsQuery,
} = analyticsApi;
