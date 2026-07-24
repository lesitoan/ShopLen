import type { Request, Response } from "express";
import { paymentService } from "@/services/client/paymentService.js";
import { sendSuccess } from "@/utils/httpResponse.js";

export const paymentController = {
  async createPaymentQr(request: Request, response: Response) {
    const paymentQr = await paymentService.createPaymentQr(request.params.orderId);
    return sendSuccess(response, paymentQr);
  },
  async handleWebhook(_request: Request, response: Response) {
    const result = await paymentService.handleWebhook();
    return sendSuccess(response, result);
  },
};
