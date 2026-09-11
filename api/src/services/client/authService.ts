import { randomInt } from "node:crypto";
import type { Customer } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { prisma } from "@/config/prismaClient.js";
import { env } from "@/config/envValidation.js";
import { v4 as uuidv4 } from "uuid";
import type {
  ForgotPasswordRequestDto,
  GoogleLoginRequestDto,
  LoginRequestDto,
  RegisterRequestDto,
  ResetPasswordRequestDto,
  VerifyPasswordOtpRequestDto,
} from "@/dto/client/authDto.js";
import { enqueueNotification } from "@/queues/notificationQueue.js";
import { emailService } from "@/services/emailService.js";
import { passwordResetOtpService } from "@/services/client/passwordResetOtpService.js";
import type {
  AuthData,
  CustomerSession,
  LogoutInput,
  RefreshTokenInput,
} from "@/types/clientAuth.type.js";
import { NOTIFICATION_JOB_NAMES } from "@/types/notification.type.js";
import { AppError } from "@/utils/appError.js";
import { verifyGoogleIdToken } from "@/utils/googleAuth.js";
import { comparePassword, hashPassword } from "@/utils/hashPassword.js";
import {
  signCustomerAccessToken,
  signCustomerRefreshToken,
  verifyCustomerRefreshToken,
} from "@/utils/jwtToken.js";
import { logger } from "@/config/logger.js";
import { refreshSessionService } from "@/services/refreshSessionService.js";

export const authService = {
  async register(payload: RegisterRequestDto) {
    try {
      const customer = await prisma.customer.create({
        data: {
          code: uuidv4().substring(0, 8),
          fullName: payload.email.split("@")[0] || "Khách hàng",
          email: payload.email,
          passwordHash: await hashPassword(payload.password),
          emailVerified: false,
          isManualLogin: true,
          isGoogleLogin: false,
          lastLoginAt: new Date(),
        },
      });

      await enqueueNotification(
        NOTIFICATION_JOB_NAMES.CUSTOMER_REGISTERED,
        {
          customerId: customer.id,
          code: customer.code,
          fullName: customer.fullName,
          email: customer.email,
          phone: customer.phone,
          registerMethod: "EMAIL",
          registeredAt: customer.createdAt.toISOString(),
        },
        {
          customerId: customer.id,
          email: customer.email,
        },
      );

      return createAuthData(customer);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new AppError("Email đã được sử dụng.", 409, "EMAIL_ALREADY_EXISTS");
      }

      throw error;
    }
  },

  async login(payload: LoginRequestDto) {
    const customer = await prisma.customer.findUnique({
      where: { email: payload.email },
    });

    if (!customer) {
      throw new AppError(
        "Email hoặc mật khẩu không đúng.",
        401,
        "INVALID_CREDENTIALS",
      );
    }

    isUserActive(customer);

    if (!customer.isManualLogin || !customer.passwordHash) {
      throw new AppError(
        "Tài khoản này chưa bật đăng nhập bằng mật khẩu.",
        400,
        "PASSWORD_LOGIN_NOT_ENABLED",
      );
    }

    const isPasswordValid = await comparePassword(
      payload.password,
      customer.passwordHash,
    );

    if (!isPasswordValid) {
      throw new AppError(
        "Email hoặc mật khẩu không đúng.",
        401,
        "INVALID_CREDENTIALS",
      );
    }

    prisma.customer
      .update({ where: { id: customer.id }, data: { lastLoginAt: new Date() } })
      .catch((err) => logger.error("Failed to update lastLoginAt", err));

    return createAuthData(customer);
  },

  async loginWithGoogle(payload: GoogleLoginRequestDto) {
    const googleProfile = await verifyGoogleIdToken(payload.idToken);

    if (!googleProfile.emailVerified) {
      throw new AppError(
        "Email Google chưa được xác thực.",
        400,
        "GOOGLE_EMAIL_NOT_VERIFIED",
      );
    }

    const existingCustomer = await prisma.customer.findFirst({
      where: {
        OR: [
          { googleAccountId: googleProfile.sub },
          { email: googleProfile.email },
        ],
      },
    });

    if (existingCustomer) {
      isUserActive(existingCustomer);

      const isNewGoogleLink = existingCustomer.googleAccountId !== googleProfile.sub;
      const now = new Date();
      const avatar = existingCustomer.avatar ?? googleProfile.avatar;

      const updateData = {
        lastLoginAt: now,
        avatar,
        ...(isNewGoogleLink && {
          isGoogleLogin: true,
          googleAccountId: googleProfile.sub,
          emailVerified: true,
        }),
      };

      // fire-and-forget: không chặn response
      prisma.customer
        .update({ where: { id: existingCustomer.id }, data: updateData })
        .catch((err) =>
          logger.error("Failed to update customer on Google login", err),
        );

      return createAuthData(existingCustomer);
    }

    const customer = await prisma.customer.create({
      data: {
        code: uuidv4().substring(0, 8),
        fullName:
          googleProfile.fullName?.trim() || googleProfile.email.split("@")[0],
        email: googleProfile.email,
        passwordHash: null,
        emailVerified: true,
        isManualLogin: false,
        isGoogleLogin: true,
        googleAccountId: googleProfile.sub,
        avatar: googleProfile.avatar,
        lastLoginAt: new Date(),
      },
    });

    await enqueueNotification(
      NOTIFICATION_JOB_NAMES.CUSTOMER_REGISTERED,
      {
        customerId: customer.id,
        code: customer.code,
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        registerMethod: "GOOGLE",
        registeredAt: customer.createdAt.toISOString(),
      },
      {
        customerId: customer.id,
        email: customer.email,
      },
    );

    return createAuthData(customer);
  },

  async getMe(customerId: string) {
    const customer = await prisma.customer.findUnique({ where: { id: customerId } });

    if (!customer) {
      throw new AppError("Bạn cần đăng nhập để tiếp tục.", 401, "UNAUTHORIZED");
    }

    isUserActive(customer);
    return toCustomerSession(customer);
  },

  async refresh(payload: RefreshTokenInput) {
    const refreshPayload = verifyCustomerRefreshToken(payload.refreshToken);
    const customer = await prisma.customer.findUnique({
      where: { id: refreshPayload.sub },
    });

    if (!customer) {
      throw new AppError(
        "Refresh token không hợp lệ.",
        401,
        "REFRESH_TOKEN_INVALID",
      );
    }

    isUserActive(customer);
    await refreshSessionService.consume({
      accountId: customer.id,
      actorType: "CUSTOMER",
      jti: refreshPayload.jti,
    });

    return createAuthData(customer);
  },

  async logout(payload: LogoutInput) {
    if (payload.refreshToken) {
      try {
        const refreshPayload = verifyCustomerRefreshToken(payload.refreshToken);
        await refreshSessionService.revoke({
          accountId: refreshPayload.sub,
          actorType: "CUSTOMER",
          jti: refreshPayload.jti,
        });
      } catch {
        // Logout is intentionally idempotent for expired or already-revoked sessions.
      }
    }

    return { loggedOut: true };
  },

  async forgotPassword(payload: ForgotPasswordRequestDto) {
    const customer = await prisma.customer.findUnique({
      where: { email: payload.email },
    });

    if (!customer || customer.status !== "ACTIVE") {
      return {};
    }

    const otpCode = String(randomInt(0, 1_000_000)).padStart(6, "0");

    await passwordResetOtpService.create({
      customerId: customer.id,
      email: payload.email,
      otpCode,
      ttlSeconds: env.PASSWORD_OTP_EXPIRES_MINUTES * 60,
    });

    await emailService.sendPasswordResetOtpEmail({
      to: customer.email,
      otpCode,
      expiresInMinutes: env.PASSWORD_OTP_EXPIRES_MINUTES,
    });

    if (isDevMode()) {
      return { devOtp: otpCode };
    }

    return {};
  },

  async verifyPasswordOtp(payload: VerifyPasswordOtpRequestDto) {
    await assertOtpValid(payload.email, payload.otpCode, true);
    return { verified: true };
  },

  async resetPassword(payload: ResetPasswordRequestDto) {
    await assertOtpValid(payload.email, payload.otpCode, false);
    const customer = await prisma.customer.findUnique({
      where: { email: payload.email },
    });

    if (!customer || customer.status !== "ACTIVE") {
      throw new AppError("Mã xác nhận không đúng.", 400, "OTP_INVALID");
    }

    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        passwordHash: await hashPassword(payload.newPassword),
        isManualLogin: true,
      },
    });

    await refreshSessionService.revokeAll("CUSTOMER", customer.id);

    await passwordResetOtpService.consume(payload.email);

    return { reset: true };
  },
};

