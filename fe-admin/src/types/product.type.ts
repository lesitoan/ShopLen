import type { PaginationMeta } from "@/types/api.type";

export type ProductStatus = "ACTIVE" | "HIDDEN" | "OUT_OF_STOCK";

export type AdminProductCategoryOption = {
  id: string;
  name: string;
  slug: string;
};

export type AdminProductThumbnail = {
  id: string;
  url: string;
  altText?: string | null;
};

export type AdminProductListItem = {
  id: string;
  code: string;
  name: string;
  slug: string;
  category: AdminProductCategoryOption;
  thumbnail: AdminProductThumbnail | null;
  originalPrice: number;
  salePrice?: number | null;
  price: number;
  stockQuantity: number;
  soldCount: number;
  status: ProductStatus;
  createdAt: string;
};

export type AdminProductListResponse = {
  items: AdminProductListItem[];
  pagination: PaginationMeta;
};

export type AdminProductSortOption =
  | "NEWEST"
  | "OLDEST"
  | "PRICE_DESC"
  | "PRICE_ASC"
  | "STOCK_DESC"
  | "STOCK_ASC";

export type AdminProductListQueryDto = {
  page?: number;
  limit?: number;
  search?: string;
  categoryIds?: string[];
  statuses?: ProductStatus[];
  sort?: AdminProductSortOption;
};
