import { baseApi, unwrapApiResponse } from "@/services/api/baseApi";
import type {
  AdminProductListItem,
  AdminProductListQueryDto,
  AdminProductListResponse,
  CreateAdminProductDto,
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
    createProduct: builder.mutation<
      AdminProductListItem,
      CreateAdminProductDto
    >({
      query: (body) => ({
        url: "/admin/products",
        method: "POST",
        body,
      }),
      transformResponse: unwrapApiResponse<AdminProductListItem>,
      invalidatesTags: ["Product"],
    }),
  }),
});

export const { useListProductsQuery, useCreateProductMutation } = productApi;
