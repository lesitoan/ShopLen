import { UserProfile, OrderSummary, AddressItem } from "./types";

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
