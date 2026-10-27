import type { Request } from "express";
import type { CustomerSession } from "@/modules/auth/types/clientAuth.type.js";
import type { AdminSession } from "@/modules/auth/types/adminAuth.type.js";

export type AuthenticatedRequest = Request & {
  customerId?: string;
  customer?: CustomerSession;
  adminUserId?: string;
  adminUser?: AdminSession;
};
