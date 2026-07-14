import { z } from "zod";

export const loginValidator = z.object({
  body: z.object({
    phone: z.string().min(8),
    password: z.string().min(6),
  }),
});

export const registerValidator = z.object({
  body: z.object({
    fullName: z.string().min(2),
    phone: z.string().min(8),
    password: z.string().min(6),
  }),
});
