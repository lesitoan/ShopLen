"use client";

import React, { useMemo } from "react";
import ProductGrid from "@/components/product/ProductGrid";
import { useGetProductRecommendationsQuery } from "@/services/api/productApi";
import { useAppSelector } from "@/store/hooks";

export default function CartRelatedProducts() {
  const cartItems = useAppSelector((state) => state.cart.items);
  const productIds = useMemo(
    () =>
      [
        ...new Set(
          cartItems
            .map((item) => item.productId)
            .filter((productId): productId is string => Boolean(productId)),
        ),
      ].sort(),
    [cartItems],
  );
  const { data: response } = useGetProductRecommendationsQuery({
    productIds,
    limit: 4,
  });

  const products = response?.items ?? [];

  if (!products || products.length === 0) return null;

  return (
    <ProductGrid
      products={products}
      title="CÓ THỂ BẠN CŨNG THÍCH"
    />
  );
}
