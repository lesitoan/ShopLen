import { UserRole } from "@prisma/client";
import { cloudinaryService } from "@/services/cloudinaryService.js";
import type {
  AdminUploadImageConfig,
  AdminUploadImageParams,
  AdminUploadImageResponse,
  AdminUploadImageTarget,
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
};
