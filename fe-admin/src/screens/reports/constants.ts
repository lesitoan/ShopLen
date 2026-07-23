export type AnalyticsPeriod = "LAST_7_DAYS" | "LAST_30_DAYS" | "LAST_3_MONTHS" | "LAST_12_MONTHS";

export interface RevenuePoint {
  label: string;
  current: number;
  previous: number;
  orders: number;
}

export interface TopProductStat {
  id: string;
  name: string;
  category: string;
  soldCount: number;
  revenue: number;
  percentage: number;
}

export interface TopCategoryStat {
  id: string;
  name: string;
  soldCount: number;
  revenue: number;
  percentage: number;
  color: string;
}

export interface OrderStatusStat {
  status: string;
  label: string;
  count: number;
  percentage: number;
  color: string;
}

export interface TrafficSourceStat {
  source: string;
  label: string;
  orders: number;
  revenue: number;
  percentage: number;
  color: string;
}

export interface SummaryCard {
  id: string;
  title: string;
  value: string;
  rawValue: number;
  previousValue: number;
  change: string;
  changePercent: number;
  isPositive: boolean;
  unit: string;
}

export const PERIOD_OPTIONS: { key: AnalyticsPeriod; label: string }[] = [
  { key: "LAST_7_DAYS", label: "7 ngày qua" },
  { key: "LAST_30_DAYS", label: "30 ngày qua" },
  { key: "LAST_3_MONTHS", label: "3 tháng qua" },
  { key: "LAST_12_MONTHS", label: "12 tháng qua" },
];

export const MOCK_SUMMARY_CARDS: SummaryCard[] = [
  {
    id: "card_revenue",
    title: "Tổng doanh thu",
    value: "86.750.000đ",
    rawValue: 86750000,
    previousValue: 74200000,
    change: "+12.550.000đ",
    changePercent: 16.9,
    isPositive: true,
    unit: "đ",
  },
  {
    id: "card_orders",
    title: "Tổng đơn hàng",
    value: "312 đơn",
    rawValue: 312,
    previousValue: 268,
    change: "+44 đơn",
    changePercent: 16.4,
    isPositive: true,
    unit: "đơn",
  },
  {
    id: "card_avg_order",
    title: "Giá trị đơn trung bình",
    value: "278.000đ",
    rawValue: 278000,
    previousValue: 276900,
    change: "+1.100đ",
    changePercent: 0.4,
    isPositive: true,
    unit: "đ",
  },
  {
    id: "card_cancel_rate",
    title: "Tỷ lệ hủy đơn",
    value: "4.8%",
    rawValue: 4.8,
    previousValue: 7.2,
    change: "-2.4%",
    changePercent: -33.3,
    isPositive: true,
    unit: "%",
  },
];

export const MOCK_REVENUE_DATA: Record<AnalyticsPeriod, RevenuePoint[]> = {
  LAST_7_DAYS: [
    { label: "T2", current: 2100000, previous: 1800000, orders: 8 },
    { label: "T3", current: 2800000, previous: 2200000, orders: 11 },
    { label: "T4", current: 1900000, previous: 2500000, orders: 7 },
    { label: "T5", current: 3400000, previous: 2900000, orders: 14 },
    { label: "T6", current: 4200000, previous: 3100000, orders: 16 },
    { label: "T7", current: 5100000, previous: 4200000, orders: 20 },
    { label: "CN", current: 3450000, previous: 3800000, orders: 12 },
  ],
  LAST_30_DAYS: [
    { label: "01/07", current: 2800000, previous: 2100000, orders: 11 },
    { label: "05/07", current: 3900000, previous: 3300000, orders: 14 },
    { label: "10/07", current: 4200000, previous: 3800000, orders: 16 },
    { label: "15/07", current: 5100000, previous: 4600000, orders: 20 },
    { label: "20/07", current: 4700000, previous: 5200000, orders: 18 },
    { label: "25/07", current: 6200000, previous: 5500000, orders: 24 },
    { label: "30/07", current: 5800000, previous: 4800000, orders: 22 },
  ],
  LAST_3_MONTHS: [
    { label: "Tháng 5", current: 24500000, previous: 20100000, orders: 88 },
    { label: "Tháng 6", current: 31200000, previous: 27400000, orders: 114 },
    { label: "Tháng 7", current: 31050000, previous: 26700000, orders: 110 },
  ],
  LAST_12_MONTHS: [
    { label: "T8/23", current: 18000000, previous: 14200000, orders: 65 },
    { label: "T9/23", current: 22000000, previous: 18500000, orders: 80 },
    { label: "T10/23", current: 19500000, previous: 16000000, orders: 70 },
    { label: "T11/23", current: 28000000, previous: 23000000, orders: 100 },
    { label: "T12/23", current: 35000000, previous: 29500000, orders: 128 },
    { label: "T1/24", current: 42000000, previous: 36000000, orders: 152 },
    { label: "T2/24", current: 38000000, previous: 31000000, orders: 138 },
    { label: "T3/24", current: 45000000, previous: 39000000, orders: 162 },
    { label: "T4/24", current: 51000000, previous: 44000000, orders: 184 },
    { label: "T5/24", current: 48500000, previous: 41500000, orders: 175 },
    { label: "T6/24", current: 62000000, previous: 53000000, orders: 224 },
    { label: "T7/24", current: 86750000, previous: 74200000, orders: 312 },
  ],
};

