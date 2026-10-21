import "./testEnvironment.js";
import { Test } from "@nestjs/testing";
import { Module } from "@nestjs/common";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "@/app.module.js";
import { AuthModule } from "@/modules/auth/auth.module.js";
import { PrismaService } from "@/infrastructure/prisma/prisma.service.js";
import { RedisService } from "@/infrastructure/redis/redis.service.js";
import { GoogleAuthService } from "@/infrastructure/google/googleAuth.service.js";
import { EmailService } from "@/infrastructure/email/email.service.js";
import type { SendOrderPaidEmailParams } from "@/infrastructure/email/types/email.type.js";
import { NotificationService } from "@/infrastructure/queues/notification.service.js";
import { CloudinaryService } from "@/infrastructure/cloudinary/cloudinary.service.js";
import { RealtimeService } from "@/infrastructure/realtime/realtime.service.js";
import { configureApplication } from "@/bootstrap.js";
import { AuthRateLimitService } from "@/modules/auth/http/authRateLimit.service.js";
import { AppError } from "@/common/errors/appError.js";
import { createAuthState, type AuthState } from "../fixtures/authState.js";

@Module({ imports: [AppModule, AuthModule] })
class AuthTestModule {}

export async function startAuthApplication(createState: () => Promise<AuthState> = createAuthState) {
  const state = await createState();
  const uploads: Array<{ file: Express.Multer.File; folder: string }> = [];
  const events: Array<{ orderId: string; orderStatus: string }> = [];
  const paidEmails: SendOrderPaidEmailParams[] = [];
  const module = await Test.createTestingModule({ imports: [AuthTestModule] })
    .overrideProvider(PrismaService).useValue(state.prisma)
    .overrideProvider(RealtimeService).useValue({ emitOrderStatusChanged: (orderId: string, orderStatus: string) => { events.push({ orderId, orderStatus }); } })
    .overrideProvider(RedisService).useValue({ getClient: async () => state.redis })
    .overrideProvider(GoogleAuthService).useValue({ verify: async (token: string) => {
      if (token === "invalid") throw new AppError("Không thể xác thực Google.", 401, "GOOGLE_TOKEN_INVALID");
      return {
        sub: "google-subject", email: token === "existing-google" ? state.customer.email : "google@test.local",
        emailVerified: token !== "unverified", fullName: "Google Test", avatar: "https://example.test/avatar.png",
      };
    } })
    .overrideProvider(EmailService).useValue({
      sendPasswordResetOtpEmail: async (params: { to: string; otpCode: string; expiresInMinutes: number }) => { state.emails.push(params); },
      sendOrderPaidEmail: async (params: SendOrderPaidEmailParams) => { paidEmails.push(params); },
    })
    .overrideProvider(NotificationService).useValue({ enqueue: async (name: string, data: unknown) => { state.notifications.push({ name, data }); } })
    .overrideProvider(CloudinaryService).useValue({ uploadImageBuffer: async (file: Express.Multer.File, folder: string) => {
      uploads.push({ file, folder });
      return { url: "https://example.test/avatar.webp", publicId: "avatars/test" };
    } })
    .compile();
  const app = configureApplication(module.createNestApplication<NestExpressApplication>({ rawBody: true, bufferLogs: true }));
  await app.listen(0, "127.0.0.1");
  const url = await app.getUrl();
  const limits = app.get(AuthRateLimitService);
  return {
    app, state, limits, url, uploads, events, paidEmails,
    resetLimits: () => { for (const limit of [limits.login, limits.recovery, limits.refresh]) limit.resetKey("127.0.0.1"); },
    close: () => app.close(),
  };
}

export async function authRequest(url: string, path: string, body?: unknown, options: { token?: string; cookie?: string; method?: string } = {}) {
  const response = await fetch(`${url}/api/v1${path}`, {
    method: options.method ?? (body === undefined ? "GET" : "POST"),
    headers: {
      "content-type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...(options.cookie ? { Cookie: options.cookie } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  return { response, body: await response.json() };
}

export function refreshCookie(response: Response) {
  return response.headers.get("set-cookie")?.split(";")[0] ?? "";
}
