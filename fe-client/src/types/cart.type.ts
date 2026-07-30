export interface CartItem {
  id: string | number;
  productId?: string;
  name: string;
  category?: string;
  color?: string;
  colorCode?: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  stock?: number;
  isAvailable?: boolean;
}

export interface StoredCartItem {
  id: string;
  productId: string;
  quantity: number;
  optionCode: string;
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
  colorCode?: string;
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

export interface CartProductOptionValue {
  label?: string;
  value?: string;
  code?: string;
  hex?: string;
  [key: string]: any;
}

export interface CartProductOption {
  id: string;
  optionType: "COLOR" | "SIZE" | string;
  name: string;
  displayOrder: number;
  values: CartProductOptionValue[] | string[] | any;
}

export interface CartProductItemResponse {
  id: string;
  code: string | null;
  name: string | null;
  slug: string | null;
  category: { id: string; name: string; slug: string } | null;
  image: string | null;
  imageAlt: string | null;
  originalPrice: number | null;
  salePrice: number | null;
  price: number;
  stockQuantity: number;
  isAvailable: boolean;
  unavailableReason: "PRODUCT_UNAVAILABLE" | "OUT_OF_STOCK" | "PRODUCT_NOT_FOUND" | null;
  options: CartProductOption[];
}

export interface CartProductsResponseData {
  items: CartProductItemResponse[];
}
