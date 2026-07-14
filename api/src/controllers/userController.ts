import type { Request, Response } from "express";
import { userService } from "../services/userService.js";
import { sendSuccess } from "../utils/httpResponse.js";

export const userController = {
  async getProfile(request: Request, response: Response) {
    const profile = await userService.getProfile(request.params.id);
    return sendSuccess(response, profile);
  },
};
