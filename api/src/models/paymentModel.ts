export type PaymentStatus = "pending" | "paid" | "failed" | "expired";

export type PaymentModel = {
  id: string;
  orderId: string;
  amount: number;
  bankCode?: string;
  transactionCode?: string;
  paymentStatus: PaymentStatus;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};
