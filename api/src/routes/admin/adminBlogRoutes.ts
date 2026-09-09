import { UserRole } from "@prisma/client";
import { Router } from "express";
import { adminBlogController } from "@/controllers/admin/adminBlogController.js";
import {
  adminBlogPostListQueryDto,
  adminBlogPostParamsDto,
  createAdminBlogPostDto,
  updateAdminBlogPostDto,
  updateAdminBlogPostStatusDto,
  createAdminBlogTagDto,
  updateAdminBlogTagDto,
} from "@/dto/admin/adminBlogDto.js";
import { adminAuthMiddleware } from "@/middlewares/adminAuthMiddleware.js";
import { requireAdmin, roleMiddleware } from "@/middlewares/roleMiddleware.js";
import { validateMiddleware } from "@/middlewares/validateMiddleware.js";
import { asyncHandler } from "@/utils/asyncHandler.js";

export const adminBlogRoutes = Router();

adminBlogRoutes.use(asyncHandler(adminAuthMiddleware), requireAdmin);
adminBlogRoutes.use(
  roleMiddleware(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF_CONTENT)
);

adminBlogRoutes.get("/tags", asyncHandler(adminBlogController.listTags));
adminBlogRoutes.post(
  "/tags",
  validateMiddleware(createAdminBlogTagDto),
  asyncHandler(adminBlogController.createTag),
);
adminBlogRoutes.patch(
  "/tags/:id",
  validateMiddleware(updateAdminBlogTagDto),
  asyncHandler(adminBlogController.updateTag),
);
adminBlogRoutes.delete(
  "/tags/:id",
  validateMiddleware(adminBlogPostParamsDto),
  asyncHandler(adminBlogController.deleteTag),
);

adminBlogRoutes.get(
  "/posts",
  validateMiddleware(adminBlogPostListQueryDto),
  asyncHandler(adminBlogController.listPosts),
);
adminBlogRoutes.post(
  "/posts",
  validateMiddleware(createAdminBlogPostDto),
  asyncHandler(adminBlogController.createPost),
);
adminBlogRoutes.get(
  "/posts/:id",
  validateMiddleware(adminBlogPostParamsDto),
  asyncHandler(adminBlogController.getPostDetail),
);
adminBlogRoutes.patch(
  "/posts/:id",
  validateMiddleware(updateAdminBlogPostDto),
  asyncHandler(adminBlogController.updatePost),
);
adminBlogRoutes.patch(
  "/posts/:id/status",
  validateMiddleware(updateAdminBlogPostStatusDto),
  asyncHandler(adminBlogController.updateStatus),
);
adminBlogRoutes.delete(
  "/posts/:id",
  validateMiddleware(adminBlogPostParamsDto),
  asyncHandler(adminBlogController.deletePost),
);
