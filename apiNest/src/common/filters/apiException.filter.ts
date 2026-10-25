import { Catch, HttpException, type ArgumentsHost, type ExceptionFilter } from "@nestjs/common";
import multer from "multer";
import type { Request, Response } from "express";
import { AppError } from "@/common/errors/appError.js";
import type { ApiErrorResponse } from "@/common/types/httpResponse.type.js";
import type { EnvService } from "@/config/env.service.js";
import type { LoggingService } from "@/infrastructure/logging/logging.service.js";

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly config: EnvService,
    private readonly logging: LoggingService,
  ) {}

  catch(error: unknown, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const response = http.getResponse<Response>();
    const request = http.getRequest<Request>();
    const context = {
      err: error, requestId: response.getHeader("x-request-id"),
      method: request.method, path: request.originalUrl,
    };
    const isDev = this.config.values.NODE_ENV !== "production";
    let status = 500;
    const payload: ApiErrorResponse = {
      success: false,
      message: "Có lỗi xảy ra, vui lòng thử lại sau.",
      errorCode: "INTERNAL_SERVER_ERROR",
    };

    if (error instanceof multer.MulterError) {
      status = 400;
      payload.message = error.code === "LIMIT_FILE_SIZE"
        ? "File avatar không được vượt quá 2MB." : "File upload không hợp lệ.";
      payload.errorCode = error.code;
      if (isDev) payload.internalMessage = error.code === "LIMIT_UNEXPECTED_FILE" ? "Unexpected field" : error.message;
      this.logging.logger.warn(context, "File upload request failed");
    } else if (error instanceof AppError) {
      status = error.statusCode;
      payload.message = error.message;
      payload.errorCode = error.errorCode;
      if (isDev && error.internalMessage) payload.internalMessage = error.internalMessage;
      if (status >= 500) {
        this.logging.logger.error({ ...context, errorCode: error.errorCode }, "Application error");
      }
    } else if (error instanceof HttpException) {
      status = error.getStatus();
      payload.message = error.message;
      payload.errorCode = {
        400: "BAD_REQUEST", 401: "UNAUTHORIZED", 403: "FORBIDDEN", 404: "NOT_FOUND",
        405: "METHOD_NOT_ALLOWED", 413: "PAYLOAD_TOO_LARGE", 429: "RATE_LIMIT_EXCEEDED",
      }[status] ?? "HTTP_ERROR";
      if (status >= 500) this.logging.logger.error(context, "HTTP error");
    } else {
      if (isDev) payload.internalMessage = error instanceof Error ? error.message : "Unknown error";
      this.logging.logger.error(context, "Unhandled API error");
    }

    response.status(status).json(payload);
  }
}
