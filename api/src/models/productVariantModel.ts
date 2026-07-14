export type ProductVariantModel = {
  id: string;
  productId: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
};
