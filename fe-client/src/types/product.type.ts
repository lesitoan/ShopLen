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
}

export interface ProductListParams {
  page?: number;
  limit?: number;
  sort?: "NEWEST" | "PRICE_ASC" | "PRICE_DESC" | "BEST_SELLING";
  categoryId?: string;
  categorySlug?: string;
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
