import { Injectable, type CallHandler, type ExecutionContext, type NestInterceptor } from "@nestjs/common";
import multer from "multer";
import type { Request, Response } from "express";
import { AppError } from "@/common/errors/appError.js";
import { ZodValidationPipe } from "@/common/pipes/zodValidation.pipe.js";
import { adminUploadImageQueryDto } from "@/modules/uploads/dto/adminUpload.dto.js";

class AdminImageUploadInterceptor implements NestInterceptor {
  private readonly upload;
  private readonly validation = new ZodValidationPipe(adminUploadImageQueryDto);

  constructor(many: boolean) {
    const parser = multer({
      storage: multer.memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024, files: many ? 6 : 1 },
      fileFilter: (_request, file, callback) => {
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
          callback(new AppError("Ảnh chỉ hỗ trợ định dạng JPG, PNG hoặc WEBP.", 400, "ADMIN_IMAGE_FILE_TYPE_INVALID"));
          return;
        }
        callback(null, true);
      },
    });
    this.upload = many ? parser.array("images", 6) : parser.single("image");
  }

  async intercept(context: ExecutionContext, next: CallHandler) {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    this.validation.transform({ query: request.query });
    await new Promise<void>((resolve, reject) => {
      this.upload(request, http.getResponse<Response>(), (error: unknown) => error ? reject(error) : resolve());
    });
    return next.handle();
  }
}

@Injectable()
export class AdminSingleImageInterceptor extends AdminImageUploadInterceptor {
  constructor() { super(false); }
}

@Injectable()
export class AdminManyImagesInterceptor extends AdminImageUploadInterceptor {
  constructor() { super(true); }
}
