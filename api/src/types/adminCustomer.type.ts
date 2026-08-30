import type { AccountStatus, GenderType } from "@prisma/client";
import type { AdminOrderListItem } from "@/types/adminOrder.type.js";
import type { PaginationMeta } from "@/utils/httpResponse.js";

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
  orders: AdminOrderListItem[];
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
    paymentStatus: AdminOrderListItem["paymentStatus"];
    orderStatus: AdminOrderListItem["orderStatus"];
    createdAt: Date;
    _count: {
      items: number;
    };
  }>;
};
