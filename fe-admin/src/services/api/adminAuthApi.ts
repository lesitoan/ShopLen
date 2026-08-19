import { baseApi, unwrapApiResponse } from "@/services/api/baseApi";
import type {
  AdminAuthTokens,
  AdminLoginRequest,
  AdminLogoutRequest,
  AdminRefreshTokenRequest,
  AdminSession,
} from "@/types/auth.type";

export const adminAuthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation<AdminAuthTokens, AdminLoginRequest>({
      query: (body) => ({
        url: "/admin/auth/login",
        method: "POST",
        body,
      }),
      transformResponse: unwrapApiResponse<AdminAuthTokens>,
    }),

    getMe: builder.query<AdminSession, void>({
      query: () => "/admin/auth/me",
      transformResponse: unwrapApiResponse<AdminSession>,
      providesTags: ["User"],
    }),

    adminRefresh: builder.mutation<
      AdminAuthTokens,
      AdminRefreshTokenRequest
    >({
      query: (body) => ({
        url: "/admin/auth/refresh",
        method: "POST",
        body,
      }),
      transformResponse: unwrapApiResponse<AdminAuthTokens>,
    }),

    adminLogout: builder.mutation<
      { loggedOut: boolean },
      AdminLogoutRequest | void
    >({
      query: (body) => ({
        url: "/admin/auth/logout",
        method: "POST",
        body: body ?? {},
      }),
      transformResponse: unwrapApiResponse<{ loggedOut: boolean }>,
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useAdminRefreshMutation,
  useAdminLogoutMutation,
} = adminAuthApi;
