import { Router } from "express";
import { orderController } from "@/controllers/client/orderController.js";
import {
  cancelOrderDto,
  createOrderDto,
  getOrderDetailDto,
  listOrdersDto,
  lookupOrderDto,
  updateOrderShippingAddressDto,
} from "@/dto/client/orderDto.js";
import { customerAuthMiddleware } from "@/middlewares/authMiddleware.js";
import { orderLookupRateLimitMiddleware } from "@/middlewares/orderLookupRateLimitMiddleware.js";
import { validateMiddleware } from "@/middlewares/validateMiddleware.js";
import { asyncHandler } from "@/utils/asyncHandler.js";

export const orderRoutes = Router();

orderRoutes.post(
  "/lookup",
  orderLookupRateLimitMiddleware,
  validateMiddleware(lookupOrderDto),
  asyncHandler(orderController.lookupOrder),
);

orderRoutes.use(asyncHandler(customerAuthMiddleware));
orderRoutes.post(
  "/",
  validateMiddleware(createOrderDto),
  asyncHandler(orderController.createOrder),
);
orderRoutes.get(
  "/",
  validateMiddleware(listOrdersDto),
  asyncHandler(orderController.listOrders),
);
orderRoutes.get(
  "/:id",
  validateMiddleware(getOrderDetailDto),
  asyncHandler(orderController.getOrderDetail),
);
orderRoutes.post(
  "/:id/cancel",
  validateMiddleware(cancelOrderDto),
  asyncHandler(orderController.cancelOrder),
);
orderRoutes.patch(
  "/:id/shipping-address",
  validateMiddleware(updateOrderShippingAddressDto),
  asyncHandler(orderController.updateShippingAddress),
);
