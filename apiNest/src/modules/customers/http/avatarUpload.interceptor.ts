import {
  Injectable,
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
} from "@nestjs/common";
import multer from "multer";
import type { Request, Response } from "express";
import { AppError } from "@/common/errors/appError.js";

@Injectable()
export class AvatarUploadInterceptor implements NestInterceptor {
  private readonly upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 - 1, files: 1 },
    fileFilter: (_request, file, callback) => {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
        callback(
          new AppError(
            "Avatar chỉ hỗ trợ ảnh JPG, PNG hoặc WEBP.",
            400,
            "AVATAR_FILE_TYPE_INVALID",
          ),
        );
        return;
      }
      callback(null, true);
    },
  }).single("avatar");

  async intercept(context: ExecutionContext, next: CallHandler) {
    const http = context.switchToHttp();
    await new Promise<void>((resolve, reject) => {
      this.upload(
        http.getRequest<Request>(),
        http.getResponse<Response>(),
        (error: unknown) => (error ? reject(error) : resolve()),
      );
    });
    return next.handle();
  }
}
