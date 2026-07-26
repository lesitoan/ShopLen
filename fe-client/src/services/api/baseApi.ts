import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAccessToken } from "@/services/authStorage";
import type { ApiResponse } from "@/types/api.type";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export function unwrapApiResponse<TData>(response: ApiResponse<TData>) {
  if (!response.success) {
    throw new Error(response.message);
  }

  return response.data;
}

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = getAccessToken();

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Product", "Category", "Order", "User", "Customer", "Banner"],
  endpoints: () => ({}),
});
