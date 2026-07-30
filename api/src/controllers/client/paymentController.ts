import type { Request, Response } from "express";
import { sepayWebhookDto } from "@/dto/client/paymentDto.js";
import { paymentService } from "@/services/client/paymentService.js";
import { AppError } from "@/utils/appError.js";
import { sendSuccess } from "@/utils/httpResponse.js";

export const paymentController = {
  async createPaymentQr(request: Request, response: Response) {
    const paymentQr = await paymentService.createPaymentQr(request.params.orderId);
    return sendSuccess(response, paymentQr);
  },
  async handleSepayWebhook(request: Request, response: Response) {
    paymentService.verifySepaySignature({
      signature: request.header("x-sepay-signature"),
      timestamp: request.header("x-sepay-timestamp"),
      rawBody: request.rawBody,
    });

    const parseResult = sepayWebhookDto.safeParse(request.body);

    if (!parseResult.success) {
      throw new AppError(
        "Payload webhook SePay không hợp lệ.",
        400,
        "SEPAY_WEBHOOK_PAYLOAD_INVALID",
        parseResult.error.message,
      );
    }

    const payload = parseResult.data;
    await paymentService.handleSepayWebhook(payload);

    return response.json({ success: true });
  },
};
