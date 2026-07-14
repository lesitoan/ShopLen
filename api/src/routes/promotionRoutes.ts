import { Router } from "express";
import { promotionController } from "../controllers/promotionController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const promotionRoutes = Router();

promotionRoutes.get("/", asyncHandler(promotionController.listPromotions));
promotionRoutes.post("/validate", asyncHandler(promotionController.validatePromotion));
