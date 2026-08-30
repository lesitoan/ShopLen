import { UserRole } from "@prisma/client";
import { cloudinaryService } from "@/services/cloudinaryService.js";
import type {
  AdminUploadImageConfig,
  AdminUploadImageParams,
  AdminUploadImageResponse,
  AdminUploadImageTarget,
  AdminUploadManyImagesParams,
  AdminUploadManyImagesResponse,
} from "@/types/adminUpload.type.js";
import { AppError } from "@/utils/appError.js";

const ADMIN_UPLOAD_IMAGE_CONFIG: Record<
  AdminUploadImageTarget,
  AdminUploadImageConfig
> = {
  CATEGORY: {
    folderName: "categories",
    allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
  PRODUCT: {
    folderName: "products",
    allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
  BLOG: {
    folderName: "blog",
    allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF_CONTENT],
  },
  USER_AVATAR: {
    folderName: "users/avatars",
    allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
};

export const uploadService = {
  async uploadImage(
    params: AdminUploadImageParams,
  ): Promise<AdminUploadImageResponse> {
    if (!params.file) {
      throw new AppError("Vui lòng chọn ảnh cần tải lên.", 400, "IMAGE_REQUIRED");
    }

    if (!params.adminUser) {
      throw new AppError("Bạn cần đăng nhập để tiếp tục.", 401, "UNAUTHORIZED");
    }

    const config = ADMIN_UPLOAD_IMAGE_CONFIG[params.target];

    if (!config.allowedRoles.includes(params.adminUser.role)) {
      throw new AppError(
        "Bạn không có quyền tải ảnh cho khu vực này.",
        403,
        "UPLOAD_TARGET_FORBIDDEN",
      );
    }

    return cloudinaryService.uploadImageBuffer(params.file, config.folderName);
  },

  async uploadManyImages(
    params: AdminUploadManyImagesParams,
  ): Promise<AdminUploadManyImagesResponse> {
    if (!params.files || params.files.length === 0) {
      throw new AppError("Vui lòng chọn ảnh cần tải lên.", 400, "IMAGE_REQUIRED");
    }

    if (!params.adminUser) {
      throw new AppError("Bạn cần đăng nhập để tiếp tục.", 401, "UNAUTHORIZED");
    }

    const config = ADMIN_UPLOAD_IMAGE_CONFIG[params.target];

    if (!config.allowedRoles.includes(params.adminUser.role)) {
      throw new AppError(
        "Bạn không có quyền tải ảnh cho khu vực này.",
        403,
        "UPLOAD_TARGET_FORBIDDEN",
      );
    }

    return Promise.all(
      params.files.map((file) =>
        cloudinaryService.uploadImageBuffer(file, config.folderName),
      ),
    );
  },
};
