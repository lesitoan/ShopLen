import type { NextFunction, Request, Response } from "express";
import { prisma } from "@/config/prismaClient.js";
import { toAdminSession } from "@/services/admin/authService.js";
import { AppError } from "@/utils/appError.js";
import { verifyAdminAccessToken } from "@/utils/jwtToken.js";

export async function adminAuthMiddleware(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  try {
    const authorizationHeader = request.headers.authorization;
    const token = authorizationHeader?.startsWith("Bearer ")
      ? authorizationHeader.slice("Bearer ".length)
      : null;

    if (!token) {
      throw new AppError("Bạn cần đăng nhập để tiếp tục.", 401, "UNAUTHORIZED");
    }

    const payload = verifyAdminAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new AppError("Bạn cần đăng nhập để tiếp tục.", 401, "UNAUTHORIZED");
    }

    if (user.status !== "ACTIVE") {
      throw new AppError("Tài khoản quản trị đã bị khóa.", 403, "USER_LOCKED");
    }

    request.adminUserId = user.id;
    request.adminUser = toAdminSession(user);
    next();
  } catch (error) {
    next(error);
  }
}
