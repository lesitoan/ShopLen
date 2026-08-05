import { SITE_INFO } from "@/constants/siteInfo.js";
import { renderEmailLayout } from "@/emails/emailLayout.js";
import type {
  EmailTemplateResult,
  PasswordResetOtpEmailParams,
} from "@/types/email.type.js";
import { escapeHtml } from "@/utils/htmlEscape.js";

export function renderPasswordResetOtpEmail(
  params: PasswordResetOtpEmailParams,
): EmailTemplateResult {
  const otpCode = escapeHtml(params.otpCode);
  const expiresInMinutes = escapeHtml(params.expiresInMinutes);
  const shopName = escapeHtml(SITE_INFO.shopName);
  const subject = "Mã xác nhận đặt lại mật khẩu";

  return {
    subject,
    html: renderEmailLayout({
      title: subject,
      previewText: `Mã xác nhận đặt lại mật khẩu tại ${SITE_INFO.shopName}.`,
      contentHtml: `
        <p style="margin:0 0 16px;">Bạn vừa yêu cầu đặt lại mật khẩu tại ${shopName}.</p>
        <p style="margin:24px 0;">
          <span style="display:inline-block;padding:12px 20px;border-radius:8px;background:#f3f4f6;color:#111827;font-size:24px;font-weight:700;letter-spacing:4px;">
            ${otpCode}
          </span>
        </p>
        <p style="margin:0;">Mã này có hiệu lực trong ${expiresInMinutes} phút. Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.</p>
      `,
    }),
    text: `Mã xác nhận đặt lại mật khẩu của bạn là ${params.otpCode}. Mã này có hiệu lực trong ${params.expiresInMinutes} phút.`,
  };
}
