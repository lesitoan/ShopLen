export interface CheckoutFormData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  province: string;
  note?: string;
  confirmTerms: boolean;
}

export interface CheckoutCartItem {
  id: number;
  name: string;
  color: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CheckoutSummaryData {
  subtotal: number;
  shippingFee: number;
  voucherDiscount: number;
  pointsDiscount: number;
  total: number;
}
