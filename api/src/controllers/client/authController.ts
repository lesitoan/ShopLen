import type { Request, Response } from "express";
import { authService } from "@/services/client/authService.js";
import { sendCreated, sendSuccess } from "@/utils/httpResponse.js";

export const authController = {
  async register(request: Request, response: Response) {
    const result = await authService.register(request.body);
    return sendCreated(response, result, "Đăng ký thành công.");
  },

  async login(request: Request, response: Response) {
    const result = await authService.login(request.body);
    return sendSuccess(response, result, "Đăng nhập thành công.");
  },

  async loginWithGoogle(request: Request, response: Response) {
    const result = await authService.loginWithGoogle(request.body);
    return sendSuccess(response, result, "Đăng nhập Google thành công.");
  },

  async getMe(request: Request, response: Response) {
    const result = await authService.getMe(request.customerId ?? "");
    return sendSuccess(response, result);
  },

  async refresh(request: Request, response: Response) {
    const result = await authService.refresh(request.body);
    return sendSuccess(response, result);
  },

  async logout(_request: Request, response: Response) {
    const result = await authService.logout();
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
    return sendSuccess(response, result, "Đặt lại mật khẩu thành công.");
  },
};
