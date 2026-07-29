export interface CartItem {
  id: string | number;
  productId?: string;
  name: string;
  category?: string;
  color?: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  stock?: number;
  isAvailable?: boolean;
}

export interface CartState {
  items: CartItem[];
  isHydrated: boolean;
  error: string | null;
}

export interface AddToCartPayload {
  product: {
    id: string | number;
    name: string;
    slug?: string;
    price?: number;
    originalPrice?: number;
    salePrice?: number | null;
    category?: string | { name: string } | null;
    image?: string;
    thumbnail?: { url: string } | null;
    images?: { url: string }[];
    stockQuantity?: number;
    stock?: number;
  };
  color?: string;
  quantity?: number;
}

export interface Voucher {
  code: string;
  discountAmount: number;
  minOrderValue: number;
  description: string;
}

export interface CartSummaryData {
  subtotal: number;
  shippingFee: number;
  voucherDiscount: number;
  pointsDiscount: number;
  total: number;
}
