import type { OrderStatus, PaymentStatus } from "@prisma/client";
import type { PaginationMeta } from "@/utils/httpResponse.js";

export type AdminOrderListItem = {
  id: string;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  itemsCount: number;
};

export type AdminOrderListResponse = {
  items: AdminOrderListItem[];
  pagination: PaginationMeta;
};
