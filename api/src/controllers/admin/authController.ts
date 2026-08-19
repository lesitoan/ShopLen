import type { Request, Response } from "express";
import { adminAuthService } from "@/services/admin/authService.js";
import { sendSuccess } from "@/utils/httpResponse.js";

export const adminAuthController = {
  async login(request: Request, response: Response) {
    const result = await adminAuthService.login(request.body);
    return sendSuccess(response, result, "Đăng nhập thành công.");
  },

  async getMe(request: Request, response: Response) {
    const result = await adminAuthService.getMe(request.adminUserId ?? "");
    return sendSuccess(response, result);
  },

  async refresh(request: Request, response: Response) {
    const result = await adminAuthService.refresh(request.body);
    return sendSuccess(response, result);
  },

  async logout(_request: Request, response: Response) {
    const result = await adminAuthService.logout();
    return sendSuccess(response, result, "Đăng xuất thành công.");
  },
};
