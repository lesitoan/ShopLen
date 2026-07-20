export interface CartItem {
  id: number;
  name: string;
  category: string;
  color: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  stock: number;
  isAvailable: boolean;
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
  freeshipThreshold: number;
  voucherDiscount: number;
  pointsDiscount: number;
  total: number;
}
