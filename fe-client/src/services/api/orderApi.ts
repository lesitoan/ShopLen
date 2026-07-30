import { baseApi, unwrapApiResponse } from "@/services/api/baseApi";
import type { ApiResponse } from "@/types/api.type";
import type {
  CreateOrderPayload,
  OrderResponseData,
  CustomerOrderResponse,
  OrderDetailResponse,
} from "@/types/order.type";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<OrderResponseData, CreateOrderPayload>({
      query: (body) => ({
        url: "/orders",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<OrderResponseData>) =>
        unwrapApiResponse(response),
      invalidatesTags: ["Order"],
    }),

    getCustomerOrders: builder.query<CustomerOrderResponse[], { status?: string } | void>({
      query: (params) => ({
        url: "/orders",
        params: params?.status ? { status: params.status } : undefined,
      }),
      transformResponse: (response: ApiResponse<CustomerOrderResponse[]>) =>
        unwrapApiResponse(response),
      providesTags: ["Order"],
    }),

    getOrderDetail: builder.query<OrderDetailResponse, string>({
      query: (id) => `/orders/${id}`,
      transformResponse: (response: ApiResponse<OrderDetailResponse>) =>
        unwrapApiResponse(response),
      providesTags: (_result, _error, id) => [{ type: "Order", id }],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetCustomerOrdersQuery,
  useGetOrderDetailQuery,
} = orderApi;
