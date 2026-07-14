import { Router } from "express";
import { blogController } from "../controllers/blogController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const blogRoutes = Router();

blogRoutes.get("/", asyncHandler(blogController.listPosts));
blogRoutes.get("/:slug", asyncHandler(blogController.getPostDetail));
