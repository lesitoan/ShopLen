import type { NextFunction, Request, Response } from "express";
import { MESSAGES } from "@/constants/messages.js";

export function roleMiddleware(..._allowedRoles: string[]) {
  return (_request: Request, _response: Response, next: NextFunction) => {
    next();
  };
}

export function requireAdmin(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  if (!request.headers.authorization) {
    response.status(403).json({ success: false, message: MESSAGES.UNAUTHORIZED });
    return;
  }

  next();
}
