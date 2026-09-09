import { baseApi, unwrapApiResponse } from "@/services/api/baseApi";
import type {
  AdminBlogPostListQueryDto,
  AdminBlogPostListResponse,
  BlogPostDetail,
  BlogPostTag,
  CreateAdminBlogPostDto,
  UpdateAdminBlogPostDto,
  BlogPostStatus,
} from "@/types/blog.type";

export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listBlogPosts: builder.query<
      AdminBlogPostListResponse,
      AdminBlogPostListQueryDto | void
    >({
      query: (params) => ({
        url: "/admin/blog/posts",
        params: params || {},
      }),
      transformResponse: unwrapApiResponse<AdminBlogPostListResponse>,
      providesTags: ["Blog"],
    }),

    getBlogPostDetail: builder.query<BlogPostDetail, string>({
      query: (id) => `/admin/blog/posts/${id}`,
      transformResponse: unwrapApiResponse<BlogPostDetail>,
      providesTags: (_result, _error, id) => [{ type: "Blog", id }],
    }),

    listBlogTags: builder.query<BlogPostTag[], void>({
      query: () => "/admin/blog/tags",
      transformResponse: unwrapApiResponse<BlogPostTag[]>,
      providesTags: ["Blog"],
    }),

    createBlogPost: builder.mutation<BlogPostDetail, CreateAdminBlogPostDto>({
      query: (body) => ({
        url: "/admin/blog/posts",
        method: "POST",
        body,
      }),
      transformResponse: unwrapApiResponse<BlogPostDetail>,
      invalidatesTags: ["Blog"],
    }),

    updateBlogPost: builder.mutation<
      BlogPostDetail,
      { id: string; data: UpdateAdminBlogPostDto }
    >({
      query: ({ id, data }) => ({
        url: `/admin/blog/posts/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: unwrapApiResponse<BlogPostDetail>,
      invalidatesTags: (_result, _error, { id }) => [
        "Blog",
        { type: "Blog", id },
      ],
    }),

    updateBlogPostStatus: builder.mutation<
      void,
      { id: string; status: BlogPostStatus }
    >({
      query: ({ id, status }) => ({
        url: `/admin/blog/posts/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      transformResponse: unwrapApiResponse<void>,
      invalidatesTags: (_result, _error, { id }) => [
        "Blog",
        { type: "Blog", id },
      ],
    }),

    deleteBlogPost: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/blog/posts/${id}`,
        method: "DELETE",
      }),
      transformResponse: unwrapApiResponse<void>,
      invalidatesTags: ["Blog"],
    }),

    createBlogTag: builder.mutation<
      BlogPostTag,
      { name: string; slug?: string }
    >({
      query: (body) => ({
        url: "/admin/blog/tags",
        method: "POST",
        body,
      }),
      transformResponse: unwrapApiResponse<BlogPostTag>,
      invalidatesTags: ["Blog"],
    }),

    updateBlogTag: builder.mutation<
      BlogPostTag,
      { id: string; data: { name?: string; slug?: string } }
    >({
      query: ({ id, data }) => ({
        url: `/admin/blog/tags/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: unwrapApiResponse<BlogPostTag>,
      invalidatesTags: ["Blog"],
    }),

    deleteBlogTag: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/blog/tags/${id}`,
        method: "DELETE",
      }),
      transformResponse: unwrapApiResponse<void>,
      invalidatesTags: ["Blog"],
    }),
  }),
});

export const {
  useListBlogPostsQuery,
  useGetBlogPostDetailQuery,
  useListBlogTagsQuery,
  useCreateBlogPostMutation,
  useUpdateBlogPostMutation,
  useUpdateBlogPostStatusMutation,
  useDeleteBlogPostMutation,
  useCreateBlogTagMutation,
  useUpdateBlogTagMutation,
  useDeleteBlogTagMutation,
} = blogApi;
