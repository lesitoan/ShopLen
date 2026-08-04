import { Router } from "express";
import { blogController } from "@/controllers/client/blogController.js";
import { blogPostListQueryDto } from "@/dto/client/blogDto.js";
import { validateMiddleware } from "@/middlewares/validateMiddleware.js";
import { asyncHandler } from "@/utils/asyncHandler.js";

export const blogRoutes = Router();

blogRoutes.get("/tags", asyncHandler(blogController.listTags));
blogRoutes.get(
  "/posts",
  validateMiddleware(blogPostListQueryDto),
  asyncHandler(blogController.listPosts),
);
blogRoutes.get("/posts/featured", asyncHandler(blogController.getFeaturedPost));
