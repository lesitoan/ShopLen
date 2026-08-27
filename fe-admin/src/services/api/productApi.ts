import { baseApi, unwrapApiResponse } from "@/services/api/baseApi";
import type {
  AdminProductListQueryDto,
  AdminProductListResponse,
} from "@/types/product.type";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listProducts: builder.query<
      AdminProductListResponse,
      AdminProductListQueryDto | void
    >({
      query: (params) => ({
        url: "/admin/products",
        params: params || {},
      }),
      transformResponse: unwrapApiResponse<AdminProductListResponse>,
      providesTags: ["Product"],
    }),
  }),
});

export const { useListProductsQuery } = productApi;
