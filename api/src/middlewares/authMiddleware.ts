import type { NextFunction, Request, Response } from "express";
import { MESSAGES } from "../constants/messages.js";

export function authMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader) {
    response.status(401).json({ success: false, message: MESSAGES.UNAUTHORIZED });
    return;
  }

  next();
}
