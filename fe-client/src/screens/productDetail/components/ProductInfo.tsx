import React, { useState, useMemo, useEffect } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import VariantSelector from "./VariantSelector";
import { COLOR_FILTERS } from "@/screens/products/constants";
import type { ProductDetail } from "@/types/product.type";

interface ProductInfoProps {
  product: ProductDetail;
  onAddToCart?: (color: string, quantity: number) => void;
  onBuyNow?: (color: string, quantity: number) => void;
}

export default function ProductInfo({
  product,
  onAddToCart,
  onBuyNow,
}: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");

  const badge =
    product.highlightType === "TODAY_DEAL"
      ? "sale"
      : product.highlightType === "HOT_TIKTOK"
      ? "hotTiktok"
      : undefined;
  const badgeLabel = product.highlightLabel || undefined;

  const availableColors = useMemo(() => {
    if (!product) return [];
    const colorOption = product.options?.find(
      (opt) => opt.optionType === "COLOR"
    );

    if (colorOption && colorOption.values.length > 0) {
      return colorOption.values.map((val) => ({
        name: val.label || val.value,
        code: val.code || val.value,
        hex: val.hex || COLOR_FILTERS.find((c) => c.value === val.code)?.hex || "#E5E7EB",
      }));
    }

    return COLOR_FILTERS.slice(0, 4).map((c) => ({
      name: c.name,
      code: c.value,
      hex: c.hex,
    }));
  }, [product]);

  useEffect(() => {
    if (availableColors.length > 0) {
      setSelectedColor(availableColors[0].name);
    }
  }, [availableColors]);

  const handleQtyChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const price = product.price ?? product.salePrice ?? product.originalPrice ?? 0;
  const originalPrice =
    product.salePrice && product.originalPrice ? product.originalPrice : undefined;
  const reviewsCount = product.reviews ?? 0;
  const soldCountVal = product.soldCount ?? reviewsCount * 4 + 8;

  return (
    <div className="flex flex-col text-left">
      {badge && (
        <div className="mb-2">
          <Badge variant={badge}>{badgeLabel || ""}</Badge>
        </div>
      )}

      <h1 className="text-[20px] md:text-[24px] font-bold text-text-primary mb-2 leading-tight">
        {product.name}
      </h1>

      <div className="flex items-center text-xs text-text-secondary mb-4 select-none">
        <span className="font-semibold text-text-primary">
          Đã bán {soldCountVal}
        </span>
      </div>

      <div className="flex items-baseline gap-3.5 p-4 rounded-lg bg-surface/50 border border-border/40 mb-6 select-none">
        <span className="text-[22px] md:text-[26px] font-bold text-secondary">
          {price.toLocaleString("vi-VN")}đ
        </span>
        {originalPrice && originalPrice > price && (
          <>
            <span className="text-[13px] md:text-[14px] text-text-secondary/70 line-through">
              {originalPrice.toLocaleString("vi-VN")}đ
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-error text-white">
              Giảm {Math.round((1 - price / originalPrice) * 100)}%
            </span>
          </>
        )}
      </div>

      <div className="mb-6">
        <h4 className="text-[12px] font-bold text-text-secondary uppercase mb-2.5 select-none">
          Mô tả ngắn
        </h4>
        <p className="text-[13px] text-text-secondary leading-relaxed">
          {product.shortDescription ||
            "Sản phẩm móc khóa bông bằng len được hoàn thiện thủ công vô cùng tinh xảo và tỉ mỉ. Thích hợp sử dụng làm móc treo cặp sách, trang trí balo, ví cầm tay, làm quà tặng đáng yêu dành tặng bạn bè hoặc người thương trong các dịp đặc biệt."}
        </p>
      </div>

      {availableColors.length > 0 && (
        <VariantSelector
          availableColors={availableColors}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
        />
      )}

      <div className="mb-6 select-none">
        <h4 className="text-[12px] font-bold text-text-secondary uppercase mb-2.5 select-none">
          Số lượng
        </h4>
        <div className="flex items-center border border-border rounded-md w-max bg-surface">
          <button
            onClick={() => handleQtyChange(-1)}
            className="p-2 text-text-secondary hover:text-text-primary transition-colors outline-none"
          >
            <Minus size={15} />
          </button>
          <span className="w-12 text-center text-[13px] font-bold text-text-primary">
            {quantity}
          </span>
          <button
            onClick={() => handleQtyChange(1)}
            className="p-2 text-text-secondary hover:text-text-primary transition-colors outline-none"
          >
            <Plus size={15} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3.5 mt-2 select-none">
        <Button
          variant="outline"
          size="md"
          onClick={() => onAddToCart && onAddToCart(selectedColor, quantity)}
          className="flex-1 py-2.5 font-semibold rounded-md border-primary text-secondary hover:bg-primary-light/50 flex items-center justify-center gap-2 text-xs"
        >
          <ShoppingBag size={15} />
          <span>Thêm vào giỏ</span>
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={() => onBuyNow && onBuyNow(selectedColor, quantity)}
          className="flex-1 py-2.5 font-bold rounded-md flex items-center justify-center gap-2 text-xs"
        >
          Mua ngay
        </Button>
      </div>

      <div className="mt-8 pt-6 border-t border-border/60 flex flex-col gap-2.5 text-xs text-text-secondary font-medium">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
          <span>Sản phẩm làm tay handmade thủ công tinh xảo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
          <span>Chất liệu len sợi Milk Cotton cao cấp an toàn</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
          <span>Đóng gói hộp quà và đính kèm thiệp ghi tay miễn phí</span>
        </div>
      </div>
    </div>
  );
}
