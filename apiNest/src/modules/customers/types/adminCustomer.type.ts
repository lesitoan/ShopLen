import type { AccountStatus, GenderType } from "@prisma/client";
import type { OrderStatus, PaymentStatus } from "@prisma/client";

export type CustomerOrderSummary = {
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
import type { PaginationMeta } from "@/common/types/httpResponse.type.js";

export type AdminCustomerListItem = {
  id: string;
  code: string;
  fullName: string;
  email: string;
  phone?: string | null;
  gender?: GenderType | null;
  birthday?: string | null;
  avatar?: string | null;
  status: AccountStatus;
  emailVerified: boolean;
  isManualLogin: boolean;
  isGoogleLogin: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminCustomerListResponse = {
  items: AdminCustomerListItem[];
  pagination: PaginationMeta;
};

export type AdminCustomerDetail = AdminCustomerListItem & {
  orders: CustomerOrderSummary[];
};

export type AdminCustomerRecord = {
  id: string;
  code: string;
  fullName: string;
  email: string;
  phone: string | null;
  gender: GenderType | null;
  birthday: Date | null;
  avatar: string | null;
  status: AccountStatus;
  emailVerified: boolean;
  isManualLogin: boolean;
  isGoogleLogin: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminCustomerDetailRecord = AdminCustomerRecord & {
  orders: Array<{
    id: string;
    orderCode: string;
    customerName: string;
    customerPhone: string;
    totalAmount: number;
    paymentStatus: PaymentStatus;
    orderStatus: OrderStatus;
    createdAt: Date;
    _count: {
      items: number;
    };
  }>;
};
