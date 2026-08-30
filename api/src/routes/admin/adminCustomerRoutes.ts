import { UserRole } from "@prisma/client";
import { Router } from "express";
import { adminCustomerController } from "@/controllers/admin/adminCustomerController.js";
import {
  adminCustomerListQueryDto,
  adminCustomerParamsDto,
  updateAdminCustomerStatusDto,
} from "@/dto/admin/adminCustomerDto.js";
import { adminAuthMiddleware } from "@/middlewares/adminAuthMiddleware.js";
import { requireAdmin, roleMiddleware } from "@/middlewares/roleMiddleware.js";
import { validateMiddleware } from "@/middlewares/validateMiddleware.js";
import { asyncHandler } from "@/utils/asyncHandler.js";

export const adminCustomerRoutes = Router();

adminCustomerRoutes.use(asyncHandler(adminAuthMiddleware), requireAdmin);
adminCustomerRoutes.get(
  "/",
  roleMiddleware(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateMiddleware(adminCustomerListQueryDto),
  asyncHandler(adminCustomerController.listCustomers),
);
adminCustomerRoutes.get(
  "/:id",
  roleMiddleware(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF_ORDER),
  validateMiddleware(adminCustomerParamsDto),
  asyncHandler(adminCustomerController.getCustomerDetail),
);
adminCustomerRoutes.patch(
  "/:id/status",
  roleMiddleware(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateMiddleware(updateAdminCustomerStatusDto),
  asyncHandler(adminCustomerController.updateCustomerStatus),
);