export const MOCK_TOP_PRODUCTS: TopProductStat[] = [
  {
    id: "p1",
    name: "Móc Khóa Len Hoa Hướng Dương",
    category: "Hoa Len",
    soldCount: 142,
    revenue: 7100000,
    percentage: 30,
  },
  {
    id: "p2",
    name: "Móc Khóa Thỏ Mập Kèm Dâu Tây",
    category: "Động Vật",
    soldCount: 118,
    revenue: 9440000,
    percentage: 25,
  },
  {
    id: "p3",
    name: "Móc Khóa Len Bơ Xanh Xinh Xắn",
    category: "Quả Len",
    soldCount: 95,
    revenue: 4750000,
    percentage: 20,
  },
  {
    id: "p4",
    name: "Móc Khóa Gấu Pooh Handmade",
    category: "Động Vật",
    soldCount: 84,
    revenue: 7140000,
    percentage: 18,
  },
  {
    id: "p5",
    name: "Hoa Tulips Len Quà Sinh Nhật",
    category: "Hoa Len",
    soldCount: 76,
    revenue: 5320000,
    percentage: 16,
  },
  {
    id: "p6",
    name: "Móc Khóa Mèo May Mắn Maneki",
    category: "Động Vật",
    soldCount: 65,
    revenue: 5525000,
    percentage: 14,
  },
  {
    id: "p7",
    name: "Hoa Cẩm Chướng Len Đỏ",
    category: "Hoa Len",
    soldCount: 52,
    revenue: 3380000,
    percentage: 11,
  },
  {
    id: "p8",
    name: "Móc Khóa Cáo Cam Nhỏ",
    category: "Động Vật",
    soldCount: 48,
    revenue: 3600000,
    percentage: 10,
  },
];

export const MOCK_TOP_CATEGORIES: TopCategoryStat[] = [
  { id: "c1", name: "Hoa Len", soldCount: 218, revenue: 12420000, percentage: 38, color: "#10B981" },
  { id: "c2", name: "Động Vật", soldCount: 202, revenue: 16580000, percentage: 35, color: "#60A5FA" },
  { id: "c3", name: "Quả Len", soldCount: 115, revenue: 5750000, percentage: 20, color: "#FBBF24" },
  { id: "c4", name: "Phụ Kiện Len", soldCount: 88, revenue: 4200000, percentage: 14, color: "#A855F7" },
  { id: "c5", name: "Búp Bê Len", soldCount: 64, revenue: 3800000, percentage: 12, color: "#EC4899" },
  { id: "c6", name: "Combo Quà Tặng", soldCount: 45, revenue: 2900000, percentage: 9, color: "#F97316" },
  { id: "c7", name: "Khác", soldCount: 41, revenue: 2050000, percentage: 7, color: "#94A3B8" },
];

export const MOCK_ORDER_STATUS: OrderStatusStat[] = [
  { status: "COMPLETED", label: "Hoàn tất", count: 248, percentage: 79.5, color: "#34D399" },
  { status: "CANCELLED", label: "Đã hủy", count: 15, percentage: 4.8, color: "#F87171" },
  { status: "SHIPPING", label: "Đang giao", count: 28, percentage: 9.0, color: "#60A5FA" },
  { status: "PACKING", label: "Đóng gói", count: 12, percentage: 3.8, color: "#FBBF24" },
  { status: "PENDING_PAYMENT", label: "Chờ thanh toán", count: 9, percentage: 2.9, color: "#94A3B8" },
];
