export interface PaymentQrResponseData {
  orderId: string;
  orderCode: string;
  amount: number;
  transferContent: string;
  bankCode: string;
  accountNo: string;
  accountName: string;
  qrImageUrl: string;
  paymentStatus: "PENDING" | "PAID" | "MISMATCHED" | "CANCELLED" | string;
  orderStatus: string;
  createdAt?: string;
  expiresAt?: string | null;
}
