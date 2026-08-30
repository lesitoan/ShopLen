import type { AccountStatus, UserRole } from "@prisma/client";
import type { PaginationMeta } from "@/utils/httpResponse.js";

export type AdminUserItem = {
  id: string;
  code: string;
  fullName: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  role: UserRole;
  status: AccountStatus;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminUserListResponse = {
  items: AdminUserItem[];
  pagination: PaginationMeta;
};

export type AdminUserRecord = {
  id: string;
  code: string;
  fullName: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: UserRole;
  status: AccountStatus;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
