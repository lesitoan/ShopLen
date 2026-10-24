import { Inject, Injectable } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";
import { EnvService } from "@/config/env.service.js";
import { AppError } from "@/common/errors/appError.js";

@Injectable()
export class CloudinaryService {
  constructor(@Inject(EnvService) private readonly config: EnvService) {}

  async uploadImageBuffer(file: Express.Multer.File, folderName: string) {
    const env = this.config.values;
    if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
      throw new AppError("Cloudinary chưa được cấu hình.", 500, "CLOUDINARY_NOT_CONFIGURED",
        "Missing CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY or CLOUDINARY_API_SECRET.");
    }
    cloudinary.config({ cloud_name: env.CLOUDINARY_CLOUD_NAME, api_key: env.CLOUDINARY_API_KEY, api_secret: env.CLOUDINARY_API_SECRET });
    return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: `${env.CLOUDINARY_UPLOAD_FOLDER}/${folderName}`, resource_type: "image" }, (error, result) => {
        if (error || !result) {
          reject(new AppError("Không thể tải ảnh lên.", 500, "CLOUDINARY_UPLOAD_FAILED", error?.message));
          return;
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      });
      stream.end(file.buffer);
    });
  }
}
