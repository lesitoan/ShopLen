"use client";

import React, { useMemo } from "react";
import ProductGrid from "@/components/product/ProductGrid";
import { useGetProductsQuery } from "@/services/api/productApi";

export default function CartRelatedProducts() {
  const { data: response } = useGetProductsQuery({ limit: 4, page: 1 });

  const products = useMemo(() => {
    return response?.items || [];
  }, [response]);

  if (!products || products.length === 0) return null;

  return (
    <ProductGrid
      products={products}
      title="CÓ THỂ BẠN CŨNG THÍCH"
    />
  );
}
