import { v2 as cloudinary } from "cloudinary";
import { env } from "@/config/envValidation.js";
import { AppError } from "@/utils/appError.js";

export function getCloudinaryClient() {
  if (
    !env.CLOUDINARY_CLOUD_NAME ||
    !env.CLOUDINARY_API_KEY ||
    !env.CLOUDINARY_API_SECRET
  ) {
    throw new AppError(
      "Cloudinary chưa được cấu hình.",
      500,
      "CLOUDINARY_NOT_CONFIGURED",
      "Missing CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY or CLOUDINARY_API_SECRET.",
    );
  }

  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });

  return cloudinary;
}
