import { Resend } from "resend";
import { env } from "@/config/envValidation.js";
import { logger } from "@/config/logger.js";
import { AppError } from "@/utils/appError.js";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

function isDevMode() {
  return env.NODE_ENV === "development" || env.NODE_ENV === "test";
}

function buildPasswordResetOtpHtml(otpCode: string, expiresInMinutes: number) {
  return `
    <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
      <h2 style="margin: 0 0 16px; color: #111827;">Mã xác nhận đặt lại mật khẩu</h2>
      <p>Bạn vừa yêu cầu đặt lại mật khẩu tại Tiệm Len Nhà Kiều.</p>
      <p style="margin: 24px 0;">
        <span style="display: inline-block; padding: 12px 20px; border-radius: 8px; background: #f3f4f6; color: #111827; font-size: 24px; font-weight: 700; letter-spacing: 4px;">
          ${otpCode}
        </span>
      </p>
      <p>Mã này có hiệu lực trong ${expiresInMinutes} phút. Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.</p>
    </div>
  `;
}

export const emailService = {
  async sendPasswordResetOtpEmail(params: {
    to: string;
    otpCode: string;
    expiresInMinutes: number;
  }) {
    if (!resend) {
      if (isDevMode()) {
        logger.info(
          { to: params.to, otpCode: params.otpCode },
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

    const { error } = await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to: params.to,
      subject: "Mã xác nhận đặt lại mật khẩu",
      html: buildPasswordResetOtpHtml(params.otpCode, params.expiresInMinutes),
    });

    if (error) {
      throw new AppError(
        "Không thể gửi email xác nhận.",
        500,
        "EMAIL_SEND_FAILED",
        error.message,
      );
    }
  },
};
