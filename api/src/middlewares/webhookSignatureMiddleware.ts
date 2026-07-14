import type { NextFunction, Request, Response } from "express";
import { MESSAGES } from "../constants/messages.js";

export function webhookSignatureMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const signature = request.headers["x-webhook-signature"];

  if (!signature) {
    response.status(401).json({ success: false, message: MESSAGES.UNAUTHORIZED });
    return;
  }

  next();
}
