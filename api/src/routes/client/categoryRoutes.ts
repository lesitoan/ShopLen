import { Router } from "express";
import { categoryController } from "@/controllers/client/categoryController.js";
import { asyncHandler } from "@/utils/asyncHandler.js";

export const categoryRoutes = Router();

categoryRoutes.get("/", asyncHandler(categoryController.listCategories));
