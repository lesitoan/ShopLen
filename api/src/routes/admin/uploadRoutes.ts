import { UserRole } from "@prisma/client";
import { Router } from "express";
import { uploadController } from "@/controllers/admin/uploadController.js";
import { adminUploadImageQueryDto } from "@/dto/admin/uploadDto.js";
import { adminAuthMiddleware } from "@/middlewares/adminAuthMiddleware.js";
import { requireAdmin, roleMiddleware } from "@/middlewares/roleMiddleware.js";
import { adminImageUploadMiddleware } from "@/middlewares/uploadMiddleware.js";
import { validateMiddleware } from "@/middlewares/validateMiddleware.js";
import { asyncHandler } from "@/utils/asyncHandler.js";

export const uploadRoutes = Router();

uploadRoutes.use(asyncHandler(adminAuthMiddleware), requireAdmin);

uploadRoutes.post(
  "/images",
  roleMiddleware(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF_CONTENT),
  validateMiddleware(adminUploadImageQueryDto),
  adminImageUploadMiddleware.single("image"),
  asyncHandler(uploadController.uploadImage),
);
