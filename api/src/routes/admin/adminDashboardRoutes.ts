import { Router } from "express";
import { adminDashboardController } from "@/controllers/admin/adminDashboardController.js";
import { adminAuthMiddleware } from "@/middlewares/adminAuthMiddleware.js";
import { requireAdmin } from "@/middlewares/roleMiddleware.js";
import { asyncHandler } from "@/utils/asyncHandler.js";

export const adminDashboardRoutes = Router();

adminDashboardRoutes.use(asyncHandler(adminAuthMiddleware), requireAdmin);
adminDashboardRoutes.get("/overview", asyncHandler(adminDashboardController.getOverview));
