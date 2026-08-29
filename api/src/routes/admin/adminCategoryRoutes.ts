import { UserRole } from "@prisma/client";
import { Router } from "express";
import { adminCategoryController } from "@/controllers/admin/adminCategoryController.js";
import {
  adminCategoryListQueryDto,
  adminCategoryParamsDto,
  createAdminCategoryDto,
  updateAdminCategoryDto,
} from "@/dto/admin/adminCategoryDto.js";
import { adminAuthMiddleware } from "@/middlewares/adminAuthMiddleware.js";
import { requireAdmin, roleMiddleware } from "@/middlewares/roleMiddleware.js";
import { validateMiddleware } from "@/middlewares/validateMiddleware.js";
import { asyncHandler } from "@/utils/asyncHandler.js";

export const adminCategoryRoutes = Router();

adminCategoryRoutes.use(asyncHandler(adminAuthMiddleware), requireAdmin);
adminCategoryRoutes.use(roleMiddleware(UserRole.SUPER_ADMIN, UserRole.ADMIN));

adminCategoryRoutes.get(
  "/",
  validateMiddleware(adminCategoryListQueryDto),
  asyncHandler(adminCategoryController.listCategories),
);
adminCategoryRoutes.post(
  "/",
  validateMiddleware(createAdminCategoryDto),
  asyncHandler(adminCategoryController.createCategory),
);
adminCategoryRoutes.get(
  "/:id",
  validateMiddleware(adminCategoryParamsDto),
  asyncHandler(adminCategoryController.getCategoryDetail),
);
adminCategoryRoutes.patch(
  "/:id",
  validateMiddleware(updateAdminCategoryDto),
  asyncHandler(adminCategoryController.updateCategory),
);
adminCategoryRoutes.delete(
  "/:id",
  validateMiddleware(adminCategoryParamsDto),
  asyncHandler(adminCategoryController.deleteCategory),
);
