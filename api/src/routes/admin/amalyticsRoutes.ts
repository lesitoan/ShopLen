import { UserRole } from "@prisma/client";
import { Router } from "express";
import { amalyticsController } from "@/controllers/admin/amalyticsController.js";
import { dashboardRevenueQueryDto } from "@/dto/admin/amalyticsDto.js";
import { adminAuthMiddleware } from "@/middlewares/adminAuthMiddleware.js";
import { roleMiddleware } from "@/middlewares/roleMiddleware.js";
import { validateMiddleware } from "@/middlewares/validateMiddleware.js";
import { asyncHandler } from "@/utils/asyncHandler.js";

export const amalyticsRoutes = Router();

amalyticsRoutes.get(
  "/dashboard/summary",
  asyncHandler(adminAuthMiddleware),
  roleMiddleware(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  asyncHandler(amalyticsController.getDashboardSummary),
);

amalyticsRoutes.get(
  "/dashboard/revenue",
  asyncHandler(adminAuthMiddleware),
  roleMiddleware(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateMiddleware(dashboardRevenueQueryDto),
  asyncHandler(amalyticsController.getDashboardRevenue),
);
