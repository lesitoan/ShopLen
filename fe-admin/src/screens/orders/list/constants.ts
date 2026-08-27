import { OrderStatus } from "@/constants/orders";

export type OrderStatusFilter = "ALL" | OrderStatus;
export type OrderSortOption = "NEWEST" | "OLDEST" | "PRICE_DESC" | "PRICE_ASC";

export interface OrderFilterState {
  status: OrderStatusFilter;
  search: string;
  startDate: string;
  endDate: string;
  sort: OrderSortOption;
  page: number;
  limit: number;
}

export const DEFAULT_ORDER_FILTERS: OrderFilterState = {
  status: "ALL",
  search: "",
  startDate: "",
  endDate: "",
  sort: "NEWEST",
  page: 1,
  limit: 20,
};
