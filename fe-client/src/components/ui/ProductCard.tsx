import React, { useState } from "react";
import { Heart, ShoppingCart, Star } from "lucide-react";
import Badge from "./Badge";
import Button from "./Button";

interface ProductCardProps {
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: "new" | "bestSeller" | "hotTiktok" | "sale" | "limited" | "soldOut";
  badgeLabel?: string;
  onAddToCart?: () => void;
  onToggleWishlist?: () => void;
}

export default function ProductCard({
  name,
  price,
  originalPrice,
  rating,
  reviews,
  image,
  badge,
  badgeLabel,
  onAddToCart,
  onToggleWishlist,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    if (onToggleWishlist) onToggleWishlist();
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div className="group relative bg-surface rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      {/* Product Image and Overlay Actions */}
      <div className="relative aspect-square w-full bg-background overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badge Top Left */}
        {badge && (
          <div className="absolute left-2.5 top-2.5">
            <Badge variant={badge}>
              {badgeLabel ||
                (badge === "new"
                  ? "MỚI"
                  : badge === "bestSeller"
                  ? "BÁN CHẠY"
                  : badge === "hotTiktok"
                  ? "HOT TIKTOK"
                  : badge === "sale"
                  ? "GIẢM GIÁ"
                  : badge === "limited"
                  ? "GIỚI HẠN"
                  : "HẾT HÀNG")}
            </Badge>
          </div>
        )}

        {/* Wishlist Button Top Right */}
        <button
          onClick={handleWishlistClick}
          className="absolute right-2.5 top-2.5 w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center text-text-secondary hover:text-red-500 hover:border-red-100 hover:bg-red-50/50 transition-all duration-200"
        >
          <Heart
            size={16}
            className={`transition-colors duration-200 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1">
        {/* Product Name */}
        <h3 className="text-[14px] font-medium text-text-primary mb-1 line-clamp-2 min-h-[40px] group-hover:text-primary active:text-primary-active transition-colors">
          {name}
        </h3>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center text-amber-400">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star
                key={idx}
                size={12}
                className={idx < Math.round(rating) ? "fill-amber-400" : "text-border"}
              />
            ))}
          </div>
          <span className="text-[11px] text-text-secondary">({reviews})</span>
        </div>

        {/* Price and Cart Action */}
        <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
          <div className="flex flex-col">
            {originalPrice && (
              <span className="text-[11px] text-text-secondary line-through mb-0.5">
                {formatPrice(originalPrice)}
              </span>
            )}
            <span className="text-[15px] font-bold text-secondary">
              {formatPrice(price)}
            </span>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={onAddToCart}
            className="rounded-full shadow-sm hover:shadow"
          >
            <ShoppingCart size={14} />
            <span className="text-[11px] font-medium">Mua</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
