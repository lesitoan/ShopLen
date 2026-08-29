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

export type ProductHighlightType = "HOT_PRODUCT" | "TODAY_DEAL" | "HOT_TIKTOK";

export type ProductOptionType = "COLOR" | "SIZE";

export type ProductOptionValueItem = {
  code: string;
  label: string;
  colorHex?: string | null;
  priceDiff?: number;
  isDefault?: boolean;
};

export type ProductOptionItem = {
  optionType: ProductOptionType;
  name: string;
  displayOrder?: number;
  values: ProductOptionValueItem[];
};

export type CreateProductImageInput = {
  url: string;
  publicId?: string | null;
  altText?: string | null;
  displayOrder?: number;
  isThumbnail?: boolean;
};

export type CreateAdminProductDto = {
  name: string;
  slug: string;
  categoryId: string;
  originalPrice: number;
  salePrice?: number | null;
  stockQuantity: number;
  status: ProductStatus;
  highlightType?: ProductHighlightType | null;
  shortDescription?: string | null;
  descriptionHtml?: string | null;
  careInstructionHtml?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  images: CreateProductImageInput[] | { url: string; isThumbnail?: boolean }[];
  options?: ProductOptionItem[];
};

export type UpdateAdminProductDto = {
  name?: string;
  slug?: string;
  categoryId?: string;
  originalPrice?: number;
  salePrice?: number | null;
  stockQuantity?: number;
  status?: ProductStatus;
  highlightType?: ProductHighlightType | null;
  shortDescription?: string | null;
  descriptionHtml?: string | null;
  careInstructionHtml?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  images?: CreateProductImageInput[] | { url: string; isThumbnail?: boolean }[];
  options?: ProductOptionItem[];
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
    values: ProductOptionValueItem[];
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
