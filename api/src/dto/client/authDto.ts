import { z } from "zod";

const emailSchema = z.string().trim().email().toLowerCase();
const passwordSchema = z.string().min(6).max(100);
const otpCodeSchema = z.string().trim().regex(/^\d{6}$/);

export const registerDto = z.object({
  body: z
    .object({
      email: emailSchema,
      password: passwordSchema,
      confirmPassword: z.string().min(6).max(100),
    })
    .refine((value) => value.password === value.confirmPassword, {
      message: "Mật khẩu xác nhận không khớp.",
      path: ["confirmPassword"],
    }),
});

export const loginDto = z.object({
  body: z.object({
    email: emailSchema,
    password: z.string().min(1),
  }),
});

export const googleLoginDto = z.object({
  body: z.object({
    idToken: z.string().min(1),
  }),
});

export const refreshTokenDto = z.object({
  body: z.object({
    refreshToken: z.string().min(1),
  }),
});

export const logoutDto = z.object({
  body: z.object({
    refreshToken: z.string().min(1).optional(),
  }),
});

export const forgotPasswordDto = z.object({
  body: z.object({
    email: emailSchema,
  }),
});

export const verifyPasswordOtpDto = z.object({
  body: z.object({
    email: emailSchema,
    otpCode: otpCodeSchema,
  }),
});

export const resetPasswordDto = z.object({
  body: z
    .object({
      email: emailSchema,
      otpCode: otpCodeSchema,
      newPassword: passwordSchema,
      confirmPassword: z.string().min(6).max(100),
    })
    .refine((value) => value.newPassword === value.confirmPassword, {
      message: "Mật khẩu xác nhận không khớp.",
      path: ["confirmPassword"],
    }),
});

export const updateCustomerProfileDto = z.object({
  body: z.object({
    fullName: z.string().trim().min(1).max(120).optional(),
    phone: z.string().trim().min(8).max(20).nullable().optional(),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]).nullable().optional(),
    birthday: z.string().date().nullable().optional(),
  }),
});

export const changePasswordDto = z.object({
  body: z
    .object({
      currentPassword: z.string().min(1).optional(),
      newPassword: passwordSchema,
      confirmPassword: z.string().min(6).max(100),
    })
    .refine((value) => value.newPassword === value.confirmPassword, {
      message: "Mật khẩu xác nhận không khớp.",
      path: ["confirmPassword"],
    }),
});

export type RegisterRequestDto = z.infer<typeof registerDto>["body"];
export type LoginRequestDto = z.infer<typeof loginDto>["body"];
export type GoogleLoginRequestDto = z.infer<typeof googleLoginDto>["body"];
export type RefreshTokenRequestDto = z.infer<typeof refreshTokenDto>["body"];
export type LogoutRequestDto = z.infer<typeof logoutDto>["body"];
export type ForgotPasswordRequestDto = z.infer<typeof forgotPasswordDto>["body"];
export type VerifyPasswordOtpRequestDto = z.infer<
  typeof verifyPasswordOtpDto
>["body"];
export type ResetPasswordRequestDto = z.infer<typeof resetPasswordDto>["body"];
export type UpdateCustomerProfileRequestDto = z.infer<
  typeof updateCustomerProfileDto
>["body"];
export type ChangePasswordRequestDto = z.infer<typeof changePasswordDto>["body"];
