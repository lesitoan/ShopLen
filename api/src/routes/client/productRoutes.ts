import { Router } from "express";
import { productController } from "@/controllers/client/productController.js";
import { asyncHandler } from "@/utils/asyncHandler.js";

export const productRoutes = Router();

productRoutes.get("/", asyncHandler(productController.listProducts));
productRoutes.get("/:id", asyncHandler(productController.getProductDetail));
