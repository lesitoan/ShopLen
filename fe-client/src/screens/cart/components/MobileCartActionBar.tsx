import React from "react";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Button from "@/components/ui/Button";

interface MobileCartActionBarProps {
  total: number;
  isCheckoutDisabled: boolean;
}

export default function MobileCartActionBar({
  total,
  isCheckoutDisabled,
}: MobileCartActionBarProps) {
  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "đ";
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border/80 p-3 flex flex-col gap-2 md:hidden select-none">
      <div className="flex items-center justify-between px-1">
        <span className="text-[12px] text-text-secondary font-medium">Tổng thanh toán:</span>
        <span className="text-[16px] font-bold text-secondary">{formatPrice(total)}</span>
      </div>

      <div className="flex items-center gap-2.5">
        <Link href="/san-pham" className="flex-1">
          <Button
            variant="outline"
            size="md"
            className="w-full py-2.5 text-[12.5px] font-semibold rounded-md justify-center border-border text-text-primary hover:bg-background flex items-center gap-1"
          >
            <ShoppingBag size={14} />
            <span>Tiếp tục mua</span>
          </Button>
        </Link>

        {isCheckoutDisabled ? (
          <Button
            variant="primary"
            size="md"
            disabled
            className="flex-1 py-2.5 text-[12.5px] font-bold rounded-md justify-center opacity-60 cursor-not-allowed"
          >
            Sản phẩm hết hàng
          </Button>
        ) : (
          <Link href="/thanh-toan" className="flex-1">
            <Button
              variant="primary"
              size="md"
              className="w-full py-2.5 text-[12.5px] font-bold rounded-md justify-center gap-1.5"
            >
              <span>Thanh toán</span>
              <ArrowRight size={14} />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
