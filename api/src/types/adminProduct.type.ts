import type { ProductStatus } from "@prisma/client";
import type { PaginationMeta } from "@/utils/httpResponse.js";

export type AdminProductListItem = {
  id: string;
  code: string;
  name: string;
  slug: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  thumbnail: {
    id: string;
    url: string;
    altText?: string | null;
  } | null;
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
