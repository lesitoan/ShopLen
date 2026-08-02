import { baseApi, unwrapApiResponse } from "@/services/api/baseApi";
import type { ApiResponse } from "@/types/api.type";
import type {
  CreateOrderPayload,
  OrderResponseData,
  CustomerOrderResponse,
  OrderDetailResponse,
  LookupOrderPayload,
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

    lookupOrder: builder.mutation<OrderDetailResponse, LookupOrderPayload>({
      query: (body) => ({
        url: "/orders/lookup",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<OrderDetailResponse>) =>
        unwrapApiResponse(response),
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

    cancelOrder: builder.mutation<
      { orderStatus: string; message?: string },
      { id: string; reason?: string }
    >({
      query: ({ id, reason }) => ({
        url: `/orders/${id}/cancel`,
        method: "POST",
        body: { reason },
      }),
      transformResponse: (response: ApiResponse<{ orderStatus: string; message?: string }>) =>
        unwrapApiResponse(response),
      invalidatesTags: ["Order"],
    }),

    updateOrderShippingAddress: builder.mutation<
      OrderDetailResponse,
      {
        id: string;
        customerName?: string;
        customerPhone?: string;
        shippingAddress: string;
        shippingProvince?: string;
        shippingDistrict?: string;
        shippingWard?: string;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/orders/${id}/shipping-address`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: ApiResponse<OrderDetailResponse>) =>
        unwrapApiResponse(response),
      invalidatesTags: (_result, _error, { id }) => [
        "Order",
        { type: "Order", id },
      ],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useLookupOrderMutation,
  useGetCustomerOrdersQuery,
  useGetOrderDetailQuery,
  useCancelOrderMutation,
  useUpdateOrderShippingAddressMutation,
} = orderApi;
