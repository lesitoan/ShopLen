import type { NextFunction, Request, Response } from "express";
import { MESSAGES } from "@/constants/messages.js";
import { prisma } from "@/config/prismaClient.js";
import { AppError } from "@/utils/appError.js";
import { verifyCustomerAccessToken } from "@/utils/jwtToken.js";
import { toCustomerSession } from "@/services/client/authService.js";

export function authMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  if (!request.headers.authorization?.startsWith("Bearer ")) {
    response.status(401).json({ success: false, message: MESSAGES.UNAUTHORIZED });
    return;
  }

  next();
}

export async function customerAuthMiddleware(
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

    const payload = verifyCustomerAccessToken(token);
    const customer = await prisma.customer.findUnique({
      where: { id: payload.sub },
    });

    if (!customer || customer.status !== "ACTIVE") {
      throw new AppError(
        "Tài khoản không tồn tại hoặc đã bị khóa.",
        403,
        "CUSTOMER_LOCKED",
      );
    }

    request.customerId = customer.id;
    request.customer = toCustomerSession(customer);
    next();
  } catch (error) {
    next(error);
  }
}
