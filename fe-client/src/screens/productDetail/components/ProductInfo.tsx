import React from "react";
import { Star, Minus, Plus, ShoppingBag, Heart } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import VariantSelector from "./VariantSelector";

interface ColorOption {
  name: string;
  hex: string;
}

interface ProductItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: "new" | "bestSeller" | "hotTiktok" | "sale" | "limited" | "soldOut";
  badgeLabel?: string;
  category: string;
  color: string;
}

interface ProductInfoProps {
  product: ProductItem;
  quantity: number;
  handleQtyChange: (delta: number) => void;
  availableColors: ColorOption[];
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  isLiked: boolean;
  setIsLiked: (liked: boolean) => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
}

export default function ProductInfo({
  product,
  quantity,
  handleQtyChange,
  availableColors,
  selectedColor,
  setSelectedColor,
  isLiked,
  setIsLiked,
  onAddToCart,
  onBuyNow,
}: ProductInfoProps) {
  return (
    <div className="flex flex-col text-left">
      {product.badge && (
        <div className="mb-2">
          <Badge variant={product.badge}>{product.badgeLabel || ""}</Badge>
        </div>
      )}

      <h1 className="text-[20px] md:text-[24px] font-bold text-text-primary mb-2 leading-tight">
        {product.name}
      </h1>

      <div className="flex items-center gap-4 text-xs text-text-secondary mb-4 select-none">
        <div className="flex items-center gap-1 font-medium">
          <div className="flex items-center text-secondary">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star
                key={idx}
                size={14}
                fill={idx < Math.floor(product.rating) ? "currentColor" : "none"}
                className="stroke-[2.5]"
              />
            ))}
          </div>
          <span className="text-text-primary font-bold ml-1">
            {product.rating}
          </span>
          <span className="text-text-secondary/80">
            ({product.reviews} đánh giá)
          </span>
        </div>
        <div className="w-px h-3.5 bg-border/80" />
        <span className="font-semibold text-text-primary">
          Đã bán {product.reviews * 4 + 8}
        </span>
      </div>

      <div className="flex items-baseline gap-3.5 p-4 rounded-lg bg-surface/50 border border-border/40 mb-6 select-none">
        <span className="text-[22px] md:text-[26px] font-bold text-secondary">
          {product.price.toLocaleString("vi-VN")}đ
        </span>
        {product.originalPrice && (
          <>
            <span className="text-[13px] md:text-[14px] text-text-secondary/70 line-through">
              {product.originalPrice.toLocaleString("vi-VN")}đ
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-error text-white">
              Giảm {Math.round((1 - product.price / product.originalPrice) * 100)}%
            </span>
          </>
        )}
      </div>

      <div className="mb-6">
        <h4 className="text-[12px] font-bold text-text-secondary uppercase mb-2.5 select-none">
          Mô tả ngắn
        </h4>
        <p className="text-[13px] text-text-secondary leading-relaxed">
          Sản phẩm móc khóa bông bằng len được hoàn thiện thủ công vô cùng tinh xảo và tỉ mỉ. Thích hợp sử dụng làm móc treo cặp sách, trang trí balo, ví cầm tay, làm quà tặng đáng yêu dành tặng bạn bè hoặc người thương trong các dịp đặc biệt.
        </p>
      </div>

      <VariantSelector
        availableColors={availableColors}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
      />

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
          onClick={onAddToCart}
          className="flex-1 py-2.5 font-semibold rounded-md border-primary text-secondary hover:bg-primary-light/50 flex items-center justify-center gap-2 text-xs"
        >
          <ShoppingBag size={15} />
          <span>Thêm vào giỏ</span>
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={onBuyNow}
          className="flex-1 py-2.5 font-bold rounded-md flex items-center justify-center gap-2 text-xs"
        >
          Mua ngay
        </Button>
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`p-2.5 rounded-md border transition-all duration-200 active:scale-90 ${
            isLiked
              ? "border-primary/20 bg-primary-light text-primary"
              : "border-border text-text-secondary hover:text-text-primary bg-surface"
          }`}
        >
          <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
        </button>
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
