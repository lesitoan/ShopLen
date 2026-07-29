export interface ProductThumbnail {
  id: string;
  url: string;
  altText?: string | null;
}

export interface ProductCategoryRef {
  id: string;
  name: string;
  slug: string;
}

export interface ProductDetailImage {
  id: string;
  url: string;
  altText?: string | null;
  displayOrder: number;
  isThumbnail: boolean;
}

export interface ProductOptionValue {
  label: string;
  value: string;
  code?: string;
  hex?: string;
  priceAdjustment?: number;
}

export interface ProductOption {
  id: string;
  optionType: "COLOR" | "CUSTOM";
  name: string;
  displayOrder: number;
  values: ProductOptionValue[];
}

export interface ProductDetail {
  id: string;
  code?: string;
  name: string;
  slug: string;
  shortDescription?: string | null;
  descriptionHtml?: string | null;
  careInstructionHtml?: string | null;
  category?: ProductCategoryRef | null;
  images: ProductDetailImage[];
  options: ProductOption[];
  originalPrice?: number;
  salePrice?: number | null;
  price: number;
  stockQuantity?: number;
  soldCount?: number;
  rating?: number;
  reviews?: number;
  highlightType?: "HOT_PRODUCT" | "TODAY_DEAL" | "HOT_TIKTOK" | null;
  highlightLabel?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
}

export interface ProductItem {
  id: string;
  code?: string;
  name: string;
  slug: string;
  shortDescription?: string | null;
  category?: ProductCategoryRef | null;
  thumbnail?: ProductThumbnail | null;
  image?: string;
  originalPrice?: number;
  salePrice?: number | null;
  price: number;
  stockQuantity?: number;
  soldCount?: number;
  rating?: number;
  reviews?: number;
  badge?: string;
  badgeLabel?: string;
  highlightType?: "HOT_PRODUCT" | "TODAY_DEAL" | "HOT_TIKTOK" | null;
  highlightLabel?: string | null;
}

export interface ProductListParams {
  page?: number;
  limit?: number;
  sort?: "NEWEST" | "PRICE_ASC" | "PRICE_DESC" | "BEST_SELLING";
  categoryIds?: string[];
  categorySlug?: string;
  colorCodes?: string[];
  search?: string;
  highlightType?: "HOT_PRODUCT" | "TODAY_DEAL" | "HOT_TIKTOK";
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductListResponse {
  items: ProductItem[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}
