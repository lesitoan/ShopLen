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
import {
  loginRateLimitMiddleware,
  passwordRecoveryRateLimitMiddleware,
  refreshRateLimitMiddleware,
} from "@/middlewares/authRateLimitMiddleware.js";

export const authRoutes = Router();

authRoutes.post(
  "/register",
  loginRateLimitMiddleware,
  validateMiddleware(registerDto),
  asyncHandler(authController.register),
);
authRoutes.post(
  "/login",
  loginRateLimitMiddleware,
  validateMiddleware(loginDto),
  asyncHandler(authController.login),
);
authRoutes.post(
  "/google",
  loginRateLimitMiddleware,
  validateMiddleware(googleLoginDto),
  asyncHandler(authController.loginWithGoogle),
);
authRoutes.get("/me", asyncHandler(customerAuthMiddleware), asyncHandler(authController.getMe));
authRoutes.post(
  "/refresh",
  refreshRateLimitMiddleware,
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
  passwordRecoveryRateLimitMiddleware,
  validateMiddleware(forgotPasswordDto),
  asyncHandler(authController.forgotPassword),
);
authRoutes.post(
  "/password/otp/verify",
  passwordRecoveryRateLimitMiddleware,
  validateMiddleware(verifyPasswordOtpDto),
  asyncHandler(authController.verifyPasswordOtp),
);
authRoutes.post(
  "/password/reset",
  passwordRecoveryRateLimitMiddleware,
  validateMiddleware(resetPasswordDto),
  asyncHandler(authController.resetPassword),
);
