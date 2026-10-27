import type { User } from "@prisma/client";
import type { AdminSession } from "@/modules/auth/types/adminAuth.type.js";
export function toAdminSession(user: User): AdminSession {
  return {
    id: user.id,
    code: user.code,
    fullName: user.fullName,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    status: user.status,
  };
}
