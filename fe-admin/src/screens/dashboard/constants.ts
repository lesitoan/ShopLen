export interface StatCardItem {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  type: "REVENUE" | "NEW_ORDERS" | "PENDING_PAYMENT" | "NEW_CUSTOMERS";
}

export interface RevenueDataPoint {
  label: string;
  revenue: number;
  orders: number;
}

export interface RecentOrderItem {
  id: string;
  orderCode: string;
  customerName: string;
  phone: string;
  totalAmount: number;
  itemsCount: number;
  status: "PENDING_PAYMENT" | "PAID" | "PACKING" | "SHIPPING" | "COMPLETED" | "CANCELLED";
  createdAt: string;
}

export interface TopProductItem {
  id: string;
  name: string;
  category: string;
  image: string;
  soldCount: number;
  revenue: number;
}

export interface LowStockProductItem {
  id: string;
  name: string;
  category: string;
  image: string;
  stockLeft: number;
  price: number;
}

export const MOCK_STAT_CARDS: StatCardItem[] = [
  {
    id: "stat_revenue",
    title: "Doanh thu hôm nay",
    value: "3.450.000đ",
    change: "+15.2%",
    isPositive: true,
    type: "REVENUE",
  },
  {
    id: "stat_new_orders",
    title: "Đơn hàng mới",
    value: "12 đơn",
    change: "+4 đơn",
    isPositive: true,
    type: "NEW_ORDERS",
  },
  {
    id: "stat_pending_payment",
    title: "Chờ VietQR đếm ngược",
    value: "5 đơn",
    change: "-2 đơn",
    isPositive: false,
    type: "PENDING_PAYMENT",
  },
  {
    id: "stat_new_customers",
    title: "Khách hàng mới",
    value: "8 khách",
    change: "+25%",
    isPositive: true,
    type: "NEW_CUSTOMERS",
  },
];

export const MOCK_REVENUE_BY_PERIOD: Record<string, RevenueDataPoint[]> = {
  TODAY: [
    { label: "08:00", revenue: 250000, orders: 1 },
    { label: "10:00", revenue: 680000, orders: 3 },
    { label: "12:00", revenue: 1200000, orders: 5 },
    { label: "14:00", revenue: 1850000, orders: 7 },
    { label: "16:00", revenue: 2600000, orders: 9 },
    { label: "18:00", revenue: 3100000, orders: 11 },
    { label: "20:00", revenue: 3450000, orders: 12 },
  ],
  LAST_7_DAYS: [
    { label: "T2", revenue: 2100000, orders: 8 },
    { label: "T3", revenue: 2800000, orders: 11 },
    { label: "T4", revenue: 1900000, orders: 7 },
    { label: "T5", revenue: 3400000, orders: 14 },
    { label: "T6", revenue: 4200000, orders: 16 },
    { label: "T7", revenue: 5100000, orders: 20 },
    { label: "CN", revenue: 3450000, orders: 12 },
  ],
  THIS_MONTH: [
    { label: "Tuần 1", revenue: 18500000, orders: 65 },
    { label: "Tuần 2", revenue: 22400000, orders: 82 },
    { label: "Tuần 3", revenue: 26100000, orders: 94 },
    { label: "Tuần 4", revenue: 19800000, orders: 71 },
  ],
  THIS_YEAR: [
    { label: "T1", revenue: 45000000, orders: 160 },
    { label: "T2", revenue: 52000000, orders: 190 },
    { label: "T3", revenue: 48000000, orders: 175 },
    { label: "T4", revenue: 61000000, orders: 220 },
    { label: "T5", revenue: 58000000, orders: 205 },
    { label: "T6", revenue: 72000000, orders: 260 },
    { label: "T7", revenue: 68000000, orders: 240 },
  ],
};

