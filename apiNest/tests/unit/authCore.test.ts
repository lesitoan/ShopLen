import "../harness/testEnvironment.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import jwt from "jsonwebtoken";
import { EnvService } from "@/config/env.service.js";
import { RedisService } from "@/infrastructure/redis/redis.service.js";
import { TokenService } from "@/modules/auth/security/token.service.js";
import { comparePassword, hashPassword } from "@/modules/auth/security/hashPassword.js";
import { RefreshSessionService } from "@/modules/auth/services/refreshSession.service.js";
import { PasswordResetOtpService } from "@/modules/auth/services/passwordResetOtp.service.js";
import { AppError } from "@/common/errors/appError.js";
import { MemoryRedis } from "../harness/memoryRedis.js";

export function testTokenService() {
  const config = new EnvService();
  return new TokenService({ values: {
    ...config.values, JWT_ACCESS_SECRET: "test-only-access-secret", JWT_REFRESH_SECRET: "test-only-refresh-secret",
  } } as EnvService);
}

test("JWT keeps legacy claims, secret fallback, expiry and actor separation", () => {
  const tokens = testTokenService();
  const oldCustomer = jwt.sign({ sub: "customer-1", tokenType: "CUSTOMER", email: "customer@test.local" }, "test-only-access-secret", { expiresIn: "15m" });
  assert.equal(tokens.verifyCustomerAccessToken(oldCustomer).sub, "customer-1");
  const freshAdmin = tokens.signAdminAccessToken({ sub: "admin-1", tokenType: "ADMIN", email: "admin@test.local", role: "ADMIN" });
  assert.equal((jwt.verify(freshAdmin, "test-only-access-secret") as jwt.JwtPayload).tokenType, "ADMIN");
  assert.throws(() => tokens.verifyCustomerAccessToken(freshAdmin), (error: unknown) => error instanceof AppError && error.statusCode === 401);
  const refresh = tokens.signCustomerRefreshToken({ sub: "customer-1", tokenType: "CUSTOMER_REFRESH", jti: "session-1" });
  const claims = jwt.verify(refresh, "test-only-refresh-secret") as jwt.JwtPayload;
  assert.equal((claims.exp ?? 0) - (claims.iat ?? 0), 30 * 86400);
  assert.throws(() => tokens.verifyAdminRefreshToken(refresh), (error: unknown) => error instanceof AppError && error.errorCode === "REFRESH_TOKEN_INVALID");
  const expired = jwt.sign({ sub: "customer-1", tokenType: "CUSTOMER", email: "customer@test.local" }, "test-only-access-secret", { expiresIn: -1 });
  assert.throws(() => tokens.verifyCustomerAccessToken(expired), (error: unknown) => error instanceof AppError && error.errorCode === "UNAUTHORIZED");
  const config = new EnvService();
  const fallback = new TokenService({ values: { ...config.values, JWT_ACCESS_SECRET: undefined, JWT_REFRESH_SECRET: undefined, JWT_SECRET: "fallback-test-secret" } } as EnvService);
  const token = fallback.signAdminRefreshToken({ sub: "admin-1", tokenType: "ADMIN_REFRESH", jti: "fallback" });
  assert.equal((jwt.verify(token, "fallback-test-secret") as jwt.JwtPayload).jti, "fallback");
});

test("refresh sessions keep keys, bounds, atomic consumption and revocation", async () => {
  const redis = new MemoryRedis();
  const sessions = new RefreshSessionService({ getClient: async () => redis } as unknown as RedisService);
  const session = { accountId: "customer-1", actorType: "CUSTOMER", jti: "old-session" } as const;
  await sessions.create(session, 60, 1);
  assert.deepEqual(JSON.parse(await redis.get("auth:refresh-session:CUSTOMER:old-session") ?? ""), session);
  await sessions.create({ ...session, jti: "new-session" }, 60, 1);
  assert.equal(await redis.get("auth:refresh-session:CUSTOMER:old-session"), null);
  const outcomes = await Promise.allSettled([
    sessions.consume({ ...session, jti: "new-session" }),
    sessions.consume({ ...session, jti: "new-session" }),
  ]);
  assert.equal(outcomes.filter((item) => item.status === "fulfilled").length, 1);
  await sessions.create(session, 60, 3);
  await sessions.revokeAll("CUSTOMER", "customer-1");
  assert.equal(await redis.get("auth:refresh-session:CUSTOMER:old-session"), null);
  await assert.rejects(sessions.create(session, 0, 3), (error: unknown) => error instanceof AppError);
  await sessions.create(session, 1, 3);
  redis.time += 2000;
  await assert.rejects(sessions.consume(session), (error: unknown) => error instanceof AppError && error.errorCode === "REFRESH_TOKEN_INVALID");
});

test("OTP hashing, attempt limit, verification and consumption preserve TTL", async () => {
  const redis = new MemoryRedis();
  const otp = new PasswordResetOtpService({ getClient: async () => redis } as unknown as RedisService);
  await otp.create({ customerId: "customer-1", email: "Customer@Test.local", otpCode: "123456", ttlSeconds: 60 });
  const key = "auth:password-reset:customer@test.local";
  const value = JSON.parse(await redis.get(key) ?? "");
  assert.equal(value.otpHash.includes("123456"), false);
  assert.equal(await comparePassword("123456", value.otpHash), true);
  redis.time += 10_000;
  const payload = { email: "Customer@Test.local", otpCode: "000000", maxAttempts: 2, markVerified: true };
  await assert.rejects(otp.assertValid(payload), (error: unknown) => error instanceof AppError && error.errorCode === "OTP_INVALID");
  assert.equal(await redis.ttl(key), 50);
  const verified = await otp.assertValid({ ...payload, otpCode: "123456" });
  assert.ok(verified.verifiedAt);
  assert.equal(await redis.ttl(key), 50);
  await otp.assertValid({ ...payload, otpCode: "123456", markVerified: false });
  await otp.consume(payload.email);
  assert.equal(await redis.get(key), null);
  await assert.rejects(otp.assertValid({ ...payload, otpCode: "123456" }));
  await otp.create({ customerId: "customer-1", email: payload.email, otpCode: "123456", ttlSeconds: 1 });
  redis.time += 2_000;
  await assert.rejects(otp.assertValid(payload));
  const passwordHash = await hashPassword("password-test");
  assert.equal(passwordHash.startsWith("$2b$12$"), true);
  assert.equal(await comparePassword("password-test", passwordHash), true);
});
