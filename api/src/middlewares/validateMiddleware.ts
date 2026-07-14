import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { MESSAGES } from "../constants/messages.js";

export function validateMiddleware(schema: ZodSchema) {
  return (request: Request, response: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: request.body,
      params: request.params,
      query: request.query,
    });

    if (!result.success) {
      response.status(422).json({
        success: false,
        message: MESSAGES.VALIDATION_FAILED,
        errors: result.error.flatten(),
      });
      return;
    }

    next();
  };
}
