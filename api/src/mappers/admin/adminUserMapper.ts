import type { AdminUserItem, AdminUserRecord } from "@/types/adminUser.type.js";

function toIsoString(date: Date | null) {
  return date ? date.toISOString() : null;
}

export function toAdminUserItem(user: AdminUserRecord): AdminUserItem {
  return {
    id: user.id,
    code: user.code,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
    role: user.role,
    status: user.status,
    lastLoginAt: toIsoString(user.lastLoginAt),
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
