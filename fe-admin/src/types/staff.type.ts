import type { PaginationMeta } from "@/types/api.type";

export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "STAFF_ORDER"
  | "STAFF_CONTENT";

export type AccountStatus = "ACTIVE" | "LOCKED";

export type AdminUserItem = {
  id: string;
  code: string;
  fullName: string;
  name?: string; // alias for backwards compatibility
  email: string;
  phone?: string | null;
  avatar?: string | null;
  role: UserRole;
  roleName?: string;
  status: AccountStatus;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
  pw?: string;
  pwConfirm?: string;
};

export type AdminUserListResponse = {
  items: AdminUserItem[];
  pagination: PaginationMeta;
};

export type AdminUserListQueryDto = {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  status?: AccountStatus;
};

export type CreateAdminUserDto = {
  code?: string;
  email: string;
  pw?: string;
  pwConfirm?: string;
  password?: string;
  fullName: string;
  phone?: string | null;
  role?: "ADMIN" | "STAFF_ORDER" | "STAFF_CONTENT";
  status?: AccountStatus;
  avatar?: string | null;
};

export type UpdateAdminUserDto = {
  email?: string;
  fullName?: string;
  phone?: string | null;
  role?: "ADMIN" | "STAFF_ORDER" | "STAFF_CONTENT";
  status?: AccountStatus;
  avatar?: string | null;
};

export type UpdateAdminUserPasswordDto = {
  pw: string;
  pwConfirm: string;
};
