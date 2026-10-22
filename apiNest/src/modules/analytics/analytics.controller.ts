import { Controller, Get, Inject, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "@/modules/auth/guards/adminAuth.guard.js";
import { RolesGuard } from "@/modules/auth/guards/roles.guard.js";
import { Roles } from "@/modules/auth/decorators/roles.decorator.js";
import { ValidatedRequest } from "@/common/decorators/validatedRequest.decorator.js";
import { successResponse } from "@/common/responses/httpResponse.js";
import { AnalyticsService } from "@/modules/analytics/analytics.service.js";
import { dashboardRevenueQueryDto, topSellingProductsQueryDto, lowStockProductsQueryDto, type DashboardRevenueQueryDto, type TopSellingProductsQueryDto, type LowStockProductsQueryDto } from "@/modules/analytics/dto/analytics.dto.js";

@Controller("admin/amalytics/dashboard")
@UseGuards(AdminAuthGuard, RolesGuard)
@Roles("SUPER_ADMIN", "ADMIN")
export class AnalyticsController {
  constructor(@Inject(AnalyticsService) private readonly service: AnalyticsService) {}

  @Get("summary")
  async summary() { return successResponse(await this.service.getDashboardSummary()); }

  @Get("revenue")
  async revenue(@ValidatedRequest(dashboardRevenueQueryDto) input: { query: DashboardRevenueQueryDto }) {
    return successResponse(await this.service.getDashboardRevenue(input.query));
  }

  @Get("top-products")
  async topProducts(@ValidatedRequest(topSellingProductsQueryDto) input: { query: TopSellingProductsQueryDto }) {
    return successResponse(await this.service.getTopSellingProducts(input.query));
  }

  @Get("low-stock")
  async lowStock(@ValidatedRequest(lowStockProductsQueryDto) input: { query: LowStockProductsQueryDto }) {
    return successResponse(await this.service.getLowStockProducts(input.query));
  }
}

@Controller("admin/dashboard")
@UseGuards(AdminAuthGuard)
export class DashboardController {
  @Get("overview")
  overview() { return successResponse({ revenueToday: 0, orderToday: 0, pendingOrder: 0 }); }
}
