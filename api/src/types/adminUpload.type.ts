import type { UserRole } from "@prisma/client";
import type { AdminSession } from "@/types/adminAuth.type.js";
import type { UploadedImage } from "@/types/cloudinary.type.js";

export type AdminUploadImageTarget = "CATEGORY" | "PRODUCT" | "BLOG";

export type AdminUploadImageConfig = {
  folderName: string;
  allowedRoles: UserRole[];
};

export type AdminUploadImageParams = {
  file?: Express.Multer.File;
  target: AdminUploadImageTarget;
  adminUser?: AdminSession;
};

export type AdminUploadManyImagesParams = {
  files?: Express.Multer.File[];
  target: AdminUploadImageTarget;
  adminUser?: AdminSession;
};

export type AdminUploadImageResponse = UploadedImage;
export type AdminUploadManyImagesResponse = UploadedImage[];
