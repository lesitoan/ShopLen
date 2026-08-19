import { Router } from "express";
import { uploadController } from "@/controllers/admin/uploadController.js";
import { adminAuthMiddleware } from "@/middlewares/adminAuthMiddleware.js";
import { asyncHandler } from "@/utils/asyncHandler.js";

export const uploadRoutes = Router();

uploadRoutes.post(
  "/",
  asyncHandler(adminAuthMiddleware),
  asyncHandler(uploadController.createUploadTarget),
);
