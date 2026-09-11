import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { clearAuthState } from "@/store/slices/authSlice";
import type { ApiResponse } from "@/types/api.type";
import { getAccessToken, saveAuthTokens } from "@/services/authStorage";
import type { AdminAuthTokens } from "@/types/auth.type";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export function unwrapApiResponse<TData>(response: ApiResponse<TData>) {
  if (!response.success) {
    throw new Error(response.message || "Có lỗi xảy ra");
  }

  return response.data;
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
});

const logoutAdminSession = (api: Parameters<typeof rawBaseQuery>[1]) => {
  api.dispatch(clearAuthState());
};

let refreshPromise: Promise<boolean> | null = null;

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status !== 401) {
    return result;
  }

  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshResult = await rawBaseQuery(
        {
          url: "/admin/auth/refresh",
          method: "POST",
          body: {},
        },
        api,
        extraOptions,
      );

      if (refreshResult.error || !refreshResult.data) {
        return false;
      }

      try {
        saveAuthTokens(
          unwrapApiResponse<AdminAuthTokens>(
            refreshResult.data as ApiResponse<AdminAuthTokens>,
          ),
        );
        return true;
      } catch {
        return false;
      }
    })().finally(() => {
      refreshPromise = null;
    });
  }

  if (await refreshPromise) {
    result = await rawBaseQuery(args, api, extraOptions);
  } else {
    logoutAdminSession(api);
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Product",
    "Category",
    "Order",
    "User",
    "Customer",
    "Banner",
    "Blog",
  ],
  endpoints: () => ({}),
});
