import { baseApi, unwrapApiResponse } from "@/services/api/baseApi";
import type {
  AuthTokens,
  CustomerSession,
  ForgotPasswordRequest,
  GoogleLoginRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  VerifyPasswordOtpRequest,
} from "@/types/auth.type";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<AuthTokens, RegisterRequest>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
      transformResponse: unwrapApiResponse<AuthTokens>,
    }),

    login: builder.mutation<AuthTokens, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      transformResponse: unwrapApiResponse<AuthTokens>,
    }),

    loginWithGoogle: builder.mutation<AuthTokens, GoogleLoginRequest>({
      query: (body) => ({
        url: "/auth/google",
        method: "POST",
        body,
      }),
      transformResponse: unwrapApiResponse<AuthTokens>,
    }),

    getMe: builder.query<CustomerSession, void>({
      query: () => "/auth/me",
      transformResponse: unwrapApiResponse<CustomerSession>,
      providesTags: ["Customer"],
    }),

    logout: builder.mutation<{ loggedOut: boolean }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
        body: {},
      }),
      transformResponse: unwrapApiResponse<{ loggedOut: boolean }>,
    }),

    forgotPassword: builder.mutation<{ devOtp?: string }, ForgotPasswordRequest>(
      {
        query: (body) => ({
          url: "/auth/password/forgot",
          method: "POST",
          body,
        }),
        transformResponse: unwrapApiResponse<{ devOtp?: string }>,
      },
    ),

    verifyPasswordOtp: builder.mutation<
      { verified: boolean },
      VerifyPasswordOtpRequest
    >({
      query: (body) => ({
        url: "/auth/password/otp/verify",
        method: "POST",
        body,
      }),
      transformResponse: unwrapApiResponse<{ verified: boolean }>,
    }),

    resetPassword: builder.mutation<{ reset: boolean }, ResetPasswordRequest>({
      query: (body) => ({
        url: "/auth/password/reset",
        method: "POST",
        body,
      }),
      transformResponse: unwrapApiResponse<{ reset: boolean }>,
    }),
  }),
});

export const {
  useForgotPasswordMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useLoginMutation,
  useLoginWithGoogleMutation,
  useLogoutMutation,
  useRegisterMutation,
  useResetPasswordMutation,
  useVerifyPasswordOtpMutation,
} = authApi;
