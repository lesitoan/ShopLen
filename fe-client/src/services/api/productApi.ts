import { baseApi, unwrapApiResponse } from "@/services/api/baseApi";
import type {
  ProductItem,
  ProductListParams,
  ProductListResponse,
} from "@/types/product.type";

export type { ProductItem, ProductListParams, ProductListResponse };

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductListResponse, ProductListParams | void>({
      query: (params) => ({
        url: "/products",
        params: params || {},
      }),
      transformResponse: unwrapApiResponse<ProductListResponse>,
      providesTags: ["Product"],
    }),
  }),
});

export const { useGetProductsQuery } = productApi;
