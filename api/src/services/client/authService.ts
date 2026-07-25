import { randomInt } from "node:crypto";
import type { Customer } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { prisma } from "@/config/prismaClient.js";
import { env } from "@/config/envValidation.js";
import type {
  ForgotPasswordRequestDto,
  GoogleLoginRequestDto,
  LoginRequestDto,
  RefreshTokenRequestDto,
  RegisterRequestDto,
  ResetPasswordRequestDto,
  VerifyPasswordOtpRequestDto,
} from "@/dto/client/authDto.js";
import type { AuthData, CustomerSession } from "@/types/clientAuth.type.js";
import { AppError } from "@/utils/appError.js";
import { verifyGoogleIdToken } from "@/utils/googleAuth.js";
import { comparePassword, hashPassword } from "@/utils/hashPassword.js";
import {
  signCustomerAccessToken,
  signCustomerRefreshToken,
  verifyCustomerRefreshToken,
} from "@/utils/jwtToken.js";

const PASSWORD_OTP_EXPIRES_MINUTES = 10;
const PASSWORD_OTP_MAX_ATTEMPTS = 5;

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

function createAuthData(customer: Customer): AuthData {
  return {
    customer: toCustomerSession(customer),
    accessToken: signCustomerAccessToken({
      sub: customer.id,
      tokenType: "CUSTOMER",
      email: customer.email,
    }),
    refreshToken: signCustomerRefreshToken({
      sub: customer.id,
      tokenType: "CUSTOMER_REFRESH",
    }),
  };
}

function getDefaultFullName(email: string) {
  return email.split("@")[0] || "Khách hàng";
}

function generateCustomerCode() {
  return `CUS${Date.now()}${randomInt(100, 999)}`;
}

