import { Router } from "express";
import { paymentController } from "@/controllers/client/paymentController.js";
import { asyncHandler } from "@/utils/asyncHandler.js";

export const paymentRoutes = Router();

paymentRoutes.get("/:orderId/qr", asyncHandler(paymentController.createPaymentQr));
paymentRoutes.post("/sepay/webhook", asyncHandler(paymentController.handleSepayWebhook));
