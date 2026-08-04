import { baseApi, unwrapApiResponse } from "@/services/api/baseApi";
import type {
  BlogTagApiItem,
  BlogPostApiItem,
  BlogPostListParams,
  BlogPostListResponse,
} from "@/types/blog.type";


export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlogTags: builder.query<BlogTagApiItem[], void>({
      query: () => "/blog/tags",
      transformResponse: unwrapApiResponse<BlogTagApiItem[]>,
      providesTags: ["Blog"],
    }),
    getFeaturedPost: builder.query<BlogPostApiItem | null, void>({
      query: () => "/blog/posts/featured",
      transformResponse: unwrapApiResponse<BlogPostApiItem | null>,
      providesTags: ["Blog"],
    }),
    getBlogPosts: builder.query<BlogPostListResponse, BlogPostListParams | void>({
      query: (params) => ({
        url: "/blog/posts",
        params: params || {},
      }),
      transformResponse: unwrapApiResponse<BlogPostListResponse>,
      providesTags: ["Blog"],
    }),
  }),
});

export const {
  useGetBlogTagsQuery,
  useGetFeaturedPostQuery,
  useGetBlogPostsQuery,
} = blogApi;
