import { Router } from "express";
import { paymentController } from "../controllers/paymentController.js";
import { webhookSignatureMiddleware } from "../middlewares/webhookSignatureMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const paymentRoutes = Router();

paymentRoutes.get("/:orderId/qr", asyncHandler(paymentController.createPaymentQr));
paymentRoutes.post(
  "/webhook",
  webhookSignatureMiddleware,
  asyncHandler(paymentController.handleWebhook),
);
