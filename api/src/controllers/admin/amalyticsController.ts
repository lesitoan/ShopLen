import type { Request, Response } from "express";
import type {
  DashboardRevenueQueryDto,
  LowStockProductsQueryDto,
  TopSellingProductsQueryDto,
} from "@/dto/admin/amalyticsDto.js";
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

  async getTopSellingProducts(request: Request, response: Response) {
    const query = request.query as unknown as TopSellingProductsQueryDto;
    const topProducts = await amalyticsService.getTopSellingProducts(query);
    return sendSuccess(response, topProducts);
  },

  async getLowStockProducts(request: Request, response: Response) {
    const query = request.query as unknown as LowStockProductsQueryDto;
    const lowStockProducts = await amalyticsService.getLowStockProducts(query);
    return sendSuccess(response, lowStockProducts);
  },
};
