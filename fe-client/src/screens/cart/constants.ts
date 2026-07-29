import { CartItem, Voucher } from "@/types/cart.type";
import { CATALOG_PRODUCTS } from "@/screens/products/constants";

export const STANDARD_SHIPPING_FEE = 30000;
export const LOYALTY_POINTS_CONVERSION_RATE = 100;
export const MOCK_USER_POINTS = 500;

export const INITIAL_CART_ITEMS: CartItem[] = [];

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
