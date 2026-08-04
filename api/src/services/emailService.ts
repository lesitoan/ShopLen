import { env } from "@/config/envValidation.js";
import { logger } from "@/config/logger.js";
import { hasEmailProvider, sendMail } from "@/emails/emailClient.js";
import { renderPasswordResetOtpEmail } from "@/emails/templates/passwordResetOtpEmail.js";
import type { SendPasswordResetOtpEmailParams } from "@/types/email.type.js";

function isDevMode() {
  return env.NODE_ENV === "development" || env.NODE_ENV === "test";
}

export const emailService = {
  async sendPasswordResetOtpEmail(params: SendPasswordResetOtpEmailParams) {
    if (!hasEmailProvider() && isDevMode()) {
      logger.info(
        { to: params.to, otpCode: params.otpCode },
        "Password reset OTP generated in dev mode",
      );
      return;
    }

    const email = renderPasswordResetOtpEmail({
      otpCode: params.otpCode,
      expiresInMinutes: params.expiresInMinutes,
    });

    await sendMail({
      to: params.to,
      ...email,
    });
  },
};
