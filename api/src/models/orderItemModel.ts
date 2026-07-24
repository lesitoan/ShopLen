export type OrderItemModel = {
  id: string;
  orderId: string;
  productId: string;
  productSnapshot: Record<string, unknown>;
  selectedOptions?: Record<string, string>;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};
