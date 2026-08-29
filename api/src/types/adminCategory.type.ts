import type { CategoryStatus } from "@prisma/client";
import type { PaginationMeta } from "@/utils/httpResponse.js";

export type AdminCategoryItem = {
  id: string;
  code: string;
  name: string;
  slug: string;
  image?: string | null;
  status: CategoryStatus;
  createdAt: string;
  updatedAt: string;
};

export type AdminCategoryRecord = Omit<
  AdminCategoryItem,
  "createdAt" | "updatedAt"
> & {
  createdAt: Date;
  updatedAt: Date;
};

export type AdminCategoryListResponse = {
  items: AdminCategoryItem[];
  pagination: PaginationMeta;
};
