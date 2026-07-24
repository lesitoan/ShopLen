import { Router } from "express";
import { uploadController } from "@/controllers/admin/uploadController.js";
import { authMiddleware } from "@/middlewares/authMiddleware.js";
import { asyncHandler } from "@/utils/asyncHandler.js";

export const uploadRoutes = Router();

uploadRoutes.post("/", authMiddleware, asyncHandler(uploadController.createUploadTarget));
