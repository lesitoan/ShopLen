import { randomUUID } from "node:crypto";
import type { Request, Response } from "express";
import type { Logger } from "pino";
import { pinoHttp } from "pino-http";

export function createRequestLogger(logger: Logger) {
  return pinoHttp<Request, Response>({
    logger,
    quietReqLogger: true,
    genReqId: (request, response) => {
      const header = request.headers["x-request-id"];
      const id = (Array.isArray(header) ? header[0] : header) || randomUUID();
      response.setHeader("x-request-id", id);
      return id;
    },
    autoLogging: {
      ignore: (request) => (request.originalUrl || request.url) === "/health",
    },
    customSuccessMessage: (request, response) =>
      `${request.method} ${request.originalUrl || request.url} ${response.statusCode} completed`,
    customErrorMessage: (request, response) =>
      `${request.method} ${request.originalUrl || request.url} ${response.statusCode} failed`,
    customSuccessObject: (request, response, value) => ({
      requestId: request.id,
      method: request.method,
      path: request.originalUrl || request.url,
      statusCode: response.statusCode,
      responseTime: value.responseTime,
    }),
    customErrorObject: (request, response, error, value) => ({
      requestId: request.id,
      method: request.method,
      path: request.originalUrl || request.url,
      statusCode: response.statusCode,
      responseTime: value.responseTime,
      err: error,
    }),
  });
}
