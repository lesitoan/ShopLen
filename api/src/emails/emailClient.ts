import { Resend } from "resend";
import { env } from "@/config/envValidation.js";
import { AppError } from "@/utils/appError.js";
import type { SendMailParams } from "@/types/email.type.js";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

export function hasEmailProvider() {
  return Boolean(resend);
}

export async function sendMail(params: SendMailParams) {
  if (!resend) {
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
    subject: params.subject,
    html: params.html,
    text: params.text,
  });

  if (error) {
    throw new AppError(
      "Không thể gửi email xác nhận.",
      500,
      "EMAIL_SEND_FAILED",
      error.message,
    );
  }
}
