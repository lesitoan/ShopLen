import type {
  AdminCategorySortOption,
} from "@/types/category.type";

export interface CategoryFilterState {
  search: string;
  sort: AdminCategorySortOption;
  page: number;
  limit: number;
}

export const DEFAULT_CATEGORY_FILTERS: CategoryFilterState = {
  search: "",
  sort: "NEWEST",
  page: 1,
  limit: 10,
};
