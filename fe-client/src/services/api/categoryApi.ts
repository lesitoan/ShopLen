import { baseApi, unwrapApiResponse } from "@/services/api/baseApi";
import type { Category } from "@/types/category.type";

export type { Category };

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => "/categories",
      transformResponse: unwrapApiResponse<Category[]>,
      providesTags: ["Category"],
    }),
  }),
});

export const { useGetCategoriesQuery } = categoryApi;
