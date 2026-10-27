import { Inject, Injectable } from "@nestjs/common";
import { Resend } from "resend";
import { EnvService } from "@/config/env.service.js";
import { LoggingService } from "@/infrastructure/logging/logging.service.js";
import { AppError } from "@/common/errors/appError.js";
import { renderPasswordResetOtpEmail } from "@/infrastructure/email/templates/passwordResetOtpEmail.js";
import type {
  SendPasswordResetOtpEmailParams,
  SendOrderPaidEmailParams,
} from "@/infrastructure/email/types/email.type.js";
import { renderOrderPaidEmail } from "@/infrastructure/email/templates/orderPaidEmail.js";

@Injectable()
export class EmailService {
  private client: Resend | undefined;

  constructor(
    @Inject(EnvService) private readonly config: EnvService,
    @Inject(LoggingService) private readonly logging: LoggingService,
  ) {}

  async sendPasswordResetOtpEmail(params: SendPasswordResetOtpEmailParams) {
    if (!this.config.values.RESEND_API_KEY) {
      if (this.config.values.NODE_ENV !== "production") {
        this.logging.logger.info(
          { to: params.to },
          "Password reset OTP generated in dev mode",
        );
        return;
      }
      throw new AppError(
        "Không thể gửi email xác nhận.",
        500,
        "EMAIL_SERVICE_NOT_CONFIGURED",
        "RESEND_API_KEY is missing.",
      );
    }
    this.client ??= new Resend(this.config.values.RESEND_API_KEY);
    const email = renderPasswordResetOtpEmail(params);
    const { error } = await this.client.emails.send({
      from: this.config.values.RESEND_FROM_EMAIL,
      to: params.to,
      ...email,
    });
    if (error)
      throw new AppError(
        "Không thể gửi email xác nhận.",
        500,
        "EMAIL_SEND_FAILED",
        error.message,
      );
  }

  async sendOrderPaidEmail(params: SendOrderPaidEmailParams) {
    if (!this.config.values.RESEND_API_KEY) {
      if (this.config.values.NODE_ENV !== "production") {
        this.logging.logger.info(
          { to: params.to, orderCode: params.orderCode },
          "Order paid email generated in dev mode",
        );
        return;
      }
      throw new AppError(
        "Không thể gửi email xác nhận.",
        500,
        "EMAIL_SERVICE_NOT_CONFIGURED",
        "RESEND_API_KEY is missing.",
      );
    }
    this.client ??= new Resend(this.config.values.RESEND_API_KEY);
    const email = renderOrderPaidEmail(params);
    const { error } = await this.client.emails.send({
      from: this.config.values.RESEND_FROM_EMAIL,
      to: params.to,
      ...email,
    });
    if (error)
      throw new AppError(
        "Không thể gửi email xác nhận.",
        500,
        "EMAIL_SEND_FAILED",
        error.message,
      );
  }
}
