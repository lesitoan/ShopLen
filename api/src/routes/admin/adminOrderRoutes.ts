import { UserRole } from "@prisma/client";
import { Router } from "express";
import { adminOrderController } from "@/controllers/admin/adminOrderController.js";
import { adminOrderListQueryDto } from "@/dto/admin/adminOrderDto.js";
import { adminAuthMiddleware } from "@/middlewares/adminAuthMiddleware.js";
import { requireAdmin, roleMiddleware } from "@/middlewares/roleMiddleware.js";
import { validateMiddleware } from "@/middlewares/validateMiddleware.js";
import { asyncHandler } from "@/utils/asyncHandler.js";

export const adminOrderRoutes = Router();

adminOrderRoutes.use(asyncHandler(adminAuthMiddleware), requireAdmin);
adminOrderRoutes.get(
  "/",
  roleMiddleware(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF_ORDER),
  validateMiddleware(adminOrderListQueryDto),
  asyncHandler(adminOrderController.listOrders),
);
adminOrderRoutes.get("/:id", asyncHandler(adminOrderController.getOrderDetail));
adminOrderRoutes.post("/:id/confirmPayment", asyncHandler(adminOrderController.confirmPayment));
