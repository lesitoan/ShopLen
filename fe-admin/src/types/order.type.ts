import type { PaginationMeta } from "@/types/api.type";

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "PACKING"
  | "SHIPPING"
  | "COMPLETED"
  | "CANCELLATION_REQUESTED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

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

export type AdminOrderListQueryDto = {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
  search?: string;
  sort?: "NEWEST" | "OLDEST" | "PRICE_DESC" | "PRICE_ASC";
};
