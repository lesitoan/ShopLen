import { Router } from "express";
import { adminOrderController } from "@/controllers/admin/adminOrderController.js";
import { adminAuthMiddleware } from "@/middlewares/adminAuthMiddleware.js";
import { requireAdmin } from "@/middlewares/roleMiddleware.js";
import { asyncHandler } from "@/utils/asyncHandler.js";

export const adminOrderRoutes = Router();

adminOrderRoutes.use(asyncHandler(adminAuthMiddleware), requireAdmin);
adminOrderRoutes.get("/:id", asyncHandler(adminOrderController.getOrderDetail));
adminOrderRoutes.post("/:id/confirmPayment", asyncHandler(adminOrderController.confirmPayment));