function generateOtpCode() {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

function getOtpExpiresAt() {
  return new Date(Date.now() + PASSWORD_OTP_EXPIRES_MINUTES * 60 * 1000);
}

function isDevMode() {
  return env.NODE_ENV === "development" || env.NODE_ENV === "test";
}

async function findLatestUsableOtp(email: string) {
  return prisma.passwordResetOtp.findFirst({
    where: {
      email,
      consumedAt: null,
    },
    orderBy: { createdAt: "desc" },
  });
}

async function assertOtpValid(email: string, otpCode: string, markVerified: boolean) {
  const otpRecord = await findLatestUsableOtp(email);

  if (!otpRecord) {
    throw new AppError("Mã xác nhận không đúng.", 400, "OTP_INVALID");
  }

  if (otpRecord.expiresAt.getTime() < Date.now()) {
    throw new AppError("Mã xác nhận đã hết hạn.", 400, "OTP_EXPIRED");
  }

  if (otpRecord.attempts >= PASSWORD_OTP_MAX_ATTEMPTS) {
    throw new AppError("Mã xác nhận không đúng.", 400, "OTP_INVALID");
  }

  const isOtpValid = await comparePassword(otpCode, otpRecord.otpHash);

  if (!isOtpValid) {
    await prisma.passwordResetOtp.update({
      where: { id: otpRecord.id },
      data: { attempts: { increment: 1 } },
    });

    throw new AppError("Mã xác nhận không đúng.", 400, "OTP_INVALID");
  }

  if (markVerified && !otpRecord.verifiedAt) {
    await prisma.passwordResetOtp.update({
      where: { id: otpRecord.id },
      data: { verifiedAt: new Date() },
    });
  }

  return otpRecord;
}

function ensureCustomerActive(customer: Customer) {
  if (customer.status !== "ACTIVE") {
    throw new AppError("Tài khoản đã bị khóa.", 403, "CUSTOMER_LOCKED");
  }
}

export const authService = {
  async register(payload: RegisterRequestDto) {
    try {
      const customer = await prisma.customer.create({
        data: {
          code: generateCustomerCode(),
          fullName: getDefaultFullName(payload.email),
          email: payload.email,
          passwordHash: await hashPassword(payload.password),
          emailVerified: false,
          isManualLogin: true,
          isGoogleLogin: false,
          lastLoginAt: new Date(),
        },
      });

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

    ensureCustomerActive(customer);

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

    const updatedCustomer = await prisma.customer.update({
      where: { id: customer.id },
      data: { lastLoginAt: new Date() },
    });

    return createAuthData(updatedCustomer);
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

    const customerByGoogleId = await prisma.customer.findUnique({
      where: { googleAccountId: googleProfile.sub },
    });

    if (customerByGoogleId) {
      ensureCustomerActive(customerByGoogleId);
      const updatedCustomer = await prisma.customer.update({
        where: { id: customerByGoogleId.id },
        data: {
          lastLoginAt: new Date(),
          avatar: customerByGoogleId.avatar ?? googleProfile.avatar,
        },
      });

      return createAuthData(updatedCustomer);
    }

    const customerByEmail = await prisma.customer.findUnique({
      where: { email: googleProfile.email },
    });

    if (customerByEmail) {
      ensureCustomerActive(customerByEmail);
      const updatedCustomer = await prisma.customer.update({
        where: { id: customerByEmail.id },
        data: {
          isGoogleLogin: true,
          googleAccountId: googleProfile.sub,
          emailVerified: true,
          avatar: customerByEmail.avatar ?? googleProfile.avatar,
          lastLoginAt: new Date(),
        },
      });

      return createAuthData(updatedCustomer);
    }

    const customer = await prisma.customer.create({
      data: {
        code: generateCustomerCode(),
        fullName:
          googleProfile.fullName?.trim() || getDefaultFullName(googleProfile.email),
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

    return createAuthData(customer);
  },

  async getMe(customerId: string) {
    const customer = await prisma.customer.findUnique({ where: { id: customerId } });

    if (!customer) {
      throw new AppError("Bạn cần đăng nhập để tiếp tục.", 401, "UNAUTHORIZED");
    }

    ensureCustomerActive(customer);
    return toCustomerSession(customer);
  },

  async refresh(payload: RefreshTokenRequestDto) {
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

    ensureCustomerActive(customer);

    return {
      accessToken: signCustomerAccessToken({
        sub: customer.id,
        tokenType: "CUSTOMER",
        email: customer.email,
      }),
      refreshToken: signCustomerRefreshToken({
        sub: customer.id,
        tokenType: "CUSTOMER_REFRESH",
      }),
    };
  },

  async logout() {
    return { loggedOut: true };
  },

  async forgotPassword(payload: ForgotPasswordRequestDto) {
    const customer = await prisma.customer.findUnique({
      where: { email: payload.email },
    });

    if (!customer || customer.status !== "ACTIVE") {
      return {};
    }

    const otpCode = generateOtpCode();

    await prisma.$transaction([
      prisma.passwordResetOtp.updateMany({
        where: {
          email: payload.email,
          consumedAt: null,
        },
        data: { consumedAt: new Date() },
      }),
      prisma.passwordResetOtp.create({
        data: {
          customerId: customer.id,
          email: payload.email,
          otpHash: await hashPassword(otpCode),
          expiresAt: getOtpExpiresAt(),
        },
      }),
    ]);

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
    const otpRecord = await assertOtpValid(payload.email, payload.otpCode, false);
    const customer = await prisma.customer.findUnique({
      where: { email: payload.email },
    });

    if (!customer || customer.status !== "ACTIVE") {
      throw new AppError("Mã xác nhận không đúng.", 400, "OTP_INVALID");
    }

    await prisma.$transaction([
      prisma.customer.update({
        where: { id: customer.id },
        data: {
          passwordHash: await hashPassword(payload.newPassword),
          isManualLogin: true,
        },
      }),
      prisma.passwordResetOtp.update({
        where: { id: otpRecord.id },
        data: {
          verifiedAt: otpRecord.verifiedAt ?? new Date(),
          consumedAt: new Date(),
        },
      }),
    ]);

    return { reset: true };
  },
};
