export type DashboardSummary = {
  revenueToday: number;
  newOrdersToday: number;
  pendingPaymentOrders: number;
  newCustomersToday: number;
};

export type DashboardRevenueQueryDto = {
  startDate: string;
  endDate: string;
};

export type DashboardRevenuePoint = {
  label: string;
  revenue: number;
  orders: number;
};

export type DashboardRevenue = {
  startDate: string;
  endDate: string;
  points: DashboardRevenuePoint[];
};

export type TopSellingProductItem = {
  rank: number;
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
  soldCount: number;
  revenue: number;
};

export type TopSellingProductsResponse = {
  items: TopSellingProductItem[];
};

export type TopSellingProductsQueryDto = {
  limit?: number;
  startDate?: string;
  endDate?: string;
};

export type LowStockProductItem = {
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
  stockLeft: number;
  price: number;
  originalPrice: number;
  salePrice?: number | null;
};

export type LowStockProductsResponse = {
  threshold: number;
  total: number;
  items: LowStockProductItem[];
};

export type LowStockProductsQueryDto = {
  threshold?: number;
  limit?: number;
};
