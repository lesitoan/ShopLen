import { CartItem, Voucher } from "./types";
import { CATALOG_PRODUCTS } from "@/screens/products/constants";

export const FREESHIP_THRESHOLD = 700000;
export const STANDARD_SHIPPING_FEE = 30000;
export const LOYALTY_POINTS_CONVERSION_RATE = 100; // 1 điểm = 100đ
export const MOCK_USER_POINTS = 500; // 500 điểm = 50.000đ

export const INITIAL_CART_ITEMS: CartItem[] = [
  {
    id: 1,
    name: "Móc khóa Thỏ Bông Len Handmade",
    category: "Thú bông",
    color: "Hồng nhạt",
    price: 45000,
    originalPrice: 55000,
    quantity: 2,
    image: "/images/products/moc-khoa-tho.png",
    stock: 15,
    isAvailable: true,
  },
  {
    id: 2,
    name: "Móc khóa Hoa Tinh Tú Sắc Màu",
    category: "Hoa len",
    color: "Vàng chanh",
    price: 35000,
    originalPrice: 40000,
    quantity: 1,
    image: "/images/products/moc-khoa-hoa.png",
    stock: 3,
    isAvailable: true,
  },
  {
    id: 3,
    name: "Móc khóa Ếch Xanh Đội Mũ Len",
    category: "Động vật",
    color: "Xanh lá",
    price: 50000,
    quantity: 1,
    image: "/images/products/moc-khoa-ech.png",
    stock: 0,
    isAvailable: false,
  },
];

export const AVAILABLE_VOUCHERS: Voucher[] = [
  {
    code: "TIEMLEN10K",
    discountAmount: 10000,
    minOrderValue: 100000,
    description: "Giảm 10.000đ cho đơn hàng từ 100.000đ",
  },
  {
    code: "TIEMLEN20K",
    discountAmount: 20000,
    minOrderValue: 250000,
    description: "Giảm 20.000đ cho đơn hàng từ 250.000đ",
  },
  {
    code: "CHAOANHBAN",
    discountAmount: 15000,
    minOrderValue: 150000,
    description: "Ưu đãi khách hàng mới giảm 15.000đ",
  },
];

export const CART_RELATED_PRODUCTS = CATALOG_PRODUCTS.slice(0, 4);
