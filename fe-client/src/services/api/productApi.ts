import { baseApi, unwrapApiResponse } from "@/services/api/baseApi";
import type {
  ProductItem,
  ProductListParams,
  ProductListResponse,
  ProductDetail,
  HomeProductSectionType,
  HomeProductsResponse,
} from "@/types/product.type";

export type {
  ProductItem,
  ProductListParams,
  ProductListResponse,
  ProductDetail,
  HomeProductSectionType,
  HomeProductsResponse,
};

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
    getProductDetailBySlug: builder.query<ProductDetail, string>({
      query: (slug) => `/products/${slug}`,
      transformResponse: unwrapApiResponse<ProductDetail>,
      providesTags: (result, error, slug) => [{ type: "Product", id: slug }],
    }),
    getHomeProducts: builder.query<
      HomeProductsResponse,
      { types: HomeProductSectionType[]; limit?: number }
    >({
      query: (params) => ({
        url: "/products/home",
        params,
      }),
      transformResponse: unwrapApiResponse<HomeProductsResponse>,
      providesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailBySlugQuery,
  useGetHomeProductsQuery,
} = productApi;
