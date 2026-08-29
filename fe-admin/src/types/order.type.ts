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

export type UpdateAdminOrderStatusDto = {
  orderStatus: OrderStatus;
  cancelReason?: string;
  adminNotes?: string;
};

export type AdminOrderDetail = {
  id: string;
  orderCode: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  shippingAddress: string;
  shippingProvince?: string | null;
  shippingDistrict?: string | null;
  shippingWard?: string | null;
  customerNote?: string | null;
  adminNotes?: string | null;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  pointsDiscount: number;
  totalAmount: number;
  usedPoints: number;
  earnedPoints: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  expiresAt: string;
  paidAt?: string | null;
  cancelledAt?: string | null;
  cancelReason?: string | null;
  cancellationRequestedAt?: string | null;
  cancellationRequestedFrom?: OrderStatus | null;
  cancellationRequestReason?: string | null;
  shippingUnit?: string | null;
  trackingCode?: string | null;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: string;
    code: string;
    fullName: string;
    email: string;
    phone?: string | null;
  };
  items: Array<{
    id: string;
    productId?: string | null;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    productSnapshot: any;
    createdAt: string;
  }>;
  payments: Array<{
    id: string;
    provider: string;
    method: string;
    bankName: string;
    bankBin: string;
    accountNo: string;
    accountName: string;
    amount: number;
    transferContent: string;
    qrImageUrl?: string | null;
    transactionRef?: string | null;
    isMatched: boolean;
    status: PaymentStatus;
    paidAt?: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
};
