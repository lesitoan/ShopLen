import { timingSafeEqual } from "node:crypto";
import { Inject, Injectable, type CanActivate, type ExecutionContext } from "@nestjs/common";
import type { Request } from "express";
import { EnvService } from "@/config/env.service.js";
import { AppError } from "@/common/errors/appError.js";

@Injectable()
export class InternalAiGuard implements CanActivate {
  constructor(@Inject(EnvService) private readonly config: EnvService) {}
  canActivate(context: ExecutionContext) {
    const expected = this.config.values.AI_INTERNAL_KEY;
    const supplied = context.switchToHttp().getRequest<Request>().headers["x-internal-key"];
    if (!expected) throw new AppError("Dịch vụ AI chưa được cấu hình.", 503, "AI_NOT_CONFIGURED");
    if (typeof supplied !== "string" || Buffer.byteLength(supplied) !== Buffer.byteLength(expected) || !timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) {
      throw new AppError("Không được phép truy cập.", 401, "INTERNAL_AUTH_REQUIRED");
    }
    return true;
  }
}
