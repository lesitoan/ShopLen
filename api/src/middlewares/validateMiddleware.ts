import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { MESSAGES } from "@/constants/messages.js";
import { AppError } from "@/utils/appError.js";

export function validateMiddleware(schema: ZodSchema) {
  return (request: Request, response: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: request.body,
      params: request.params,
      query: request.query,
    });

    if (!result.success) {
      next(
        new AppError(
          MESSAGES.VALIDATION_FAILED,
          422,
          "VALIDATION_ERROR",
          JSON.stringify(result.error.flatten()),
        ),
      );
      return;
    }

    if ("body" in result.data) {
      request.body = result.data.body;
    }

    if ("params" in result.data) {
      request.params = result.data.params;
    }

    if ("query" in result.data) {
      request.query = result.data.query;
    }

    next();
  };
}
