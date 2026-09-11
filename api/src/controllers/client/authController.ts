import type { Request, Response } from "express";
import { authService } from "@/services/client/authService.js";
import { AppError } from "@/utils/appError.js";
import {
  clearRefreshTokenCookie,
  getRefreshTokenCookie,
  setRefreshTokenCookie,
} from "@/utils/authCookie.js";
import { sendCreated, sendSuccess } from "@/utils/httpResponse.js";

export const authController = {
  async register(request: Request, response: Response) {
    const result = await authService.register(request.body);
    setRefreshTokenCookie(response, "CUSTOMER", result.refreshToken);
    return sendCreated(response, { accessToken: result.accessToken }, "Đăng ký thành công.");
  },

  async login(request: Request, response: Response) {
    const result = await authService.login(request.body);
    setRefreshTokenCookie(response, "CUSTOMER", result.refreshToken);
    return sendSuccess(response, { accessToken: result.accessToken }, "Đăng nhập thành công.");
  },

  async loginWithGoogle(request: Request, response: Response) {
    const result = await authService.loginWithGoogle(request.body);
    setRefreshTokenCookie(response, "CUSTOMER", result.refreshToken);
    return sendSuccess(response, { accessToken: result.accessToken }, "Đăng nhập Google thành công.");
  },

  async getMe(request: Request, response: Response) {
    const result = await authService.getMe(request.customerId ?? "");
    return sendSuccess(response, result);
  },

  async refresh(request: Request, response: Response) {
    const refreshToken = getRefreshTokenCookie(request, "CUSTOMER");

    if (!refreshToken) {
      throw new AppError(
        "Refresh token không hợp lệ hoặc đã hết hạn.",
        401,
        "REFRESH_TOKEN_INVALID",
      );
    }

    const result = await authService.refresh({ refreshToken });
    setRefreshTokenCookie(response, "CUSTOMER", result.refreshToken);
    return sendSuccess(response, { accessToken: result.accessToken });
  },

  async logout(request: Request, response: Response) {
    const refreshToken = getRefreshTokenCookie(request, "CUSTOMER");
    const result = await authService.logout({ refreshToken });
    clearRefreshTokenCookie(response, "CUSTOMER");
    return sendSuccess(response, result, "Đăng xuất thành công.");
  },

  async forgotPassword(request: Request, response: Response) {
    const result = await authService.forgotPassword(request.body);
    return sendSuccess(
      response,
      result,
      "Nếu email hợp lệ, mã xác nhận sẽ được gửi đến hộp thư của bạn.",
    );
  },

  async verifyPasswordOtp(request: Request, response: Response) {
    const result = await authService.verifyPasswordOtp(request.body);
    return sendSuccess(response, result, "Mã xác nhận hợp lệ.");
  },

  async resetPassword(request: Request, response: Response) {
    const result = await authService.resetPassword(request.body);
    clearRefreshTokenCookie(response, "CUSTOMER");
    return sendSuccess(response, result, "Đặt lại mật khẩu thành công.");
  },
};
