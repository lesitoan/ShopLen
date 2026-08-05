"use client";

import React, { useState, useMemo, useCallback } from "react";
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

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
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

  const sortedOptions = useMemo(() => {
    if (!product?.options) return [];
    return [...product.options].sort((a, b) => a.displayOrder - b.displayOrder);
  }, [product]);

  const hasOptions = sortedOptions.length > 0;

  const allOptionsSelected = useMemo(() => {
    if (!hasOptions) return true;
    return sortedOptions.every((opt) => !!selectedOptions[opt.id]);
  }, [hasOptions, sortedOptions, selectedOptions]);

  const handleSelectOption = useCallback((optionId: string, valueCode: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionId]: valueCode }));
  }, []);

  const resolveOptionInfo = () => {
    if (!product || !hasOptions) {
      return { optionLabel: "Mặc định", optionCode: "DEFAULT", selectedOptionsList: undefined };
    }

    const labels: string[] = [];
    const codes: string[] = [];
    const selectedOptionsList: Array<{ optionType: "COLOR" | "SIZE"; code: string; label?: string }> = [];

    for (const opt of sortedOptions) {
      const selectedCode = selectedOptions[opt.id];
      if (!selectedCode) continue;

      const matchedVal = opt.values.find((v) => v.code === selectedCode);
      const codeVal = matchedVal?.code || selectedCode;
      const labelVal = matchedVal?.label || selectedCode;

      labels.push(labelVal);
      codes.push(codeVal);
      selectedOptionsList.push({
        optionType: opt.optionType,
        code: codeVal.toUpperCase(),
        label: labelVal,
      });
    }

    return {
      optionLabel: labels.join(" - ") || "Mặc định",
      optionCode: codes.join("-") || "DEFAULT",
      selectedOptionsList: selectedOptionsList.length > 0 ? selectedOptionsList : undefined,
    };
  };

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

  const handleAddToCart = () => {
    if (!product) return;

    if (hasOptions && !allOptionsSelected) {
      const missing = sortedOptions.find((opt) => !selectedOptions[opt.id]);
      toast.warning(`Vui lòng chọn ${missing?.name?.toLowerCase() || "phân loại"} trước khi thêm vào giỏ hàng!`);
      return;
    }

    const { optionLabel, optionCode, selectedOptionsList } = resolveOptionInfo();
    const itemId = `${product.id}-${optionCode}`;
    const isExisting = cartItems.some(
      (item) => String(item.id) === String(itemId)
    );

    if (cartItems.length >= 10 && !isExisting) {
      toast.warning("Giỏ hàng chỉ được chứa tối đa 10 sản phẩm khác loại!");
      return;
    }

    dispatch(
      addToCart({
        product,
        color: optionLabel,
        colorCode: optionCode,
        selectedOptions: selectedOptionsList,
        quantity,
      })
    );
    toast.success("Đã thêm sản phẩm vào giỏ hàng!");
  };

  const handleBuyNow = () => {
    if (!product) return;

    if (hasOptions && !allOptionsSelected) {
      const missing = sortedOptions.find((opt) => !selectedOptions[opt.id]);
      toast.warning(`Vui lòng chọn ${missing?.name?.toLowerCase() || "phân loại"} trước khi mua hàng!`);
      return;
    }

    const { optionLabel, optionCode, selectedOptionsList } = resolveOptionInfo();
    const itemId = `${product.id}-${optionCode}`;
    const isExisting = cartItems.some(
      (item) => String(item.id) === String(itemId)
    );

    if (cartItems.length >= 10 && !isExisting) {
      toast.warning("Giỏ hàng chỉ được chứa tối đa 10 sản phẩm khác loại!");
      return;
    }

    dispatch(
      addToCart({
        product,
        color: optionLabel,
        colorCode: optionCode,
        selectedOptions: selectedOptionsList,
        quantity,
      })
    );
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
                  selectedOptions={selectedOptions}
                  onSelectOption={handleSelectOption}
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
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />
      )}
    </div>
  );
}
