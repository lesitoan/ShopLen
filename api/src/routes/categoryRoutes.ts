import { Router } from "express";
import { categoryController } from "../controllers/categoryController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const categoryRoutes = Router();

categoryRoutes.get("/", asyncHandler(categoryController.listCategories));
