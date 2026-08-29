import { baseApi, unwrapApiResponse } from "@/services/api/baseApi";
import type {
  AdminCategoryItem,
  AdminCategoryListQueryDto,
  AdminCategoryListResponse,
  CreateAdminCategoryDto,
  UpdateAdminCategoryDto,
} from "@/types/category.type";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listCategories: builder.query<
      AdminCategoryListResponse,
      AdminCategoryListQueryDto | void
    >({
      query: (params) => ({
        url: "/admin/categories",
        params: params || {},
      }),
      transformResponse: unwrapApiResponse<AdminCategoryListResponse>,
      providesTags: ["Category"],
    }),
    getCategoryDetail: builder.query<AdminCategoryItem, string>({
      query: (id) => `/admin/categories/${id}`,
      transformResponse: unwrapApiResponse<AdminCategoryItem>,
      providesTags: (_result, _error, id) => [{ type: "Category", id }],
    }),
    createCategory: builder.mutation<void, CreateAdminCategoryDto>({
      query: (body) => ({
        url: "/admin/categories",
        method: "POST",
        body,
      }),
      transformResponse: unwrapApiResponse<void>,
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation<
      void,
      { id: string; data: UpdateAdminCategoryDto }
    >({
      query: ({ id, data }) => ({
        url: `/admin/categories/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: unwrapApiResponse<void>,
      invalidatesTags: (_result, _error, { id }) => [
        "Category",
        { type: "Category", id },
      ],
    }),
    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/categories/${id}`,
        method: "DELETE",
      }),
      transformResponse: unwrapApiResponse<void>,
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useListCategoriesQuery,
  useGetCategoryDetailQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
