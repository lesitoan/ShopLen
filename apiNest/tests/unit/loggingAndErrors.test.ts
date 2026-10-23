import "../harness/testEnvironment.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { type ArgumentsHost, UnauthorizedException } from "@nestjs/common";
import multer from "multer";
import { AppError } from "@/common/errors/appError.js";
import { ApiExceptionFilter } from "@/common/filters/apiException.filter.js";
import { EnvService } from "@/config/env.service.js";
import { createLogger } from "@/infrastructure/logging/logger.factory.js";
import type { LoggingService } from "@/infrastructure/logging/logging.service.js";

test("Pino redacts credentials while retaining request context", () => {
  const records: string[] = [];
  const config = new EnvService();
  const logger = createLogger({ ...config.values, LOG_LEVEL: "info" }, {
    write: (value: string) => { records.push(value); },
  });
  logger.info({
    req: { headers: { authorization: "Bearer secret", cookie: "refreshToken=secret" } },
    res: { headers: { "set-cookie": "refreshToken=secret" } },
    user: { password: "secret", accessToken: "secret", refreshToken: "secret", otpCode: "123456" },
    requestId: "request-123",
  }, "request completed");
  const record = JSON.parse(records[0]);
  assert.equal(record.requestId, "request-123");
  assert.equal(record.req.headers.authorization, "[REDACTED]");
  assert.equal(record.req.headers.cookie, "[REDACTED]");
  assert.equal(record.res.headers["set-cookie"], "[REDACTED]");
  assert.equal(record.user.otpCode, "[REDACTED]");
  assert.equal(record.user.password, "[REDACTED]");
  assert.equal(records[0].includes("secret"), false);
});

test("exception filter preserves legacy errors and hides internal messages in production", () => {
  const config = new EnvService();
  const logger = createLogger({ ...config.values, LOG_LEVEL: "silent" });
  const logging = { logger } as LoggingService;
  const capture = (error: unknown, nodeEnv: "test" | "production") => {
    let status: number | undefined;
    let body: unknown;
    const response = {
      getHeader: () => "request-123",
      status: (value: number) => { status = value; return response; },
      json: (value: unknown) => { body = value; },
    };
    const host = {
      switchToHttp: () => ({
        getResponse: () => response,
        getRequest: () => ({ method: "POST", originalUrl: "/api/v1/test" }),
      }),
    } as unknown as ArgumentsHost;
    const env = { values: { ...config.values, NODE_ENV: nodeEnv } } as EnvService;
    new ApiExceptionFilter(env, logging).catch(error, host);
    return { status, body };
  };

  assert.deepEqual(capture(new AppError("Không hợp lệ.", 422, "VALIDATION_ERROR", "private"), "test"), {
    status: 422,
    body: { success: false, message: "Không hợp lệ.", errorCode: "VALIDATION_ERROR", internalMessage: "private" },
  });
  assert.deepEqual(capture(new AppError("Không hợp lệ.", 422, "VALIDATION_ERROR", "private"), "production"), {
    status: 422, body: { success: false, message: "Không hợp lệ.", errorCode: "VALIDATION_ERROR" },
  });
  assert.deepEqual(capture(new Error("database secret"), "production"), {
    status: 500, body: { success: false, message: "Có lỗi xảy ra, vui lòng thử lại sau.", errorCode: "INTERNAL_SERVER_ERROR" },
  });
  assert.deepEqual(capture(new multer.MulterError("LIMIT_FILE_SIZE"), "test"), {
    status: 400,
    body: { success: false, message: "File avatar không được vượt quá 2MB.", errorCode: "LIMIT_FILE_SIZE", internalMessage: "File too large" },
  });
  assert.deepEqual(capture(new UnauthorizedException("Bạn cần đăng nhập."), "production"), {
    status: 401, body: { success: false, message: "Bạn cần đăng nhập.", errorCode: "UNAUTHORIZED" },
  });
});
