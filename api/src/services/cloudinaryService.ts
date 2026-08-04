import { env } from "@/config/envValidation.js";
import { getCloudinaryClient } from "@/config/cloudinaryClient.js";
import type { UploadedImage } from "@/types/cloudinary.type.js";
import { AppError } from "@/utils/appError.js";

export const cloudinaryService = {
  async uploadImageBuffer(
    file: Express.Multer.File,
    folderName: string,
  ): Promise<UploadedImage> {
    const cloudinary = getCloudinaryClient();
    const folder = `${env.CLOUDINARY_UPLOAD_FOLDER}/${folderName}`;

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) {
            reject(
              new AppError(
                "Không thể tải ảnh lên.",
                500,
                "CLOUDINARY_UPLOAD_FAILED",
                error?.message,
              ),
            );
            return;
          }

          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        },
      );

      uploadStream.end(file.buffer);
    });
  },
};
