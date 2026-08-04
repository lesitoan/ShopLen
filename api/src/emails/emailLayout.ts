import { SITE_INFO } from "@/constants/siteInfo.js";
import { escapeHtml } from "@/emails/htmlEscape.js";
import type { EmailLayoutParams } from "@/types/email.type.js";

export function renderEmailLayout(params: EmailLayoutParams) {
  const title = escapeHtml(params.title);
  const shopName = escapeHtml(SITE_INFO.shopName);
  const previewText = params.previewText
    ? `<div style="display:none;max-height:0;overflow:hidden;color:transparent;">${escapeHtml(params.previewText)}</div>`
    : "";

  return `
    <!doctype html>
    <html lang="vi">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${title}</title>
      </head>
      <body style="margin:0;background:#f6f2ea;font-family:Arial,sans-serif;color:#1f2937;">
        ${previewText}
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f2ea;padding:24px 12px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #eadfce;border-radius:12px;overflow:hidden;">
                <tr>
                  <td style="padding:24px 28px 8px;">
                    <div style="font-size:14px;font-weight:700;color:#9a5b38;">${shopName}</div>
                    <h1 style="margin:12px 0 0;color:#111827;font-size:22px;line-height:1.35;">${title}</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 28px 28px;font-size:15px;line-height:1.7;">
                    ${params.contentHtml}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}
