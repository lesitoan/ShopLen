import { baseApi, unwrapApiResponse } from "@/services/api/baseApi";
import type {
  ChangePasswordRequest,
  CustomerSession,
  UpdateCustomerProfileRequest,
} from "@/types/auth.type";

export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateCustomerProfile: builder.mutation<
      CustomerSession,
      UpdateCustomerProfileRequest
    >({
      query: (body) => ({
        url: "/customers/me",
        method: "PATCH",
        body,
      }),
      transformResponse: unwrapApiResponse<CustomerSession>,
      invalidatesTags: ["Customer"],
    }),

    updateCustomerAvatar: builder.mutation<CustomerSession, FormData>({
      query: (formData) => ({
        url: "/customers/me/avatar",
        method: "PATCH",
        body: formData,
      }),
      transformResponse: unwrapApiResponse<CustomerSession>,
      invalidatesTags: ["Customer"],
    }),

    changePassword: builder.mutation<{ changed: boolean }, ChangePasswordRequest>({
      query: (body) => ({
        url: "/customers/me/password",
        method: "PATCH",
        body,
      }),
      transformResponse: unwrapApiResponse<{ changed: boolean }>,
    }),
  }),
});

export const {
  useUpdateCustomerProfileMutation,
  useUpdateCustomerAvatarMutation,
  useChangePasswordMutation,
} = customerApi;
