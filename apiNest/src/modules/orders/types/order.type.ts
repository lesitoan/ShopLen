import type { Prisma } from "@prisma/client";

export type ProductOptionValue = {
  code?: string;
  label?: string;
  colorHex?: string;
  isDefault?: boolean;
};

export type ProductDelegateClient = Pick<Prisma.TransactionClient, "product">;
