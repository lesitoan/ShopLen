import type {
  OrderStatus,
  PaymentMethod,
  PaymentProvider,
  PaymentStatus,
  Prisma,
} from "@prisma/client";
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
  paymentMethod: PaymentMethod;
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
    productSnapshot: Prisma.JsonValue;
    createdAt: string;
  }>;
  payments: Array<{
    id: string;
    provider: PaymentProvider;
    method: PaymentMethod;
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

export type AdminOrderDetailRecord = {
  id: string;
  orderCode: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  shippingAddress: string;
  shippingProvince: string | null;
  shippingDistrict: string | null;
  shippingWard: string | null;
  customerNote: string | null;
  adminNotes: string | null;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  pointsDiscount: number;
  totalAmount: number;
  usedPoints: number;
  earnedPoints: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  expiresAt: Date;
  paidAt: Date | null;
  cancelledAt: Date | null;
  cancelReason: string | null;
  cancellationRequestedAt: Date | null;
  cancellationRequestedFrom: OrderStatus | null;
  cancellationRequestReason: string | null;
  shippingUnit: string | null;
  trackingCode: string | null;
  createdAt: Date;
  updatedAt: Date;
  customer: {
    id: string;
    code: string;
    fullName: string;
    email: string;
    phone: string | null;
  };
  items: Array<{
    id: string;
    productId: string | null;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    productSnapshot: Prisma.JsonValue;
    createdAt: Date;
  }>;
  payments: Array<{
    id: string;
    provider: PaymentProvider;
    method: PaymentMethod;
    bankName: string;
    bankBin: string;
    accountNo: string;
    accountName: string;
    amount: number;
    transferContent: string;
    qrImageUrl: string | null;
    transactionRef: string | null;
    isMatched: boolean;
    status: PaymentStatus;
    paidAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }>;
};
