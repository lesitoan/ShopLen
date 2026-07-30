export interface CreateOrderItemPayload {
  productId: string;
  quantity: number;
  selectedOptions?: Array<{
    optionType: "COLOR" | "SIZE";
    code: string;
  }>;
}

export interface CreateOrderPayload {
  items: CreateOrderItemPayload[];
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  shippingProvince?: string;
  shippingDistrict?: string;
  shippingWard?: string;
  customerNote?: string;
  shippingFee: number;
}

export interface OrderResponseData {
  id: string;
  orderCode: string;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
  [key: string]: any;
}

export interface CustomerOrderItemSnapshot {
  id?: string;
  code?: string;
  name?: string;
  slug?: string;
  image?: string | null;
  category?: { name?: string } | string | null;
  selectedOptions?: Array<{
    optionType: string;
    name?: string;
    code: string;
    label?: string;
  }>;
}

export interface CustomerOrderItemData {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productSnapshot?: CustomerOrderItemSnapshot | any;
}

export interface CustomerOrderResponse {
  id: string;
  orderCode: string;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  pointsDiscount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  expiresAt?: string;
  paidAt?: string | null;
  createdAt: string;
  updatedAt: string;
  items: CustomerOrderItemData[];
}

export interface OrderDetailPayment {
  id: string;
  provider: string;
  method: string;
  bankName: string;
  accountNo: string;
  accountName: string;
  amount: number;
  transferContent: string;
  qrImageUrl?: string;
  transactionRef?: string;
  isMatched: boolean;
  status: string;
  paidAt?: string | null;
  createdAt: string;
}

export interface OrderDetailResponse {
  id: string;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  shippingProvince?: string | null;
  shippingDistrict?: string | null;
  shippingWard?: string | null;
  customerNote?: string | null;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  pointsDiscount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  expiresAt?: string | null;
  paidAt?: string | null;
  cancelledAt?: string | null;
  cancelReason?: string | null;
  shippingUnit?: string | null;
  trackingCode?: string | null;
  createdAt: string;
  updatedAt: string;
  items: CustomerOrderItemData[];
  payments?: OrderDetailPayment[];
}
