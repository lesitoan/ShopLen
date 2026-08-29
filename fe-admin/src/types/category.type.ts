import type { PaginationMeta } from "@/types/api.type";

export type CategoryStatus = "ACTIVE" | "HIDDEN";

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

export type AdminCategoryListResponse = {
  items: AdminCategoryItem[];
  pagination: PaginationMeta;
};

export type AdminCategorySortOption =
  | "NEWEST"
  | "OLDEST"
  | "NAME_ASC"
  | "NAME_DESC";

export type AdminCategoryListQueryDto = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: AdminCategorySortOption;
};

export type CreateAdminCategoryDto = {
  name: string;
  slug: string;
  image?: string | null;
};

export type UpdateAdminCategoryDto = {
  name?: string;
  slug?: string;
  image?: string | null;
};
