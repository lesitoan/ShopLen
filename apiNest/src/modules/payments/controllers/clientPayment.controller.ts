import { Controller, Get, HttpCode, Inject, Param, Post, Req, type RawBodyRequest } from "@nestjs/common";
import type { Request } from "express";
import { ClientPaymentService } from "@/modules/payments/services/clientPayment.service.js";
import { sepayWebhookDto } from "@/modules/payments/dto/clientPayment.dto.js";
import { AppError } from "@/common/errors/appError.js";
import { successResponse } from "@/common/responses/httpResponse.js";

@Controller("payments")
export class ClientPaymentController {
  constructor(@Inject(ClientPaymentService) private readonly service: ClientPaymentService) {}

  @Get(":orderId/qr")
  async qr(@Param("orderId") orderId: string) {
    return successResponse(await this.service.createPaymentQr(orderId));
  }

  @Post("sepay/webhook")
  @HttpCode(200)
  async webhook(@Req() request: RawBodyRequest<Request>) {
    this.service.verifySepaySignature({ signature: request.header("x-sepay-signature"), timestamp: request.header("x-sepay-timestamp"), rawBody: request.rawBody?.toString("utf8") });
    const result = sepayWebhookDto.safeParse(request.body);
    if (!result.success) throw new AppError("Payload webhook SePay không hợp lệ.", 400, "SEPAY_WEBHOOK_PAYLOAD_INVALID", result.error.message);
    await this.service.handleSepayWebhook(result.data);
    return { success: true };
  }
}
