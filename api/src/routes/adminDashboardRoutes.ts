import { Router } from "express";
import { adminDashboardController } from "../controllers/adminDashboardController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/roleMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const adminDashboardRoutes = Router();

adminDashboardRoutes.use(authMiddleware, requireAdmin);
adminDashboardRoutes.get("/overview", asyncHandler(adminDashboardController.getOverview));
