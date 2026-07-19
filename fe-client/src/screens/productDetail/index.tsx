"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";
import { CATALOG_PRODUCTS, COLOR_FILTERS } from "@/screens/products/constants";

// Sub-components
import Gallery from "./components/Gallery";
import ProductGrid from "@/components/product/ProductGrid";
import Breadcrumbs from "./components/Breadcrumbs";
import ProductInfo from "./components/ProductInfo";
import DetailTabs from "./components/DetailTabs";
import MobileActionBar from "./components/MobileActionBar";

interface ProductDetailScreenProps {
  slug: string;
}

export default function ProductDetailScreen({ slug }: ProductDetailScreenProps) {
  const numericId = Number(slug.replace("sp-", ""));
  const product = CATALOG_PRODUCTS.find((p) => p.id === numericId);

  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedColor(product.color);
    }
  }, [product]);

  if (!product) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center py-16 text-center px-4">
        <h2 className="text-[18px] font-bold text-text-primary mb-4 select-none">
          Không tìm thấy sản phẩm
        </h2>
        <p className="text-[13px] text-text-secondary mb-6 max-w-sm select-none">
          Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị gỡ bỏ khỏi hệ thống cửa hàng.
        </p>
        <Link href="/san-pham">
          <Button variant="primary" className="rounded-md px-6 py-2 flex items-center gap-2 font-bold text-xs">
            <ArrowLeft size={14} />
            <span>Quay lại cửa hàng</span>
          </Button>
        </Link>
      </main>
    );
  }

  const galleryImages = [
    product.image,
    "/images/products/moc-khoa-gau.png",
    "/images/products/moc-khoa-ech.png",
  ];

  const availableColors = Array.from(
    new Set([product.color, "Kem", "Hồng", "Vàng"])
  ).map((colorName) => {
    const filterColor = COLOR_FILTERS.find((c) => c.name === colorName);
    return {
      name: colorName,
      hex: filterColor ? filterColor.hex : "#E5E7EB",
    };
  });

  const relatedProducts = CATALOG_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const handleQtyChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    console.log("Add to cart:", product.name, quantity, selectedColor);
  };

  const handleBuyNow = () => {
    console.log("Buy now:", product.name, quantity, selectedColor);
  };

  return (
    <div className="flex-1 flex flex-col pb-20 md:pb-0">
      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4 md:px-6 w-full">
          <Breadcrumbs productName={product.name} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
            <Gallery
              productName={product.name}
              mainImage={product.image}
              galleryImages={galleryImages}
            />

            <ProductInfo
              product={product}
              quantity={quantity}
              handleQtyChange={handleQtyChange}
              availableColors={availableColors}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              isLiked={isLiked}
              setIsLiked={setIsLiked}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          </div>

          <DetailTabs productName={product.name} />

          <ProductGrid products={relatedProducts} />
        </div>
      </main>

      <MobileActionBar
        isLiked={isLiked}
        setIsLiked={setIsLiked}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />
    </div>
  );
}
