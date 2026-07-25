import { Router } from "express";
import { authController } from "@/controllers/client/authController.js";
import {
  forgotPasswordDto,
  googleLoginDto,
  loginDto,
  logoutDto,
  refreshTokenDto,
  registerDto,
  resetPasswordDto,
  verifyPasswordOtpDto,
} from "@/dto/client/authDto.js";
import { customerAuthMiddleware } from "@/middlewares/authMiddleware.js";
import { validateMiddleware } from "@/middlewares/validateMiddleware.js";
import { asyncHandler } from "@/utils/asyncHandler.js";

export const authRoutes = Router();

authRoutes.post(
  "/register",
  validateMiddleware(registerDto),
  asyncHandler(authController.register),
);
authRoutes.post(
  "/login",
  validateMiddleware(loginDto),
  asyncHandler(authController.login),
);
authRoutes.post(
  "/google",
  validateMiddleware(googleLoginDto),
  asyncHandler(authController.loginWithGoogle),
);
authRoutes.get("/me", asyncHandler(customerAuthMiddleware), asyncHandler(authController.getMe));
authRoutes.post(
  "/refresh",
  validateMiddleware(refreshTokenDto),
  asyncHandler(authController.refresh),
);
authRoutes.post(
  "/logout",
  validateMiddleware(logoutDto),
  asyncHandler(authController.logout),
);
authRoutes.post(
  "/password/forgot",
  validateMiddleware(forgotPasswordDto),
  asyncHandler(authController.forgotPassword),
);
authRoutes.post(
  "/password/otp/verify",
  validateMiddleware(verifyPasswordOtpDto),
  asyncHandler(authController.verifyPasswordOtp),
);
authRoutes.post(
  "/password/reset",
  validateMiddleware(resetPasswordDto),
  asyncHandler(authController.resetPassword),
);
