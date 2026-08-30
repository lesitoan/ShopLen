import type { PaginationMeta } from "@/types/api.type";
import type { AdminOrderListItem } from "@/types/order.type";

export type CustomerStatus = "ACTIVE" | "LOCKED";

export type GenderType = "MALE" | "FEMALE" | "OTHER";

export type CustomerLoginProvider = "MANUAL" | "GOOGLE";

export type AdminCustomerListItem = {
  id: string;
  code: string;
  fullName: string;
  name?: string;
  email: string;
  phone?: string | null;
  gender?: GenderType | null;
  birthday?: string | null;
  avatar?: string | null;
  status: CustomerStatus;
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

export type AdminCustomerListQueryDto = {
  page?: number;
  limit?: number;
  search?: string;
  status?: CustomerStatus;
};

export type UpdateAdminCustomerStatusDto = {
  status: CustomerStatus;
};
