import type { CustomerSession } from "@/types/clientAuth.type.js";
import type { AdminSession } from "@/types/adminAuth.type.js";

declare global {
  namespace Express {
    interface Request {
      adminUser?: AdminSession;
      adminUserId?: string;
      customer?: CustomerSession;
      customerId?: string;
      rawBody?: string;
    }
  }
}

export {};
