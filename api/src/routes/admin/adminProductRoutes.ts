import { UserRole } from "@prisma/client";
import { Router } from "express";
import { adminProductController } from "@/controllers/admin/adminProductController.js";
import {
  adminProductListQueryDto,
  adminProductParamsDto,
  createAdminProductDto,
  updateAdminProductDto,
} from "@/dto/admin/adminProductDto.js";
import { adminAuthMiddleware } from "@/middlewares/adminAuthMiddleware.js";
import { requireAdmin, roleMiddleware } from "@/middlewares/roleMiddleware.js";
import { validateMiddleware } from "@/middlewares/validateMiddleware.js";
import { asyncHandler } from "@/utils/asyncHandler.js";

export const adminProductRoutes = Router();

adminProductRoutes.use(asyncHandler(adminAuthMiddleware), requireAdmin);
adminProductRoutes.get(
  "/",
  roleMiddleware(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateMiddleware(adminProductListQueryDto),
  asyncHandler(adminProductController.listProducts),
);
adminProductRoutes.post(
  "/",
  roleMiddleware(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateMiddleware(createAdminProductDto),
  asyncHandler(adminProductController.createProduct),
);
adminProductRoutes.get(
  "/:id",
  roleMiddleware(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateMiddleware(adminProductParamsDto),
  asyncHandler(adminProductController.getProductDetail),
);
adminProductRoutes.patch(
  "/:id",
  roleMiddleware(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateMiddleware(updateAdminProductDto),
  asyncHandler(adminProductController.updateProduct),
);
adminProductRoutes.delete(
  "/:id",
  roleMiddleware(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateMiddleware(adminProductParamsDto),
  asyncHandler(adminProductController.deleteProduct),
);
