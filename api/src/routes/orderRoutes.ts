import { Router } from "express";
import { orderController } from "../controllers/orderController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const orderRoutes = Router();

orderRoutes.post("/", asyncHandler(orderController.createOrder));
orderRoutes.get("/:id", asyncHandler(orderController.getOrderDetail));
orderRoutes.post("/:id/confirmPayment", asyncHandler(orderController.confirmPayment));
