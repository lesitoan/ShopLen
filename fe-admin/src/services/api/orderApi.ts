import { baseApi, unwrapApiResponse } from "@/services/api/baseApi";
import type {
  AdminOrderListQueryDto,
  AdminOrderListResponse,
} from "@/types/order.type";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listOrders: builder.query<
      AdminOrderListResponse,
      AdminOrderListQueryDto | void
    >({
      query: (params) => ({
        url: "/admin/orders",
        params: params || {},
      }),
      transformResponse: unwrapApiResponse<AdminOrderListResponse>,
      providesTags: ["Order"],
    }),
  }),
});

export const { useListOrdersQuery } = orderApi;
