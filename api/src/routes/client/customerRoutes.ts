import { Router } from "express";
import {
  changePasswordDto,
  updateCustomerProfileDto,
} from "@/dto/client/authDto.js";
import { customerController } from "@/controllers/client/customerController.js";
import { customerAuthMiddleware } from "@/middlewares/authMiddleware.js";
import { avatarUploadMiddleware } from "@/middlewares/uploadMiddleware.js";
import { validateMiddleware } from "@/middlewares/validateMiddleware.js";
import { asyncHandler } from "@/utils/asyncHandler.js";

export const customerRoutes = Router();

customerRoutes.use(asyncHandler(customerAuthMiddleware));
customerRoutes.get("/me", asyncHandler(customerController.getMe));
customerRoutes.patch(
  "/me",
  validateMiddleware(updateCustomerProfileDto),
  asyncHandler(customerController.updateMe),
);
customerRoutes.patch(
  "/me/avatar",
  avatarUploadMiddleware.single("avatar"),
  asyncHandler(customerController.updateAvatar),
);
customerRoutes.patch(
  "/me/password",
  validateMiddleware(changePasswordDto),
  asyncHandler(customerController.changePassword),
);
