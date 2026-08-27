import { ProductStatus, AdminProductSortOption, AdminProductListItem } from "@/types/product.type";

export type { ProductStatus, AdminProductListItem as ProductListItem };

export interface ProductFilterState {
  search: string;
  categoryIds: string[];
  statuses: ProductStatus[];
  sort: AdminProductSortOption;
  page: number;
  limit: number;
}

export const DEFAULT_PRODUCT_FILTERS: ProductFilterState = {
  search: "",
  categoryIds: [],
  statuses: [],
  sort: "NEWEST",
  page: 1,
  limit: 10,
};

export interface ProductCategoryOption {
  id: string;
  name: string;
}

export const MOCK_CATEGORIES: ProductCategoryOption[] = [
  { id: "CAT-KEYCHAIN", name: "Móc khóa len" },
  { id: "CAT-FLOWER", name: "Hoa len bó & lẻ" },
  { id: "CAT-GIFT", name: "Hộp quà sinh nhật" },
  { id: "CAT-ACCESSORY", name: "Phụ kiện len" },
];
