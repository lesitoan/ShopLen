import type { ErrorRequestHandler } from "express";
import { MESSAGES } from "@/constants/messages.js";
import { AppError } from "@/utils/appError.js";

export const errorHandlerMiddleware: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  response.status(500).json({
    success: false,
    message: MESSAGES.INTERNAL_SERVER_ERROR,
  });
};
