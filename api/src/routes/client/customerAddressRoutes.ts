import { Router } from "express";
import {
  createCustomerAddressDto,
  deleteCustomerAddressDto,
  updateCustomerAddressDto,
} from "@/dto/client/customerAddressDto.js";
import { customerAddressController } from "@/controllers/client/customerAddressController.js";
import { customerAuthMiddleware } from "@/middlewares/authMiddleware.js";
import { validateMiddleware } from "@/middlewares/validateMiddleware.js";
import { asyncHandler } from "@/utils/asyncHandler.js";

export const customerAddressRoutes = Router();

customerAddressRoutes.use(asyncHandler(customerAuthMiddleware));
customerAddressRoutes.get(
  "/",
  asyncHandler(customerAddressController.listAddresses),
);
customerAddressRoutes.post(
  "/",
  validateMiddleware(createCustomerAddressDto),
  asyncHandler(customerAddressController.createAddress),
);
customerAddressRoutes.patch(
  "/:id",
  validateMiddleware(updateCustomerAddressDto),
  asyncHandler(customerAddressController.updateAddress),
);
customerAddressRoutes.delete(
  "/:id",
  validateMiddleware(deleteCustomerAddressDto),
  asyncHandler(customerAddressController.deleteAddress),
);
