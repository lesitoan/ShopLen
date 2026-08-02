import { UserProfile, OrderSummary, AddressItem, ProfileTab, OrderStatus } from "./types";

export const TAB_SLUG_MAP: Record<ProfileTab, string> = {
  PROFILE: "thong-tin",
  ORDERS: "don-hang",
  ADDRESSES: "dia-chi",
  CHANGE_PASSWORD: "doi-mat-khau",
};

export const SLUG_TO_TAB_MAP: Record<string, ProfileTab> = {
  "thong-tin": "PROFILE",
  "don-hang": "ORDERS",
  "dia-chi": "ADDRESSES",
  "doi-mat-khau": "CHANGE_PASSWORD",
};

export interface OrderStatusConfig {
  label: string;
  badgeStyle: string;
  cardBgStyle: string;
}

export const ORDER_STATUS_CONFIG_MAP: Record<OrderStatus, OrderStatusConfig> = {
  ALL: {
    label: "Tất cả",
    badgeStyle: "",
    cardBgStyle: "bg-gradient-to-b from-surface via-surface/95 to-background/40 dark:from-surface dark:via-surface/95 dark:to-background/60 border-border/80 hover:border-primary/40",
  },
  PENDING_PAYMENT: {
    label: "Chờ thanh toán",
    badgeStyle: "bg-gradient-to-r from-amber-50 to-orange-50/80 dark:from-amber-950/60 dark:to-orange-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/50",
    cardBgStyle: "bg-gradient-to-b from-amber-50/70 via-amber-50/20 to-surface dark:from-amber-950/35 dark:via-amber-950/10 dark:to-surface border-amber-200/80 dark:border-amber-800/50 hover:border-amber-300 dark:hover:border-amber-700",
  },
  PENDING: {
    label: "Chờ xác nhận",
    badgeStyle: "bg-gradient-to-r from-purple-50 to-indigo-50/80 dark:from-purple-950/60 dark:to-indigo-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/50",
    cardBgStyle: "bg-gradient-to-b from-purple-50/60 via-indigo-50/20 to-surface dark:from-purple-950/35 dark:via-indigo-950/10 dark:to-surface border-purple-200/80 dark:border-purple-800/50 hover:border-purple-300 dark:hover:border-purple-700",
  },
  PAID: {
    label: "Chờ xác nhận",
    badgeStyle: "bg-gradient-to-r from-purple-50 to-indigo-50/80 dark:from-purple-950/60 dark:to-indigo-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/50",
    cardBgStyle: "bg-gradient-to-b from-purple-50/60 via-indigo-50/20 to-surface dark:from-purple-950/35 dark:via-indigo-950/10 dark:to-surface border-purple-200/80 dark:border-purple-800/50 hover:border-purple-300 dark:hover:border-purple-700",
  },
  PACKING: {
    label: "Đang chuẩn bị hàng",
    badgeStyle: "bg-gradient-to-r from-violet-50 to-purple-50/80 dark:from-violet-950/60 dark:to-purple-950/40 text-violet-700 dark:text-violet-300 border border-violet-200/80 dark:border-violet-800/50",
    cardBgStyle: "bg-gradient-to-b from-violet-50/60 via-purple-50/20 to-surface dark:from-violet-950/35 dark:via-purple-950/10 dark:to-surface border-violet-200/80 dark:border-violet-800/50 hover:border-violet-300 dark:hover:border-violet-700",
  },
  SHIPPING: {
    label: "Đang vận chuyển",
    badgeStyle: "bg-gradient-to-r from-blue-50 to-indigo-50/80 dark:from-blue-950/60 dark:to-indigo-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/50",
    cardBgStyle: "bg-gradient-to-b from-blue-50/70 via-indigo-50/20 to-surface dark:from-blue-950/35 dark:via-indigo-950/10 dark:to-surface border-blue-200/80 dark:border-blue-800/50 hover:border-blue-300 dark:hover:border-blue-700",
  },
  COMPLETED: {
    label: "Hoàn thành",
    badgeStyle: "bg-gradient-to-r from-emerald-50 to-teal-50/80 dark:from-emerald-950/60 dark:to-teal-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/50",
    cardBgStyle: "bg-gradient-to-b from-emerald-50/70 via-emerald-50/20 to-surface dark:from-emerald-950/35 dark:via-emerald-950/10 dark:to-surface border-emerald-200/80 dark:border-emerald-800/50 hover:border-emerald-300 dark:hover:border-emerald-700",
  },
  DELIVERED: {
    label: "Đã giao hàng",
    badgeStyle: "bg-gradient-to-r from-emerald-50 to-teal-50/80 dark:from-emerald-950/60 dark:to-teal-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/50",
    cardBgStyle: "bg-gradient-to-b from-emerald-50/70 via-emerald-50/20 to-surface dark:from-emerald-950/35 dark:via-emerald-950/10 dark:to-surface border-emerald-200/80 dark:border-emerald-800/50 hover:border-emerald-300 dark:hover:border-emerald-700",
  },
  CANCELLATION_REQUESTED: {
    label: "Yêu cầu hủy đơn",
    badgeStyle: "bg-gradient-to-r from-orange-50 to-amber-50/80 dark:from-orange-950/60 dark:to-amber-950/40 text-orange-700 dark:text-orange-300 border border-orange-200/80 dark:border-orange-800/50",
    cardBgStyle: "bg-gradient-to-b from-orange-50/40 via-orange-50/10 to-surface dark:from-orange-950/25 dark:via-orange-950/10 dark:to-surface border-orange-200/60 dark:border-orange-900/30 hover:border-orange-300 dark:hover:border-orange-800",
  },
  CANCELLED: {
    label: "Đã hủy",
    badgeStyle: "bg-gradient-to-r from-rose-50 to-pink-50/80 dark:from-rose-950/60 dark:to-pink-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/50",
    cardBgStyle: "bg-gradient-to-b from-rose-50/40 via-rose-50/10 to-surface dark:from-rose-950/25 dark:via-rose-950/10 dark:to-surface border-rose-200/60 dark:border-rose-900/30 hover:border-rose-300 dark:hover:border-rose-800",
  },
};

