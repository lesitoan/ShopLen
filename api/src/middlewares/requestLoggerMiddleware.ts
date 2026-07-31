import { randomUUID } from "node:crypto";
import type { Request, Response } from "express";
import { pinoHttp } from "pino-http";
import { logger } from "@/config/logger.js";

type RequestWithId = Request & {
  id?: string | number | object;
};

type LoggableObject = {
  responseTime?: number;
};

function getRequestId(request: RequestWithId) {
  return request.id;
}

function getRequestPath(request: Request) {
  return request.originalUrl || request.url;
}

export const requestLoggerMiddleware = pinoHttp<Request, Response>({
  logger,
  quietReqLogger: true,
  genReqId: (request, response) => {
    const requestIdHeader = request.headers["x-request-id"];
    const requestId = Array.isArray(requestIdHeader)
      ? requestIdHeader[0]
      : requestIdHeader;
    const id = requestId || randomUUID();

    response.setHeader("x-request-id", id);
    return id;
  },
  autoLogging: {
    ignore: (request) => getRequestPath(request) === "/health",
  },
  customSuccessMessage: (request, response) =>
    `${request.method} ${getRequestPath(request)} ${response.statusCode} completed`,
  customErrorMessage: (request, response) =>
    `${request.method} ${getRequestPath(request)} ${response.statusCode} failed`,
  customSuccessObject: (request, response, loggableObject: LoggableObject) => ({
    requestId: getRequestId(request),
    method: request.method,
    path: getRequestPath(request),
    statusCode: response.statusCode,
    responseTime: loggableObject.responseTime,
  }),
  customErrorObject: (
    request,
    response,
    error,
    loggableObject: LoggableObject,
  ) => ({
    requestId: getRequestId(request),
    method: request.method,
    path: getRequestPath(request),
    statusCode: response.statusCode,
    responseTime: loggableObject.responseTime,
    err: error,
  }),
});
