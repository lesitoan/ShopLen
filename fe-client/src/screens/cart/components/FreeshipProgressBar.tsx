import React from "react";
import { Truck, CheckCircle2 } from "lucide-react";
import { FREESHIP_THRESHOLD } from "../constants";

interface FreeshipProgressBarProps {
  subtotal: number;
}

export default function FreeshipProgressBar({ subtotal }: FreeshipProgressBarProps) {
  const remaining = Math.max(0, FREESHIP_THRESHOLD - subtotal);
  const percentage = Math.min(100, Math.round((subtotal / FREESHIP_THRESHOLD) * 100));

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "đ";
  };

  return (
    <div className="bg-primary-light border border-primary/30 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between gap-2 text-[13px] mb-2 font-medium">
        <div className="flex items-center gap-2 text-secondary">
          <Truck size={18} className="shrink-0" />
          {remaining > 0 ? (
            <span>
              Mua thêm <strong className="font-bold">{formatPrice(remaining)}</strong> để nhận ưu đãi <strong className="font-bold text-secondary">Miễn phí vận chuyển</strong>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <CheckCircle2 size={16} />
              Đơn hàng của bạn đã được Miễn phí vận chuyển!
            </span>
          )}
        </div>
        <span className="text-[12px] font-bold text-secondary shrink-0">
          {percentage}%
        </span>
      </div>

      <div className="w-full bg-surface border border-border h-2.5 rounded-full overflow-hidden">
        <div 
          className="bg-primary h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
