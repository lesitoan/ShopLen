import multer from "multer";
import { AppError } from "@/utils/appError.js";

const MAX_AVATAR_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_AVATAR_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const avatarUploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_AVATAR_FILE_SIZE,
    files: 1,
  },
  fileFilter: (_request, file, callback) => {
    if (!ALLOWED_AVATAR_MIME_TYPES.includes(file.mimetype)) {
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
});
