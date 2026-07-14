import { Router } from "express";
import { loyaltyController } from "../controllers/loyaltyController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const loyaltyRoutes = Router();

loyaltyRoutes.get(
  "/users/:userId/points",
  authMiddleware,
  asyncHandler(loyaltyController.getCustomerPoints),
);
