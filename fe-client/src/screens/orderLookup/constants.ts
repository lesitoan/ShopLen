export type OrderStatusCode =
  | "CREATED"
  | "PAYMENT_CONFIRMED"
  | "CRAFTING"
  | "SHIPPING"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderStatusStep {
  step: number;
  code: OrderStatusCode;
  label: string;
  desc: string;
}

export interface OrderItem {
  id: string;
  name: string;
  variant?: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderDetail {
  orderCode: string;
  phone: string;
  customerName: string;
  shippingAddress: string;
  shippingUnit: string;
  trackingCode?: string;
  paymentMethod: string;
  paymentStatus: "PAID" | "UNPAID";
  createdAt: string;
  statusCode: OrderStatusCode;
  currentStep: number;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
}

export const ORDER_STATUS_STEPS: OrderStatusStep[] = [
  { step: 1, code: "CREATED", label: "Đã chốt đơn", desc: "Hệ thống ghi nhận đơn hàng" },
  { step: 2, code: "PAYMENT_CONFIRMED", label: "Xác nhận VietQR", desc: "Đã nhận chuyển khoản" },
  { step: 3, code: "CRAFTING", label: "Đang móc thủ công", desc: "Thợ tỉ mỉ hoàn thiện sản phẩm" },
  { step: 4, code: "SHIPPING", label: "Đang giao hàng", desc: "Đơn vị vận chuyển đang giao" },
  { step: 5, code: "DELIVERED", label: "Giao thành công", desc: "Khách đã nhận quà tặng" },
];

export const MOCK_LOOKUP_ORDERS: OrderDetail[] = [
  {
    orderCode: "TLNK8899",
    phone: "0987654321",
    customerName: "Nguyễn Thu Hà",
    shippingAddress: "123 Hải Phòng, Quận Thanh Khê, Đà Nẵng",
    shippingUnit: "Giao Hàng Nhanh (GHN)",
    trackingCode: "GHN88992233",
    paymentMethod: "Chuyển khoản VietQR",
    paymentStatus: "PAID",
    createdAt: "22/07/2026 14:30",
    statusCode: "CRAFTING",
    currentStep: 3,
    items: [
      {
        id: "item-1",
        name: "Móc khóa gấu len Momo",
        variant: "Nâu nhạt • Sợi Milk Cotton",
        price: 150000,
        quantity: 1,
        image: "/images/products/moc-khoa-gau.png",
      },
      {
        id: "item-2",
        name: "Hoa tulip len trang trí",
        variant: "Hồng baby",
        price: 85000,
        quantity: 2,
        image: "/images/products/hoa-tulip.png",
      },
    ],
    subtotal: 320000,
    shippingFee: 22000,
    discount: 22000,
    total: 320000,
  },
  {
    orderCode: "TLNK9900",
    phone: "0912345678",
    customerName: "Trần Minh Quân",
    shippingAddress: "45 Lê Duẩn, Quận 1, TP. Hồ Chí Minh",
    shippingUnit: "Viettel Post",
    trackingCode: "VTP99005544",
    paymentMethod: "Chuyển khoản VietQR",
    paymentStatus: "PAID",
    createdAt: "21/07/2026 09:15",
    statusCode: "SHIPPING",
    currentStep: 4,
    items: [
      {
        id: "item-3",
        name: "Túi len hoa cúc xinh xắn",
        variant: "Màu kem",
        price: 269000,
        quantity: 1,
        image: "/images/products/tui-hoa-cuc.png",
      },
    ],
    subtotal: 269000,
    shippingFee: 22000,
    discount: 0,
    total: 291000,
  },
];
