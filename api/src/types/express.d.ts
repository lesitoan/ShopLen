import type { CustomerSession } from "@/types/clientAuth.type.js";

declare global {
  namespace Express {
    interface Request {
      customer?: CustomerSession;
      customerId?: string;
    }
  }
}

export {};
