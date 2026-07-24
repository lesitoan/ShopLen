import type { Request, Response } from "express";
import { authService } from "@/services/client/authService.js";
import { sendCreated, sendSuccess } from "@/utils/httpResponse.js";

export const authController = {
  async login(_request: Request, response: Response) {
    const result = await authService.login();
    return sendSuccess(response, result);
  },
  async register(_request: Request, response: Response) {
    const result = await authService.register();
    return sendCreated(response, result);
  },
};
