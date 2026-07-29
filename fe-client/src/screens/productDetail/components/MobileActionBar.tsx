import React from "react";
import { ShoppingBag } from "lucide-react";
import Button from "@/components/ui/Button";

interface MobileActionBarProps {
  onAddToCart: () => void;
  onBuyNow: () => void;
}

export default function MobileActionBar({
  onAddToCart,
  onBuyNow,
}: MobileActionBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border/80 p-3.5 flex items-center justify-between gap-3 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] md:hidden select-none">
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
