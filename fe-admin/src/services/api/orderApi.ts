import { baseApi, unwrapApiResponse } from "@/services/api/baseApi";
import type {
  AdminOrderListQueryDto,
  AdminOrderListResponse,
  AdminOrderDetail,
  UpdateAdminOrderStatusDto,
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
    getOrderDetail: builder.query<AdminOrderDetail, string>({
      query: (id) => ({
        url: `/admin/orders/${id}`,
      }),
      transformResponse: unwrapApiResponse<AdminOrderDetail>,
      providesTags: (_result, _error, id) => [{ type: "Order", id }],
    }),
    updateOrderStatus: builder.mutation<
      AdminOrderDetail,
      { id: string; body: UpdateAdminOrderStatusDto }
    >({
      query: ({ id, body }) => ({
        url: `/admin/orders/${id}/status`,
        method: "PATCH",
        body,
      }),
      transformResponse: unwrapApiResponse<AdminOrderDetail>,
      invalidatesTags: ["Order"],
    }),
    confirmPayment: builder.mutation<AdminOrderDetail, string>({
      query: (id) => ({
        url: `/admin/orders/${id}/confirm-payment`,
        method: "POST",
      }),
      transformResponse: unwrapApiResponse<AdminOrderDetail>,
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useListOrdersQuery,
  useGetOrderDetailQuery,
  useUpdateOrderStatusMutation,
  useConfirmPaymentMutation,
} = orderApi;
