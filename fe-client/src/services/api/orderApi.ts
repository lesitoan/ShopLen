import { baseApi, unwrapApiResponse } from "@/services/api/baseApi";
import type { ApiResponse } from "@/types/api.type";
import type { CreateOrderPayload, OrderResponseData } from "@/types/order.type";

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

    getOrderDetail: builder.query<OrderResponseData, string>({
      query: (id) => `/orders/${id}`,
      transformResponse: (response: ApiResponse<OrderResponseData>) =>
        unwrapApiResponse(response),
      providesTags: (_result, _error, id) => [{ type: "Order", id }],
    }),
  }),
});

export const { useCreateOrderMutation, useGetOrderDetailQuery } = orderApi;
