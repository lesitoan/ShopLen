import multer from "multer";
import { AppError } from "@/utils/appError.js";

const MAX_AVATAR_FILE_SIZE = 2 * 1024 * 1024;
const MAX_ADMIN_IMAGE_FILE_SIZE = 5 * 1024 * 1024;
export const MAX_ADMIN_IMAGE_FILES = 6;
const ALLOWED_AVATAR_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_ADMIN_IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

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

export const adminImageUploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_ADMIN_IMAGE_FILE_SIZE,
    files: 1,
  },
  fileFilter: (_request, file, callback) => {
    if (!ALLOWED_ADMIN_IMAGE_MIME_TYPES.includes(file.mimetype)) {
      callback(
        new AppError(
          "Ảnh chỉ hỗ trợ định dạng JPG, PNG hoặc WEBP.",
          400,
          "ADMIN_IMAGE_FILE_TYPE_INVALID",
        ),
      );
      return;
    }

    callback(null, true);
  },
});

export const adminManyImagesUploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_ADMIN_IMAGE_FILE_SIZE,
    files: MAX_ADMIN_IMAGE_FILES,
  },
  fileFilter: (_request, file, callback) => {
    if (!ALLOWED_ADMIN_IMAGE_MIME_TYPES.includes(file.mimetype)) {
      callback(
        new AppError(
          "Ảnh chỉ hỗ trợ định dạng JPG, PNG hoặc WEBP.",
          400,
          "ADMIN_IMAGE_FILE_TYPE_INVALID",
        ),
      );
      return;
    }

    callback(null, true);
  },
});
