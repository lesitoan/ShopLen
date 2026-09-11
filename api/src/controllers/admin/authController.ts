import type { Request, Response } from "express";
import { adminAuthService } from "@/services/admin/authService.js";
import { AppError } from "@/utils/appError.js";
import {
  clearRefreshTokenCookie,
  getRefreshTokenCookie,
  setRefreshTokenCookie,
} from "@/utils/authCookie.js";
import { sendSuccess } from "@/utils/httpResponse.js";

export const adminAuthController = {
  async login(request: Request, response: Response) {
    const result = await adminAuthService.login(request.body);
    setRefreshTokenCookie(response, "ADMIN", result.refreshToken);
    return sendSuccess(response, { accessToken: result.accessToken }, "Đăng nhập thành công.");
  },

  async getMe(request: Request, response: Response) {
    const result = await adminAuthService.getMe(request.adminUserId ?? "");
    return sendSuccess(response, result);
  },

  async refresh(request: Request, response: Response) {
    const refreshToken = getRefreshTokenCookie(request, "ADMIN");

    if (!refreshToken) {
      throw new AppError(
        "Refresh token không hợp lệ hoặc đã hết hạn.",
        401,
        "REFRESH_TOKEN_INVALID",
      );
    }

    const result = await adminAuthService.refresh({ refreshToken });
    setRefreshTokenCookie(response, "ADMIN", result.refreshToken);
    return sendSuccess(response, { accessToken: result.accessToken });
  },

  async logout(request: Request, response: Response) {
    const refreshToken = getRefreshTokenCookie(request, "ADMIN");
    const result = await adminAuthService.logout({ refreshToken });
    clearRefreshTokenCookie(response, "ADMIN");
    return sendSuccess(response, result, "Đăng xuất thành công.");
  },
};