export const MOCK_RECENT_ORDERS: RecentOrderItem[] = [
  {
    id: "ord_001",
    orderCode: "TLK-88392",
    customerName: "Nguyễn Thu Hà",
    phone: "0982***123",
    totalAmount: 185000,
    itemsCount: 2,
    status: "PAID",
    createdAt: "10 phút trước",
  },
  {
    id: "ord_002",
    orderCode: "TLK-88391",
    customerName: "Trần Minh Khoa",
    phone: "0912***888",
    totalAmount: 320000,
    itemsCount: 4,
    status: "PENDING_PAYMENT",
    createdAt: "22 phút trước",
  },
  {
    id: "ord_003",
    orderCode: "TLK-88390",
    customerName: "Lê Ngọc Anh",
    phone: "0394***567",
    totalAmount: 120000,
    itemsCount: 1,
    status: "PACKING",
    createdAt: "1 giờ trước",
  },
  {
    id: "ord_004",
    orderCode: "TLK-88389",
    customerName: "Phạm Hải Yến",
    phone: "0977***999",
    totalAmount: 450000,
    itemsCount: 5,
    status: "SHIPPING",
    createdAt: "3 giờ trước",
  },
  {
    id: "ord_005",
    orderCode: "TLK-88388",
    customerName: "Đỗ Hoàng Long",
    phone: "0888***456",
    totalAmount: 260000,
    itemsCount: 3,
    status: "COMPLETED",
    createdAt: "5 giờ trước",
  },
  {
    id: "ord_006",
    orderCode: "TLK-88387",
    customerName: "Vũ Phương Thảo",
    phone: "0904***111",
    totalAmount: 95000,
    itemsCount: 1,
    status: "CANCELLED",
    createdAt: "Hôm qua",
  },
  {
    id: "ord_007",
    orderCode: "TLK-88386",
    customerName: "Ngô Nhật Minh",
    phone: "0966***222",
    totalAmount: 210000,
    itemsCount: 2,
    status: "PAID",
    createdAt: "Hôm qua",
  },
  {
    id: "ord_008",
    orderCode: "TLK-88385",
    customerName: "Đặng Khánh Linh",
    phone: "0933***777",
    totalAmount: 380000,
    itemsCount: 4,
    status: "COMPLETED",
    createdAt: "2 ngày trước",
  },
];

export const MOCK_TOP_PRODUCTS: TopProductItem[] = [
  {
    id: "prod_01",
    name: "Móc Khóa Len Hoa Hướng Dương",
    category: "Hoa Len",
    image: "/images/products/sunflower.jpg",
    soldCount: 142,
    revenue: 7100000,
  },
  {
    id: "prod_02",
    name: "Móc Khóa Thỏ Mập Kèm Dâu Tây",
    category: "Động Vật",
    image: "/images/products/bunny.jpg",
    soldCount: 118,
    revenue: 9440000,
  },
  {
    id: "prod_03",
    name: "Móc Khóa Len Bơ Xanh Xinh Xắn",
    category: "Quả Len",
    image: "/images/products/avocado.jpg",
    soldCount: 95,
    revenue: 4750000,
  },
  {
    id: "prod_04",
    name: "Móc Khóa Gấu Pooh Handmade",
    category: "Động Vật",
    image: "/images/products/pooh.jpg",
    soldCount: 84,
    revenue: 7140000,
  },
  {
    id: "prod_05",
    name: "Hoa Tulips Len Quà Sinh Nhật",
    category: "Hoa Len",
    image: "/images/products/tulip.jpg",
    soldCount: 76,
    revenue: 5320000,
  },
];

export const MOCK_LOW_STOCK_PRODUCTS: LowStockProductItem[] = [
  {
    id: "prod_06",
    name: "Móc Khóa Mèo May Mắn Maneki",
    category: "Động Vật",
    image: "/images/products/cat.jpg",
    stockLeft: 2,
    price: 85000,
  },
  {
    id: "prod_07",
    name: "Hoa Cẩm Chướng Len Đỏ",
    category: "Hoa Len",
    image: "/images/products/carnation.jpg",
    stockLeft: 3,
    price: 65000,
  },
  {
    id: "prod_08",
    name: "Móc Khóa Cáo Cam Nhỏ",
    category: "Động Vật",
    image: "/images/products/fox.jpg",
    stockLeft: 4,
    price: 75000,
  },
];
