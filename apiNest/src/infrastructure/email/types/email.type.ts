export type EmailTemplateResult = {
  subject: string;
  html: string;
  text?: string;
};

export type EmailLayoutParams = {
  title: string;
  previewText?: string;
  contentHtml: string;
};

export type SendMailParams = EmailTemplateResult & {
  to: string | string[];
};

export type PasswordResetOtpEmailParams = {
  otpCode: string;
  expiresInMinutes: number;
};

export type SendPasswordResetOtpEmailParams = PasswordResetOtpEmailParams & {
  to: string;
};

export type OrderPaidEmailParams = {
  orderCode: string;
  customerName: string;
  totalAmount: number;
  paidAt: Date;
  orderDetailUrl?: string;
};

export type SendOrderPaidEmailParams = OrderPaidEmailParams & {
  to: string;
};
