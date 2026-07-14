export type OrderItemModel = {
  id: string;
  orderId: string;
  productId: string;
  productVariantId: string;
  productName: string;
  variantName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};
