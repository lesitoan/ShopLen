import type { ErrorRequestHandler } from "express";
import multer from "multer";
import { env } from "@/config/envValidation.js";
import { logger } from "@/config/logger.js";
import { MESSAGES } from "@/constants/messages.js";
import { AppError } from "@/utils/appError.js";

export const errorHandlerMiddleware: ErrorRequestHandler = (
  error,
  request,
  response,
  _next,
) => {
  const requestId = response.getHeader("x-request-id");

  if (error instanceof multer.MulterError) {
    logger.warn(
      {
        err: error,
        requestId,
        method: request.method,
        path: request.originalUrl,
      },
      "File upload request failed",
    );

    const message =
      error.code === "LIMIT_FILE_SIZE"
        ? "File avatar không được vượt quá 2MB."
        : "File upload không hợp lệ.";

    response.status(400).json({
      success: false,
      message,
      errorCode: error.code,
      internalMessage:
        env.NODE_ENV === "development" || env.NODE_ENV === "test"
          ? error.message
          : undefined,
    });
    return;
  }

  if (error instanceof AppError) {
    if (error.statusCode >= 500) {
      logger.error(
        {
          err: error,
          requestId,
          method: request.method,
          path: request.originalUrl,
          errorCode: error.errorCode,
        },
        "Application error",
      );
    }

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
      (env.NODE_ENV === "development" || env.NODE_ENV === "test")
    ) {
      payload.internalMessage = error.internalMessage;
    }

    response.status(error.statusCode).json(payload);
    return;
  }

  logger.error(
    {
      err: error,
      requestId,
      method: request.method,
      path: request.originalUrl,
    },
    "Unhandled API error",
  );

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

  if (env.NODE_ENV === "development" || env.NODE_ENV === "test") {
    payload.internalMessage =
      error instanceof Error ? error.message : "Unknown error";
  }

  response.status(500).json(payload);
};
