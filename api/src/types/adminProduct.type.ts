import type {
  Prisma,
  ProductHighlightType,
  ProductOptionType,
  ProductStatus,
} from "@prisma/client";
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
  highlightType?: ProductHighlightType | null;
  createdAt: string;
};

export type AdminProductListResponse = {
  items: AdminProductListItem[];
  pagination: PaginationMeta;
};

export type AdminProductRecord = {
  id: string;
  code: string;
  name: string;
  slug: string;
  originalPrice: number;
  salePrice: number | null;
  stockQuantity: number;
  soldCount: number;
  status: ProductStatus;
  highlightType: ProductHighlightType | null;
  createdAt: Date;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  images: Array<{
    id: string;
    url: string;
    altText: string | null;
  }>;
};

export type AdminProductDetail = {
  id: string;
  code: string;
  name: string;
  slug: string;
  shortDescription?: string | null;
  descriptionHtml?: string | null;
  careInstructionHtml?: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  images: Array<{
    id: string;
    url: string;
    publicId?: string | null;
    altText?: string | null;
    displayOrder: number;
    isThumbnail: boolean;
  }>;
  options: Array<{
    id: string;
    optionType: ProductOptionType;
    name: string;
    displayOrder: number;
    values: Prisma.JsonValue;
  }>;
  originalPrice: number;
  salePrice?: number | null;
  price: number;
  stockQuantity: number;
  soldCount: number;
  status: ProductStatus;
  highlightType?: ProductHighlightType | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminProductDetailRecord = {
  id: string;
  code: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  descriptionHtml: string | null;
  careInstructionHtml: string | null;
  originalPrice: number;
  salePrice: number | null;
  stockQuantity: number;
  soldCount: number;
  status: ProductStatus;
  highlightType: ProductHighlightType | null;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  images: Array<{
    id: string;
    url: string;
    publicId: string | null;
    altText: string | null;
    displayOrder: number;
    isThumbnail: boolean;
  }>;
  options: Array<{
    id: string;
    optionType: ProductOptionType;
    name: string;
    displayOrder: number;
    values: Prisma.JsonValue;
  }>;
};
