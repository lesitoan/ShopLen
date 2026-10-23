import "../harness/testEnvironment.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { EnvService } from "@/config/env.service.js";
import { LoggingService } from "@/infrastructure/logging/logging.service.js";
import { GoogleAuthService } from "@/infrastructure/google/googleAuth.service.js";
import { EmailService } from "@/infrastructure/email/email.service.js";
import { NotificationService } from "@/infrastructure/queues/notification.service.js";
import { AppError } from "@/common/errors/appError.js";

test("missing Google/email configuration and failed notification preserve auth error semantics", async () => {
  const config = new EnvService();
  const env = { values: { ...config.values, GOOGLE_CLIENT_ID: undefined, RESEND_API_KEY: undefined } } as EnvService;
  const logging = new LoggingService(env);
  await assert.rejects(new GoogleAuthService(env).verify("test-token"), (error: unknown) => error instanceof AppError && error.internalMessage === "GOOGLE_CLIENT_ID is missing");
  await new EmailService(env, logging).sendPasswordResetOtpEmail({ to: "test@test.local", otpCode: "123456", expiresInMinutes: 10 });
  const production = { values: { ...env.values, NODE_ENV: "production" } } as EnvService;
  await assert.rejects(new EmailService(production, logging).sendPasswordResetOtpEmail({ to: "test@test.local", otpCode: "123456", expiresInMinutes: 10 }),
    (error: unknown) => error instanceof AppError && error.errorCode === "EMAIL_SERVICE_NOT_CONFIGURED");
  const notifications = new NotificationService(env, logging);
  let attempts = 0;
  Reflect.set(notifications, "queue", { add: async () => { attempts += 1; throw new Error("queue unavailable"); }, close: async () => {} });
  await notifications.enqueue("CUSTOMER_REGISTERED", {
    customerId: "test", code: "test", fullName: "Test", email: "test@test.local",
    registerMethod: "EMAIL", registeredAt: new Date().toISOString(),
  }, { customerId: "test" });
  assert.equal(attempts, 1);
  await notifications.onModuleDestroy();
});
