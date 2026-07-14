import { Router } from "express";
import { adminOrderController } from "../controllers/adminOrderController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/roleMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const adminOrderRoutes = Router();

adminOrderRoutes.use(authMiddleware, requireAdmin);
adminOrderRoutes.get("/:id", asyncHandler(adminOrderController.getOrderDetail));
adminOrderRoutes.post("/:id/confirmPayment", asyncHandler(adminOrderController.confirmPayment));
