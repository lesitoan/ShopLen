import { Inject, Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import type { User } from "@prisma/client";
import { EnvService } from "@/config/env.service.js";
import { PrismaService } from "@/infrastructure/prisma/prisma.service.js";
import { TokenService } from "@/modules/auth/security/token.service.js";
import { RefreshSessionService } from "@/modules/auth/services/refreshSession.service.js";
import { AppError } from "@/common/errors/appError.js";
import { comparePassword } from "@/modules/auth/security/hashPassword.js";
import type {
  AdminAuthData,
  AdminLogoutInput,
  AdminRefreshTokenInput,
} from "@/modules/auth/types/adminAuth.type.js";
import type { AdminLoginRequestDto } from "@/modules/auth/dto/adminAuth.dto.js";
import { toAdminSession } from "@/modules/auth/mappers/adminAuthMapper.js";
function ensureAdminActive(user: User) {
  if (user.status !== "ACTIVE") {
    throw new AppError("Tài khoản quản trị đã bị khóa.", 403, "USER_LOCKED");
  }
}
@Injectable()
export class AdminAuthService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(EnvService) private readonly config: EnvService,
    @Inject(TokenService) private readonly tokens: TokenService,
    @Inject(RefreshSessionService)
    private readonly sessions: RefreshSessionService,
  ) {}
  private async createAdminAuthData(user: User): Promise<AdminAuthData> {
    const jti = randomUUID();
    const refreshToken = this.tokens.signAdminRefreshToken({
      sub: user.id,
      tokenType: "ADMIN_REFRESH",
      jti,
    });
    const refreshPayload = this.tokens.verifyAdminRefreshToken(refreshToken);
    await this.sessions.create(
      {
        accountId: user.id,
        actorType: "ADMIN",
        jti,
      },
      refreshPayload.exp - Math.floor(Date.now() / 1000),
      this.config.values.MAX_ADMIN_SESSIONS,
    );
    return {
      accessToken: this.tokens.signAdminAccessToken({
        sub: user.id,
        tokenType: "ADMIN",
        email: user.email,
        role: user.role,
      }),
      refreshToken,
    };
  }
  async login(payload: AdminLoginRequestDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: payload.email },
    });
    if (!user) {
      throw new AppError(
        "Email hoặc mật khẩu không đúng.",
        401,
        "INVALID_CREDENTIALS",
      );
    }
    ensureAdminActive(user);
    const isPasswordValid = await comparePassword(
      payload.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new AppError(
        "Email hoặc mật khẩu không đúng.",
        401,
        "INVALID_CREDENTIALS",
      );
    }
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });
    return this.createAdminAuthData(updatedUser);
  }
  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AppError("Bạn cần đăng nhập để tiếp tục.", 401, "UNAUTHORIZED");
    }
    ensureAdminActive(user);
    return toAdminSession(user);
  }
  async refresh(payload: AdminRefreshTokenInput) {
    const refreshPayload = this.tokens.verifyAdminRefreshToken(
      payload.refreshToken,
    );
    const user = await this.prisma.user.findUnique({
      where: { id: refreshPayload.sub },
    });
    if (!user) {
      throw new AppError(
        "Refresh token không hợp lệ.",
        401,
        "REFRESH_TOKEN_INVALID",
      );
    }
    ensureAdminActive(user);
    await this.sessions.consume({
      accountId: user.id,
      actorType: "ADMIN",
      jti: refreshPayload.jti,
    });
    return this.createAdminAuthData(user);
  }
  async logout(payload: AdminLogoutInput) {
    if (payload.refreshToken) {
      try {
        const refreshPayload = this.tokens.verifyAdminRefreshToken(
          payload.refreshToken,
        );
        await this.sessions.revoke({
          accountId: refreshPayload.sub,
          actorType: "ADMIN",
          jti: refreshPayload.jti,
        });
      } catch {
        return { loggedOut: true };
      }
    }
    return { loggedOut: true };
  }
}
