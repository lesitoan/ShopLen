import type { Prisma } from "@prisma/client";

export interface ProductRecommendationSource {
  id: string;
  categoryId: string;
  originalPrice: number;
  salePrice: number | null;
  soldCount: number;
  createdAt: Date;
  options: Array<{
    values: Prisma.JsonValue;
  }>;
}

export interface ScoredProductRecommendation<Product> {
  product: Product;
  score: number;
}

