import type { OrderStatus } from "@/constants/orderStatus.js";

export type OrderModel = {
  id: string;
  orderCode: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  orderStatus: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
};
