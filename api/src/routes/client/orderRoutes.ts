import { Router } from "express";
import { orderController } from "@/controllers/client/orderController.js";
import { createOrderDto } from "@/dto/client/orderDto.js";
import { customerAuthMiddleware } from "@/middlewares/authMiddleware.js";
import { validateMiddleware } from "@/middlewares/validateMiddleware.js";
import { asyncHandler } from "@/utils/asyncHandler.js";

export const orderRoutes = Router();

orderRoutes.use(asyncHandler(customerAuthMiddleware));
orderRoutes.post(
  "/",
  validateMiddleware(createOrderDto),
  asyncHandler(orderController.createOrder),
);
orderRoutes.get("/:id", asyncHandler(orderController.getOrderDetail));