export function toCustomerSession(customer: Customer): CustomerSession {
  return {
    id: customer.id,
    code: customer.code,
    fullName: customer.fullName,
    email: customer.email,
    emailVerified: customer.emailVerified,
    phone: customer.phone,
    gender: customer.gender,
    birthday: customer.birthday?.toISOString().slice(0, 10) ?? null,
    avatar: customer.avatar,
    status: customer.status,
    isManualLogin: customer.isManualLogin,
    isGoogleLogin: customer.isGoogleLogin,
    rewardPoints: customer.rewardPoints,
    totalSpent: customer.totalSpent,
    totalOrders: customer.totalOrders,
  };
}

async function createAuthData(customer: Customer): Promise<AuthData> {
  const jti = uuidv4();
  const refreshToken = signCustomerRefreshToken({
    sub: customer.id,
    tokenType: "CUSTOMER_REFRESH",
    jti,
  });
  const refreshPayload = verifyCustomerRefreshToken(refreshToken);

  await refreshSessionService.create(
    {
      accountId: customer.id,
      actorType: "CUSTOMER",
      jti,
    },
    refreshPayload.exp - Math.floor(Date.now() / 1000),
    env.MAX_CUSTOMER_SESSIONS,
  );

  return {
    accessToken: signCustomerAccessToken({
      sub: customer.id,
      tokenType: "CUSTOMER",
      email: customer.email,
    }),
    refreshToken,
  };
}

function isDevMode() {
  return env.NODE_ENV === "development" || env.NODE_ENV === "test";
}

async function assertOtpValid(email: string, otpCode: string, markVerified: boolean) {
  return passwordResetOtpService.assertValid({
    email,
    otpCode,
    maxAttempts: env.PASSWORD_OTP_MAX_ATTEMPTS,
    markVerified,
  });
}

function isUserActive(customer: Customer) {
  if (customer.status !== "ACTIVE") {
    throw new AppError("Tài khoản đã bị khóa.", 403, "CUSTOMER_LOCKED");
  }
}
