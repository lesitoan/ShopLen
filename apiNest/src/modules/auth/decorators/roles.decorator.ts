import { SetMetadata } from "@nestjs/common";
import type { UserRole } from "@prisma/client";

export const AUTH_ROLES = "shoplen:auth:roles";
export const Roles = (...roles: UserRole[]) => SetMetadata(AUTH_ROLES, roles);
