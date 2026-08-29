import { baseApi, unwrapApiResponse } from "@/services/api/baseApi";
import type {
  AdminProductListItem,
  AdminProductListQueryDto,
  AdminProductListResponse,
  AdminProductDetail,
  CreateAdminProductDto,
  UpdateAdminProductDto,
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
    getProductDetail: builder.query<AdminProductDetail, string>({
      query: (id) => ({
        url: `/admin/products/${id}`,
      }),
      transformResponse: unwrapApiResponse<AdminProductDetail>,
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
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
    updateProduct: builder.mutation<
      AdminProductDetail,
      { id: string; body: UpdateAdminProductDto }
    >({
      query: ({ id, body }) => ({
        url: `/admin/products/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: unwrapApiResponse<AdminProductDetail>,
      invalidatesTags: ["Product"],
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/products/${id}`,
        method: "DELETE",
      }),
      transformResponse: unwrapApiResponse<void>,
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useListProductsQuery,
  useGetProductDetailQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
