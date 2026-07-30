import { baseApi, unwrapApiResponse } from "./baseApi";
import type { ApiResponse } from "@/types/api.type";
import type { CartProductsResponseData } from "@/types/cart.type";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCartProducts: builder.mutation<CartProductsResponseData, { ids: string[] }>({
      query: (body) => ({
        url: "/cart/products",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<CartProductsResponseData>) =>
        unwrapApiResponse(response),
    }),
  }),
});

export const { useGetCartProductsMutation } = cartApi;
