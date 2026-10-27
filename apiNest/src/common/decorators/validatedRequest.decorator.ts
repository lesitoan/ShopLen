import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import type { Request } from "express";
import type { ZodTypeAny } from "zod";
import { ZodValidationPipe } from "@/common/pipes/zodValidation.pipe.js";

const requestInput = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    return { body: request.body, query: request.query, params: request.params };
  },
);

export function ValidatedRequest(schema: ZodTypeAny) {
  return requestInput(undefined, new ZodValidationPipe(schema));
}
