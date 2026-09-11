import { randomUUID } from "node:crypto";
import type { User } from "@prisma/client";
import { prisma } from "@/config/prismaClient.js";
import { env } from "@/config/envValidation.js";
import type { AdminLoginRequestDto } from "@/dto/admin/authDto.js";
import type {
  AdminAuthData,
  AdminLogoutInput,
  AdminRefreshTokenInput,
  AdminSession,
} from "@/types/adminAuth.type.js";
import { AppError } from "@/utils/appError.js";
import { comparePassword } from "@/utils/hashPassword.js";
import {
  signAdminAccessToken,
  signAdminRefreshToken,
  verifyAdminRefreshToken,
} from "@/utils/jwtToken.js";
import { refreshSessionService } from "@/services/refreshSessionService.js";

export function toAdminSession(user: User): AdminSession {
  return {
    id: user.id,
    code: user.code,
    fullName: user.fullName,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    status: user.status,
  };
}

async function createAdminAuthData(user: User): Promise<AdminAuthData> {
  const jti = randomUUID();
  const refreshToken = signAdminRefreshToken({
    sub: user.id,
    tokenType: "ADMIN_REFRESH",
    jti,
  });
  const refreshPayload = verifyAdminRefreshToken(refreshToken);

  await refreshSessionService.create(
    {
      accountId: user.id,
      actorType: "ADMIN",
      jti,
    },
    refreshPayload.exp - Math.floor(Date.now() / 1000),
    env.MAX_ADMIN_SESSIONS,
  );

  return {
    accessToken: signAdminAccessToken({
      sub: user.id,
      tokenType: "ADMIN",
      email: user.email,
      role: user.role,
    }),
    refreshToken,
  };
}

function ensureAdminActive(user: User) {
  if (user.status !== "ACTIVE") {
    throw new AppError("Tài khoản quản trị đã bị khóa.", 403, "USER_LOCKED");
  }
}



export const adminAuthService = {
  async login(payload: AdminLoginRequestDto) {
    const user = await prisma.user.findUnique({
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

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return createAdminAuthData(updatedUser);
  },

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new AppError("Bạn cần đăng nhập để tiếp tục.", 401, "UNAUTHORIZED");
    }

    ensureAdminActive(user);
    return toAdminSession(user);
  },

  async refresh(payload: AdminRefreshTokenInput) {
    const refreshPayload = verifyAdminRefreshToken(payload.refreshToken);
    const user = await prisma.user.findUnique({
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
    await refreshSessionService.consume({
      accountId: user.id,
      actorType: "ADMIN",
      jti: refreshPayload.jti,
    });
    return createAdminAuthData(user);
  },

  async logout(payload: AdminLogoutInput) {
    if (payload.refreshToken) {
      try {
        const refreshPayload = verifyAdminRefreshToken(payload.refreshToken);
        await refreshSessionService.revoke({
          accountId: refreshPayload.sub,
          actorType: "ADMIN",
          jti: refreshPayload.jti,
        });
      } catch {
        // Logout is intentionally idempotent for expired or already-revoked sessions.
      }
    }

    return { loggedOut: true };
  },
};
