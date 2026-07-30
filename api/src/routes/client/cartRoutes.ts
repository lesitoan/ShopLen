import { Router } from "express";
import { cartController } from "@/controllers/client/cartController.js";
import { cartProductListDto } from "@/dto/client/cartDto.js";
import { validateMiddleware } from "@/middlewares/validateMiddleware.js";
import { asyncHandler } from "@/utils/asyncHandler.js";

export const cartRoutes = Router();

cartRoutes.post(
  "/products",
  validateMiddleware(cartProductListDto),
  asyncHandler(cartController.listCartProducts),
);
