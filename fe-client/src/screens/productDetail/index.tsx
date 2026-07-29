"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import Button from "@/components/ui/Button";
import {
  useGetProductDetailBySlugQuery,
  useGetProductsQuery,
} from "@/services/api/productApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";

import Gallery from "./components/Gallery";
import ProductGrid from "@/components/product/ProductGrid";
import Breadcrumbs from "./components/Breadcrumbs";
import ProductInfo from "./components/ProductInfo";
import DetailTabs from "./components/DetailTabs";
import MobileActionBar from "./components/MobileActionBar";
import ProductInfoSkeleton from "@/components/skeletons/product/ProductInfoSkeleton";

interface ProductDetailScreenProps {
  slug: string;
}

export default function ProductDetailScreen({ slug }: ProductDetailScreenProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  const {
    data: product,
    isLoading,
    isError,
  } = useGetProductDetailBySlugQuery(slug);

  const { data: relatedResponse } = useGetProductsQuery(
    product?.category?.slug
      ? { categorySlug: product.category.slug, limit: 4 }
      : undefined
  );

  const relatedProducts = useMemo(() => {
    if (!relatedResponse?.items) return [];
    return relatedResponse.items.filter((p) => p.slug !== slug).slice(0, 4);
  }, [relatedResponse, slug]);

  const hasColors = useMemo(() => {
    if (!product?.options) return false;
    const colorOpt = product.options.find((opt) => opt.optionType === "COLOR");
    return Boolean(colorOpt && colorOpt.values.length > 0);
  }, [product]);

  if (!isLoading && (isError || !product)) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center py-20 text-center px-4">
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

  const handleAddToCart = (color?: string, qty?: number) => {
    if (!product) return;

    const chosenColor = color ?? selectedColor;
    const chosenQty = qty ?? quantity;

    if (hasColors && !chosenColor) {
      toast.warning("Vui lòng chọn màu sắc trước khi thêm vào giỏ hàng!");
      return;
    }

    const colorVal = chosenColor || "Mặc định";
    const itemId = `${product.id}-${colorVal}`;
    const isExisting = cartItems.some(
      (item) => String(item.id) === String(itemId)
    );

    if (cartItems.length >= 10 && !isExisting) {
      toast.warning("Giỏ hàng chỉ được chứa tối đa 10 sản phẩm khác loại!");
      return;
    }

    dispatch(addToCart({ product, color: colorVal, quantity: chosenQty }));
    toast.success("Đã thêm sản phẩm vào giỏ hàng!");
  };

  const handleBuyNow = (color?: string, qty?: number) => {
    if (!product) return;

    const chosenColor = color ?? selectedColor;
    const chosenQty = qty ?? quantity;

    if (hasColors && !chosenColor) {
      toast.warning("Vui lòng chọn màu sắc trước khi mua hàng!");
      return;
    }

    const colorVal = chosenColor || "Mặc định";
    const itemId = `${product.id}-${colorVal}`;
    const isExisting = cartItems.some(
      (item) => String(item.id) === String(itemId)
    );

    if (cartItems.length >= 10 && !isExisting) {
      toast.warning("Giỏ hàng chỉ được chứa tối đa 10 sản phẩm khác loại!");
      return;
    }

    dispatch(addToCart({ product, color: colorVal, quantity: chosenQty }));
    router.push("/gio-hang");
  };

  return (
    <div className="flex-1 flex flex-col pb-20 md:pb-0">
      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4 md:px-6 w-full">
          {!isLoading && product && <Breadcrumbs productName={product.name} />}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
            <Gallery
              productName={product?.name || "Sản phẩm"}
              images={product?.images}
              isLoading={isLoading}
            />

            {isLoading ? (
              <ProductInfoSkeleton />
            ) : (
              product && (
                <ProductInfo
                  product={product}
                  selectedColor={selectedColor}
                  setSelectedColor={setSelectedColor}
                  quantity={quantity}
                  setQuantity={setQuantity}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                />
              )
            )}
          </div>

          {!isLoading && product && (
            <>
              <DetailTabs
                productName={product.name}
                descriptionHtml={product.descriptionHtml}
                careInstructionHtml={product.careInstructionHtml}
              />

              <ProductGrid products={relatedProducts} />
            </>
          )}
        </div>
      </main>

      {!isLoading && product && (
        <MobileActionBar
          onAddToCart={() => handleAddToCart(selectedColor, quantity)}
          onBuyNow={() => handleBuyNow(selectedColor, quantity)}
        />
      )}
    </div>
  );
}
