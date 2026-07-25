import { Router } from "express";
import { orderController } from "@/controllers/client/orderController.js";
import { customerAuthMiddleware } from "@/middlewares/authMiddleware.js";
import { asyncHandler } from "@/utils/asyncHandler.js";

export const orderRoutes = Router();

orderRoutes.use(asyncHandler(customerAuthMiddleware));
orderRoutes.post("/", asyncHandler(orderController.createOrder));
orderRoutes.get("/:id", asyncHandler(orderController.getOrderDetail));
