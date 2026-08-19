import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "@prisma/client";
import { AppError } from "@/utils/appError.js";

export function roleMiddleware(...allowedRoles: UserRole[]) {
  return (request: Request, _response: Response, next: NextFunction) => {
    if (!request.adminUser) {
      throw new AppError("Bạn cần đăng nhập để tiếp tục.", 401, "UNAUTHORIZED");
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(request.adminUser.role)) {
      throw new AppError("Bạn không có quyền thực hiện hành động này.", 403, "FORBIDDEN");
    }

    next();
  };
}

export function requireAdmin(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  if (!request.adminUser) {
    throw new AppError("Bạn cần đăng nhập để tiếp tục.", 401, "UNAUTHORIZED");
  }

  next();
}
