import { SITE_INFO } from "@/constants/siteInfo.js";
import { renderEmailLayout } from "@/emails/emailLayout.js";
import type {
  EmailTemplateResult,
  OrderPaidEmailParams,
} from "@/types/email.type.js";
import { formatCurrency } from "@/utils/formatCurrency.js";
import { formatDateTime } from "@/utils/formatDateTime.js";
import { escapeHtml } from "@/utils/htmlEscape.js";

function renderOrderDetailLink(orderDetailUrl?: string) {
  if (!orderDetailUrl) {
    return "";
  }

  const escapedUrl = escapeHtml(orderDetailUrl);

  return `
    <p style="margin:20px 0 0;">Bạn có thể xem chi tiết đơn hàng tại:</p>
    <p style="margin:12px 0 0;">
      <a href="${escapedUrl}" style="display:inline-block;padding:12px 18px;border-radius:8px;background:#9a5b38;color:#ffffff;text-decoration:none;font-weight:700;">
        Xem chi tiết đơn hàng
      </a>
    </p>
    <p style="margin:12px 0 0;color:#6b7280;font-size:13px;">${escapedUrl}</p>
  `;
}

export function renderOrderPaidEmail(
  params: OrderPaidEmailParams,
): EmailTemplateResult {
  const subject = `Thanh toán thành công đơn hàng ${params.orderCode}`;
  const shopName = escapeHtml(SITE_INFO.shopName);
  const orderCode = escapeHtml(params.orderCode);
  const customerName = escapeHtml(params.customerName);
  const paidAt = escapeHtml(formatDateTime(params.paidAt));
  const totalAmount = escapeHtml(formatCurrency(params.totalAmount));

  return {
    subject,
    html: renderEmailLayout({
      title: "Thanh toán thành công",
      previewText: `Đơn hàng ${params.orderCode} tại ${SITE_INFO.shopName} đã được thanh toán thành công.`,
      contentHtml: `
        <p style="margin:0 0 16px;">Xin chào ${customerName},</p>
        <p style="margin:0 0 16px;">${shopName} đã nhận được thanh toán cho đơn hàng <strong>${orderCode}</strong>. Shop sẽ sớm chuẩn bị và cập nhật trạng thái giao hàng cho bạn.</p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:20px 0;border-collapse:collapse;">
          <tr>
            <td style="padding:10px 0;color:#6b7280;">Mã đơn hàng</td>
            <td align="right" style="padding:10px 0;font-weight:700;color:#111827;">${orderCode}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;color:#6b7280;border-top:1px solid #f1f0ec;">Thời gian thanh toán</td>
            <td align="right" style="padding:10px 0;font-weight:700;color:#111827;border-top:1px solid #f1f0ec;">${paidAt}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;color:#6b7280;border-top:1px solid #f1f0ec;">Tổng thanh toán</td>
            <td align="right" style="padding:10px 0;font-size:18px;font-weight:700;color:#9a5b38;border-top:1px solid #f1f0ec;">${totalAmount}</td>
          </tr>
        </table>
        ${renderOrderDetailLink(params.orderDetailUrl)}
        <p style="margin:20px 0 0;color:#6b7280;">Cảm ơn bạn đã ủng hộ ${shopName}.</p>
      `,
    }),
    text: `Đơn hàng ${params.orderCode} đã thanh toán thành công. Tổng thanh toán: ${formatCurrency(params.totalAmount)}.${
      params.orderDetailUrl
        ? ` Xem chi tiết đơn hàng tại ${params.orderDetailUrl}.`
        : ""
    } Cảm ơn bạn đã ủng hộ ${SITE_INFO.shopName}.`,
  };
}
