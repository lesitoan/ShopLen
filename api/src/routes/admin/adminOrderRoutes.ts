import { UserRole } from "@prisma/client";
import { Router } from "express";
import { adminOrderController } from "@/controllers/admin/adminOrderController.js";
import {
  adminOrderListQueryDto,
  adminOrderParamsDto,
  updateAdminOrderStatusDto,
} from "@/dto/admin/adminOrderDto.js";
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
adminOrderRoutes.get(
  "/:id",
  roleMiddleware(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF_ORDER),
  validateMiddleware(adminOrderParamsDto),
  asyncHandler(adminOrderController.getOrderDetail),
);
adminOrderRoutes.patch(
  "/:id/status",
  roleMiddleware(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF_ORDER),
  validateMiddleware(updateAdminOrderStatusDto),
  asyncHandler(adminOrderController.updateOrderStatus),
);
adminOrderRoutes.post(
  "/:id/confirm-payment",
  roleMiddleware(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF_ORDER),
  validateMiddleware(adminOrderParamsDto),
  asyncHandler(adminOrderController.confirmPayment),
);
adminOrderRoutes.post(
  "/:id/confirmPayment",
  roleMiddleware(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF_ORDER),
  validateMiddleware(adminOrderParamsDto),
  asyncHandler(adminOrderController.confirmPayment),
);
