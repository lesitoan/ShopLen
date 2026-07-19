import React from "react";
import { Heart, ShoppingBag } from "lucide-react";
import Button from "@/components/ui/Button";

interface MobileActionBarProps {
  isLiked: boolean;
  setIsLiked: (liked: boolean) => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
}

export default function MobileActionBar({
  isLiked,
  setIsLiked,
  onAddToCart,
  onBuyNow,
}: MobileActionBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border/80 p-3.5 flex items-center justify-between gap-3 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] md:hidden select-none">
      <button
        onClick={() => setIsLiked(!isLiked)}
        className={`p-2.5 rounded-md border transition-all duration-200 active:scale-90 shrink-0 ${
          isLiked
            ? "border-primary/20 bg-primary-light text-primary"
            : "border-border text-text-secondary bg-surface"
        }`}
      >
        <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
      </button>

      <Button
        variant="outline"
        size="md"
        onClick={onAddToCart}
        className="flex-1 py-2.5 font-semibold rounded-md border-primary text-secondary hover:bg-primary-light/50 flex items-center justify-center gap-1.5 text-xs whitespace-nowrap"
      >
        <ShoppingBag size={14} />
        <span>Thêm vào giỏ</span>
      </Button>

      <Button
        variant="primary"
        size="md"
        onClick={onBuyNow}
        className="flex-1 py-2.5 font-bold rounded-md flex items-center justify-center text-xs whitespace-nowrap"
      >
        <span>Mua ngay</span>
      </Button>
    </div>
  );
}
