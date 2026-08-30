import { UserRole } from "@prisma/client";
import { Router } from "express";
import { adminUserController } from "@/controllers/admin/adminUserController.js";
import {
  adminUserListQueryDto,
  adminUserParamsDto,
  createAdminUserDto,
  updateAdminUserDto,
  updateAdminUserPasswordDto,
} from "@/dto/admin/adminUserDto.js";
import { adminAuthMiddleware } from "@/middlewares/adminAuthMiddleware.js";
import { requireAdmin, roleMiddleware } from "@/middlewares/roleMiddleware.js";
import { validateMiddleware } from "@/middlewares/validateMiddleware.js";
import { asyncHandler } from "@/utils/asyncHandler.js";

export const adminUserRoutes = Router();

adminUserRoutes.use(asyncHandler(adminAuthMiddleware), requireAdmin);
adminUserRoutes.use(roleMiddleware(UserRole.SUPER_ADMIN, UserRole.ADMIN));
adminUserRoutes.get(
  "/",
  validateMiddleware(adminUserListQueryDto),
  asyncHandler(adminUserController.listUsers),
);
adminUserRoutes.post(
  "/",
  validateMiddleware(createAdminUserDto),
  asyncHandler(adminUserController.createUser),
);
adminUserRoutes.get(
  "/:id",
  validateMiddleware(adminUserParamsDto),
  asyncHandler(adminUserController.getUserDetail),
);
adminUserRoutes.patch(
  "/:id",
  validateMiddleware(updateAdminUserDto),
  asyncHandler(adminUserController.updateUser),
);
adminUserRoutes.patch(
  "/:id/password",
  validateMiddleware(updateAdminUserPasswordDto),
  asyncHandler(adminUserController.updateUserPassword),
);
adminUserRoutes.delete(
  "/:id",
  validateMiddleware(adminUserParamsDto),
  asyncHandler(adminUserController.deleteUser),
);
