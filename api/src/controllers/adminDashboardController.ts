import type { Request, Response } from "express";
import { sendSuccess } from "../utils/httpResponse.js";

export const adminDashboardController = {
  async getOverview(_request: Request, response: Response) {
    return sendSuccess(response, {
      revenueToday: 0,
      orderToday: 0,
      pendingOrder: 0,
    });
  },
};
