import type { Request, Response } from "express";
import { adminDashboardService } from "@/services/admin/adminDashboardService.js";
import { sendSuccess } from "@/utils/httpResponse.js";

export const adminDashboardController = {
  async getOverview(_request: Request, response: Response) {
    const overview = await adminDashboardService.getOverview();
    return sendSuccess(response, overview);
  },
};
