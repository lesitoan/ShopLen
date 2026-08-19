import type { User } from "@prisma/client";
import { prisma } from "@/config/prismaClient.js";
import type {
  AdminLoginRequestDto,
  AdminRefreshTokenRequestDto,
} from "@/dto/admin/authDto.js";
import type { AdminAuthData, AdminSession } from "@/types/adminAuth.type.js";
import { AppError } from "@/utils/appError.js";
import { comparePassword } from "@/utils/hashPassword.js";
import {
  signAdminAccessToken,
  signAdminRefreshToken,
  verifyAdminRefreshToken,
} from "@/utils/jwtToken.js";

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

function createAdminAuthData(user: User): AdminAuthData {
  return {
    accessToken: signAdminAccessToken({
      sub: user.id,
      tokenType: "ADMIN",
      email: user.email,
      role: user.role,
    }),
    refreshToken: signAdminRefreshToken({
      sub: user.id,
      tokenType: "ADMIN_REFRESH",
    }),
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

  async refresh(payload: AdminRefreshTokenRequestDto) {
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
    return createAdminAuthData(user);
  },

  async logout() {
    return { loggedOut: true };
  },
};
