import { baseApi, unwrapApiResponse } from "@/services/api/baseApi";
import type { ApiResponse } from "@/types/api.type";
import type { PaymentQrResponseData } from "@/types/payment.type";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentQr: builder.query<PaymentQrResponseData, string>({
      query: (orderId) => `/payments/${orderId}/qr`,
      transformResponse: (response: ApiResponse<PaymentQrResponseData>) =>
        unwrapApiResponse(response),
      providesTags: (_result, _error, orderId) => [{ type: "Order", id: orderId }],
    }),
  }),
});

export const { useGetPaymentQrQuery } = paymentApi;
