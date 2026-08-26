import type { Request, Response } from "express";
import type { DashboardRevenueQueryDto } from "@/dto/admin/amalyticsDto.js";
import { amalyticsService } from "@/services/admin/amalyticsService.js";
import { sendSuccess } from "@/utils/httpResponse.js";

export const amalyticsController = {
  async getDashboardSummary(_request: Request, response: Response) {
    const summary = await amalyticsService.getDashboardSummary();
    return sendSuccess(response, summary);
  },

  async getDashboardRevenue(request: Request, response: Response) {
    const query = request.query as DashboardRevenueQueryDto;
    const revenue = await amalyticsService.getDashboardRevenue(query);
    return sendSuccess(response, revenue);
  },
};
