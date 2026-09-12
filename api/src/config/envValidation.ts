import "dotenv/config";
import { z } from "zod";

const optionalUrlSchema = z
  .string()
  .trim()
  .url()
  .optional()
  .or(z.literal("").transform(() => undefined));

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  LOG_LEVEL: z
    .enum(["trace", "debug", "info", "warn", "error", "fatal", "silent"])
    .default("info"),
  PRISMA_LOG_QUERIES: z
    .enum(["true", "false"])
    .default("false")
    .transform((value) => value === "true"),
  PORT: z.coerce.number().default(4000),
  CORS_ORIGINS: z
    .string()
    .default("http://localhost:3000,http://localhost:3001")
    .transform((value) =>
      value
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
    ),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  JWT_SECRET: z.string().optional(),
  JWT_ACCESS_SECRET: z.string().optional(),
  JWT_REFRESH_SECRET: z.string().optional(),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("30d"),
  MAX_CUSTOMER_SESSIONS: z.coerce.number().int().min(1).default(3),
  MAX_ADMIN_SESSIONS: z.coerce.number().int().min(1).default(1),
  PASSWORD_OTP_EXPIRES_MINUTES: z.coerce.number().int().min(1).default(10),
  PASSWORD_OTP_MAX_ATTEMPTS: z.coerce.number().int().min(1).default(5),
  GOOGLE_CLIENT_ID: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  CLOUDINARY_UPLOAD_FOLDER: z.string().default("tiem-len"),
  FRONTEND_URL: optionalUrlSchema,
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().default("Tiệm Len Nhà Kiều <no-reply@tiemlennhakieu.io.vn>"),
  TELEGRAM_ENABLED: z
    .enum(["true", "false"])
    .default("false")
    .transform((value) => value === "true"),
  TELEGRAM_BOT_TOKEN: z.string().optional(),
  TELEGRAM_ADMIN_CHAT_ID: z.string().optional(),
  BANK_ACCOUNT_NUMBER: z.string().optional(),
  BANK_ACCOUNT_NAME: z.string().optional(),
  BANK_CODE: z.string().optional(),
  VIETQR_TEMPLATE: z.string().default("compact"),
  ORDER_PAYMENT_HOLD_MINUTES: z.coerce.number().int().min(1).default(5),
  SEPAY_WEBHOOK_SECRET: z.string().optional(),
  SEPAY_WEBHOOK_AUTH_TYPE: z.enum(["HMAC", "NONE"]).default("HMAC"),
});

export const env = envSchema.parse(process.env);
