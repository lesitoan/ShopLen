import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  saveAuthTokens,
} from "@/services/authStorage";
import { clearAuthState } from "@/store/slices/authSlice";
import type { ApiResponse } from "@/types/api.type";
import type { AuthTokens } from "@/types/auth.type";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export function unwrapApiResponse<TData>(response: ApiResponse<TData>) {
  if (!response.success) {
    throw new Error(response.message);
  }

  return response.data;
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = getAccessToken();

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const logoutClientSession = (api: Parameters<typeof rawBaseQuery>[1]) => {
  clearAuthTokens();
  api.dispatch(clearAuthState());
};

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status !== 401) {
    return result;
  }

  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    logoutClientSession(api);
    return result;
  }

  const refreshResult = await rawBaseQuery(
    {
      url: "/auth/refresh",
      method: "POST",
      body: { refreshToken },
    },
    api,
    extraOptions,
  );

  if (refreshResult.data) {
    try {
      const tokens = unwrapApiResponse<AuthTokens>(
        refreshResult.data as ApiResponse<AuthTokens>,
      );
      saveAuthTokens(tokens);
      result = await rawBaseQuery(args, api, extraOptions);
    } catch {
      logoutClientSession(api);
    }
  } else {
    logoutClientSession(api);
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
    "CustomerAddress",
    "Banner",
  ],
  endpoints: () => ({}),
});
