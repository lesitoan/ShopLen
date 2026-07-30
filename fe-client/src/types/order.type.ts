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
