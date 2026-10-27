import { Inject, Injectable } from "@nestjs/common";
import { RedisService } from "@/infrastructure/redis/redis.service.js";
import type { PasswordResetOtpCache } from "@/modules/auth/types/passwordResetOtp.type.js";
import { AppError } from "@/common/errors/appError.js";
import {
  comparePassword,
  hashPassword,
} from "@/modules/auth/security/hashPassword.js";
import type {
  CreatePasswordOtp,
  VerifyPasswordOtp,
} from "@/modules/auth/types/passwordResetOtp.type.js";
const PASSWORD_RESET_OTP_KEY_PREFIX = "auth:password-reset";
function getPasswordResetOtpKey(email: string) {
  return `${PASSWORD_RESET_OTP_KEY_PREFIX}:${email.toLowerCase()}`;
}
function parseOtpCache(rawValue: string | null) {
  if (!rawValue) {
    return null;
  }
  try {
    const parsedValue = JSON.parse(rawValue) as Partial<PasswordResetOtpCache>;
    if (
      typeof parsedValue.customerId !== "string" ||
      typeof parsedValue.email !== "string" ||
      typeof parsedValue.otpHash !== "string" ||
      typeof parsedValue.attempts !== "number"
    ) {
      return null;
    }
    return {
      customerId: parsedValue.customerId,
      email: parsedValue.email,
      otpHash: parsedValue.otpHash,
      attempts: parsedValue.attempts,
      verifiedAt:
        typeof parsedValue.verifiedAt === "string"
          ? parsedValue.verifiedAt
          : null,
      createdAt:
        typeof parsedValue.createdAt === "string"
          ? parsedValue.createdAt
          : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}
@Injectable()
export class PasswordResetOtpService {
  constructor(
    @Inject(RedisService)
    private readonly redis: RedisService,
  ) {}
  async saveOtpCache(
    email: string,
    otpCache: PasswordResetOtpCache,
    ttlSeconds: number,
  ) {
    const redis = await this.redis.getClient();
    await redis.sendCommand([
      "SET",
      getPasswordResetOtpKey(email),
      JSON.stringify(otpCache),
      "EX",
      String(ttlSeconds),
    ]);
  }
  async updateOtpCacheWithCurrentTtl(
    email: string,
    otpCache: PasswordResetOtpCache,
  ) {
    const redis = await this.redis.getClient();
    const key = getPasswordResetOtpKey(email);
    const ttlSeconds = await redis.ttl(key);
    if (ttlSeconds <= 0) {
      throw new AppError("Mã xác nhận đã hết hạn.", 400, "OTP_EXPIRED");
    }
    await redis.sendCommand([
      "SET",
      key,
      JSON.stringify(otpCache),
      "EX",
      String(ttlSeconds),
    ]);
  }
  async create(params: CreatePasswordOtp) {
    await this.saveOtpCache(
      params.email,
      {
        customerId: params.customerId,
        email: params.email,
        otpHash: await hashPassword(params.otpCode),
        attempts: 0,
        verifiedAt: null,
        createdAt: new Date().toISOString(),
      },
      params.ttlSeconds,
    );
  }
  async assertValid(params: VerifyPasswordOtp) {
    const redis = await this.redis.getClient();
    const key = getPasswordResetOtpKey(params.email);
    const otpCache = parseOtpCache(await redis.get(key));
    if (!otpCache) {
      throw new AppError("Mã xác nhận không đúng.", 400, "OTP_INVALID");
    }
    if (otpCache.attempts >= params.maxAttempts) {
      throw new AppError("Mã xác nhận không đúng.", 400, "OTP_INVALID");
    }
    const isOtpValid = await comparePassword(params.otpCode, otpCache.otpHash);
    if (!isOtpValid) {
      await this.updateOtpCacheWithCurrentTtl(params.email, {
        ...otpCache,
        attempts: otpCache.attempts + 1,
      });
      throw new AppError("Mã xác nhận không đúng.", 400, "OTP_INVALID");
    }
    if (params.markVerified && !otpCache.verifiedAt) {
      const verifiedOtpCache = {
        ...otpCache,
        verifiedAt: new Date().toISOString(),
      };
      await this.updateOtpCacheWithCurrentTtl(params.email, verifiedOtpCache);
      return verifiedOtpCache;
    }
    return otpCache;
  }
  async consume(email: string) {
    const redis = await this.redis.getClient();
    await redis.del(getPasswordResetOtpKey(email));
  }
}
