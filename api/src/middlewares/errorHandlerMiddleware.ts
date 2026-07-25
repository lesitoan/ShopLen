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
    const payload: {
      success: false;
      message: string;
      errorCode: string;
      internalMessage?: string;
    } = {
      success: false,
      message: error.message,
      errorCode: error.errorCode,
    };

    if (
      error.internalMessage &&
      (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test")
    ) {
      payload.internalMessage = error.internalMessage;
    }

    response.status(error.statusCode).json(payload);
    return;
  }

  const payload: {
    success: false;
    message: string;
    errorCode: string;
    internalMessage?: string;
  } = {
    success: false,
    message: MESSAGES.INTERNAL_SERVER_ERROR,
    errorCode: "INTERNAL_SERVER_ERROR",
  };

  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
    payload.internalMessage =
      error instanceof Error ? error.message : "Unknown error";
  }

  response.status(500).json(payload);
};
