import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  CLIENT_URL: z.string().url().default("http://localhost:3000"),
  ADMIN_URL: z.string().url().default("http://localhost:3001"),
  DATABASE_URL: z.string().optional(),
  JWT_SECRET: z.string().optional(),
  TELEGRAM_BOT_TOKEN: z.string().optional(),
  TELEGRAM_ADMIN_CHAT_ID: z.string().optional(),
  BANK_ACCOUNT_NUMBER: z.string().optional(),
  BANK_ACCOUNT_NAME: z.string().optional(),
  BANK_CODE: z.string().optional(),
});

export const env = envSchema.parse(process.env);