export const ORDER_FILTER_TABS: { id: OrderStatus; label: string }[] = [
  { id: "ALL", label: "Tất cả" },
  { id: "PENDING_PAYMENT", label: "Chờ thanh toán" },
  { id: "PENDING", label: "Chờ xác nhận" },
  { id: "PACKING", label: "Chuẩn bị hàng" },
  { id: "SHIPPING", label: "Đang giao" },
  { id: "DELIVERED", label: "Đã giao" },
  { id: "CANCELLATION_REQUESTED", label: "Chờ hủy" },
  { id: "CANCELLED", label: "Đã hủy" },
];

export const DEMO_USER: UserProfile = {
  id: "USR-2026-8888",
  fullName: "Nguyễn Thị Ngọc Kiều",
  email: "demo@gmail.com",
  phone: "0987 654 321",
  gender: "Nữ",
  birthday: "15/08/2000",
  avatar: "/logo.png",
};

export const MOCK_ORDERS: OrderSummary[] = [
  {
    id: "ord-101",
    orderCode: "ORD-88231",
    createdAt: "20/07/2026 14:30",
    status: "DELIVERED",
    statusLabel: "Đã giao hàng",
    totalAmount: 319000,
    shippingFee: 0,
    paymentMethod: "QR Bank (VietQR)",
    items: [
      {
        id: 1,
        name: "Gấu len Momo handmade",
        price: 319000,
        quantity: 1,
        image: "/images/products/moc-khoa-gau.png",
        category: "Móc khóa len",
      },
    ],
  },
  {
    id: "ord-102",
    orderCode: "ORD-77192",
    createdAt: "15/07/2026 09:15",
    status: "SHIPPING",
    statusLabel: "Đang vận chuyển",
    totalAmount: 458000,
    shippingFee: 0,
    paymentMethod: "QR Bank (VietQR)",
    items: [
      {
        id: 2,
        name: "Túi len hoa cúc nhỏ nhắn",
        price: 269000,
        quantity: 1,
        image: "/images/products/tui-hoa-cuc.png",
        category: "Túi len",
      },
      {
        id: 3,
        name: "Mũ len tai thỏ mộng mơ",
        price: 189000,
        quantity: 1,
        image: "/images/products/gau-bong-tho.png",
        category: "Phụ kiện len",
      },
    ],
  },
  {
    id: "ord-103",
    orderCode: "ORD-66104",
    createdAt: "02/07/2026 18:45",
    status: "DELIVERED",
    statusLabel: "Đã giao hàng",
    totalAmount: 289000,
    shippingFee: 30000,
    paymentMethod: "QR Bank (VietQR)",
    items: [
      {
        id: 4,
        name: "Bình hoa tulip len handmade",
        price: 289000,
        quantity: 1,
        image: "/images/products/binh-hoa-tulip.png",
        category: "Hoa len decor",
      },
    ],
  },
];

export const MOCK_ADDRESSES: AddressItem[] = [
  {
    id: "addr-1",
    fullName: "Nguyễn Thị Ngọc Kiều",
    phone: "0987 654 321",
    address: "123 Nguyễn Văn Cừ, Phường 4, Quận 5",
    province: "TP. Hồ Chí Minh",
    isDefault: true,
  },
  {
    id: "addr-2",
    fullName: "Nguyễn Thị Ngọc Kiều (Công ty)",
    phone: "0987 654 321",
    address: "Tòa nhà Bitexco, 2 Hải Triều, Phường Bến Nghé, Quận 1",
    province: "TP. Hồ Chí Minh",
    isDefault: false,
  },
];
