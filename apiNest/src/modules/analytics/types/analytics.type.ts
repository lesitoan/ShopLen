export type DashboardSummary = {
  revenueToday: number;
  newOrdersToday: number;
  pendingPaymentOrders: number;
  newCustomersToday: number;
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

export type DashboardRevenueBucket = {
  label: string;
  start: Date;
  end: Date;
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

export type TopSellingProducts = {
  items: TopSellingProductItem[];
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

export type LowStockProducts = {
  threshold: number;
  total: number;
  items: LowStockProductItem[];
};
