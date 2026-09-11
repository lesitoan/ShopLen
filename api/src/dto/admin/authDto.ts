import { z } from "zod";

const emailSchema = z.string().trim().email().toLowerCase();

export const adminLoginDto = z.object({
  body: z.object({
    email: emailSchema,
    password: z.string().min(1),
  }),
});

export const adminRefreshTokenDto = z.object({
  body: z.object({}).default({}),
});

export const adminLogoutDto = z.object({
  body: z.object({}).default({}),
});

export type AdminLoginRequestDto = z.infer<typeof adminLoginDto>["body"];
export type AdminRefreshTokenRequestDto = z.infer<
  typeof adminRefreshTokenDto
>["body"];
export type AdminLogoutRequestDto = z.infer<typeof adminLogoutDto>["body"];
