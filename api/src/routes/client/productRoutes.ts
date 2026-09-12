import { Router } from "express";
import { productController } from "@/controllers/client/productController.js";
import {
  productListQueryDto,
  productSlugParamDto,
  homeProductSectionsQueryDto,
} from "@/dto/client/productDto.js";
import { validateMiddleware } from "@/middlewares/validateMiddleware.js";
import { asyncHandler } from "@/utils/asyncHandler.js";

export const productRoutes = Router();

productRoutes.get(
  "/home",
  validateMiddleware(homeProductSectionsQueryDto),
  asyncHandler(productController.listHomeProductSections),
);
productRoutes.get(
  "/",
  validateMiddleware(productListQueryDto),
  asyncHandler(productController.listProducts),
);
productRoutes.get(
  "/:slug",
  validateMiddleware(productSlugParamDto),
  asyncHandler(productController.getProductDetailBySlug),
);
