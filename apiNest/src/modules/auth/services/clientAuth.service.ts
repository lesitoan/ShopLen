import { Inject, Injectable } from "@nestjs/common";
import { randomUUID, randomInt } from "node:crypto";
import type { Customer } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { EnvService } from "@/config/env.service.js";
import { PrismaService } from "@/infrastructure/prisma/prisma.service.js";
import { TokenService } from "@/modules/auth/security/token.service.js";
import { RefreshSessionService } from "@/modules/auth/services/refreshSession.service.js";
import { AppError } from "@/common/errors/appError.js";
import {
  comparePassword,
  hashPassword,
} from "@/modules/auth/security/hashPassword.js";
import type {
  AuthData,
  LogoutInput,
  RefreshTokenInput,
} from "@/modules/auth/types/clientAuth.type.js";
import type {
  ForgotPasswordRequestDto,
  GoogleLoginRequestDto,
  LoginRequestDto,
  RegisterRequestDto,
  ResetPasswordRequestDto,
  VerifyPasswordOtpRequestDto,
} from "@/modules/auth/dto/clientAuth.dto.js";
import { PasswordResetOtpService } from "@/modules/auth/services/passwordResetOtp.service.js";
import { EmailService } from "@/infrastructure/email/email.service.js";
import { GoogleAuthService } from "@/infrastructure/google/googleAuth.service.js";
import { NotificationService } from "@/infrastructure/queues/notification.service.js";
import { NOTIFICATION_JOB_NAMES } from "@/infrastructure/queues/types/notification.type.js";
import { LoggingService } from "@/infrastructure/logging/logging.service.js";
import { toCustomerSession } from "@/modules/auth/mappers/clientAuthMapper.js";
function isUserActive(customer: Customer) {
  if (customer.status !== "ACTIVE") {
    throw new AppError("Tài khoản đã bị khóa.", 403, "CUSTOMER_LOCKED");
  }
}
@Injectable()
export class ClientAuthService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(EnvService) private readonly config: EnvService,
    @Inject(TokenService) private readonly tokens: TokenService,
    @Inject(RefreshSessionService)
    private readonly sessions: RefreshSessionService,
    @Inject(PasswordResetOtpService)
    private readonly otp: PasswordResetOtpService,
    @Inject(EmailService) private readonly email: EmailService,
    @Inject(GoogleAuthService) private readonly google: GoogleAuthService,
    @Inject(NotificationService)
    private readonly notifications: NotificationService,
    @Inject(LoggingService) private readonly logging: LoggingService,
  ) {}
  private async createAuthData(customer: Customer): Promise<AuthData> {
    const jti = randomUUID();
    const refreshToken = this.tokens.signCustomerRefreshToken({
      sub: customer.id,
      tokenType: "CUSTOMER_REFRESH",
      jti,
    });
    const refreshPayload = this.tokens.verifyCustomerRefreshToken(refreshToken);
    await this.sessions.create(
      {
        accountId: customer.id,
        actorType: "CUSTOMER",
        jti,
      },
      refreshPayload.exp - Math.floor(Date.now() / 1000),
      this.config.values.MAX_CUSTOMER_SESSIONS,
    );
    return {
      accessToken: this.tokens.signCustomerAccessToken({
        sub: customer.id,
        tokenType: "CUSTOMER",
        email: customer.email,
      }),
      refreshToken,
    };
  }
  private isDevMode() {
    return (
      this.config.values.NODE_ENV === "development" ||
      this.config.values.NODE_ENV === "test"
    );
  }
  private async assertOtpValid(
    email: string,
    otpCode: string,
    markVerified: boolean,
  ) {
    return this.otp.assertValid({
      email,
      otpCode,
      maxAttempts: this.config.values.PASSWORD_OTP_MAX_ATTEMPTS,
      markVerified,
    });
  }
  async register(payload: RegisterRequestDto) {
    try {
      const customer = await this.prisma.customer.create({
        data: {
          code: randomUUID().substring(0, 8),
          fullName: payload.email.split("@")[0] || "Khách hàng",
          email: payload.email,
          passwordHash: await hashPassword(payload.password),
          emailVerified: false,
          isManualLogin: true,
          isGoogleLogin: false,
          lastLoginAt: new Date(),
        },
      });
      await this.notifications.enqueue(
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
      return this.createAuthData(customer);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new AppError(
          "Email đã được sử dụng.",
          409,
          "EMAIL_ALREADY_EXISTS",
        );
      }
      throw error;
    }
  }
  async login(payload: LoginRequestDto) {
    const customer = await this.prisma.customer.findUnique({
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
    this.prisma.customer
      .update({ where: { id: customer.id }, data: { lastLoginAt: new Date() } })
      .catch((err) =>
        this.logging.logger.error("Failed to update lastLoginAt", err),
      );
    return this.createAuthData(customer);
  }
  async loginWithGoogle(payload: GoogleLoginRequestDto) {
    const googleProfile = await this.google.verify(payload.idToken);
    if (!googleProfile.emailVerified) {
      throw new AppError(
        "Email Google chưa được xác thực.",
        400,
        "GOOGLE_EMAIL_NOT_VERIFIED",
      );
    }
    const existingCustomer = await this.prisma.customer.findFirst({
      where: {
        OR: [
          { googleAccountId: googleProfile.sub },
          { email: googleProfile.email },
        ],
      },
    });
    if (existingCustomer) {
      isUserActive(existingCustomer);
      const isNewGoogleLink =
        existingCustomer.googleAccountId !== googleProfile.sub;
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
      this.prisma.customer
        .update({ where: { id: existingCustomer.id }, data: updateData })
        .catch((err) =>
          this.logging.logger.error(
            "Failed to update customer on Google login",
            err,
          ),
        );
      return this.createAuthData(existingCustomer);
    }
    const customer = await this.prisma.customer.create({
      data: {
        code: randomUUID().substring(0, 8),
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
    await this.notifications.enqueue(
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
    return this.createAuthData(customer);
  }
  async getMe(customerId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });
    if (!customer) {
      throw new AppError("Bạn cần đăng nhập để tiếp tục.", 401, "UNAUTHORIZED");
    }
    isUserActive(customer);
    return toCustomerSession(customer);
  }
  async refresh(payload: RefreshTokenInput) {
    const refreshPayload = this.tokens.verifyCustomerRefreshToken(
      payload.refreshToken,
    );
    const customer = await this.prisma.customer.findUnique({
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
    await this.sessions.consume({
      accountId: customer.id,
      actorType: "CUSTOMER",
      jti: refreshPayload.jti,
    });
    return this.createAuthData(customer);
  }
  async logout(payload: LogoutInput) {
    if (payload.refreshToken) {
      try {
        const refreshPayload = this.tokens.verifyCustomerRefreshToken(
          payload.refreshToken,
        );
        await this.sessions.revoke({
          accountId: refreshPayload.sub,
          actorType: "CUSTOMER",
          jti: refreshPayload.jti,
        });
      } catch {
        return { loggedOut: true };
      }
    }
    return { loggedOut: true };
  }
  async forgotPassword(payload: ForgotPasswordRequestDto) {
    const customer = await this.prisma.customer.findUnique({
      where: { email: payload.email },
    });
    if (!customer || customer.status !== "ACTIVE") {
      return {};
    }
    const otpCode = String(randomInt(0, 1000000)).padStart(6, "0");
    await this.otp.create({
      customerId: customer.id,
      email: payload.email,
      otpCode,
      ttlSeconds: this.config.values.PASSWORD_OTP_EXPIRES_MINUTES * 60,
    });
    await this.email.sendPasswordResetOtpEmail({
      to: customer.email,
      otpCode,
      expiresInMinutes: this.config.values.PASSWORD_OTP_EXPIRES_MINUTES,
    });
    if (this.isDevMode()) {
      return { devOtp: otpCode };
    }
    return {};
  }
  async verifyPasswordOtp(payload: VerifyPasswordOtpRequestDto) {
    await this.assertOtpValid(payload.email, payload.otpCode, true);
    return { verified: true };
  }
  async resetPassword(payload: ResetPasswordRequestDto) {
    await this.assertOtpValid(payload.email, payload.otpCode, false);
    const customer = await this.prisma.customer.findUnique({
      where: { email: payload.email },
    });
    if (!customer || customer.status !== "ACTIVE") {
      throw new AppError("Mã xác nhận không đúng.", 400, "OTP_INVALID");
    }
    await this.prisma.customer.update({
      where: { id: customer.id },
      data: {
        passwordHash: await hashPassword(payload.newPassword),
        isManualLogin: true,
      },
    });
    await this.sessions.revokeAll("CUSTOMER", customer.id);
    await this.otp.consume(payload.email);
    return { reset: true };
  }
}
