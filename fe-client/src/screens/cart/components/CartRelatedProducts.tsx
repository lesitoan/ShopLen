import React from "react";
import ProductGrid from "@/components/product/ProductGrid";
import { CART_RELATED_PRODUCTS } from "../constants";

export default function CartRelatedProducts() {
  return (
    <ProductGrid
      products={CART_RELATED_PRODUCTS}
      title="CÓ THỂ BẠN CŨNG THÍCH"
    />
  );
}
