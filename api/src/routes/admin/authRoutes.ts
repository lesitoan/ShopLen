import { Router } from "express";
import { adminAuthController } from "@/controllers/admin/authController.js";
import {
  adminLoginDto,
  adminLogoutDto,
  adminRefreshTokenDto,
} from "@/dto/admin/authDto.js";
import { adminAuthMiddleware } from "@/middlewares/adminAuthMiddleware.js";
import { validateMiddleware } from "@/middlewares/validateMiddleware.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import {
  loginRateLimitMiddleware,
  refreshRateLimitMiddleware,
} from "@/middlewares/authRateLimitMiddleware.js";

export const adminAuthRoutes = Router();

adminAuthRoutes.post(
  "/login",
  loginRateLimitMiddleware,
  validateMiddleware(adminLoginDto),
  asyncHandler(adminAuthController.login),
);
adminAuthRoutes.get(
  "/me",
  asyncHandler(adminAuthMiddleware),
  asyncHandler(adminAuthController.getMe),
);
adminAuthRoutes.post(
  "/refresh",
  refreshRateLimitMiddleware,
  validateMiddleware(adminRefreshTokenDto),
  asyncHandler(adminAuthController.refresh),
);
adminAuthRoutes.post(
  "/logout",
  validateMiddleware(adminLogoutDto),
  asyncHandler(adminAuthController.logout),
);
