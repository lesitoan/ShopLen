import React from "react";
import Link from "next/link";
import { ShieldCheck, RotateCcw, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { CartSummaryData } from "../types";

interface CartSummaryProps {
  summary: CartSummaryData;
  isCheckoutDisabled: boolean;
  onCheckoutClick: () => void;
}

export default function CartSummary({
  summary,
  isCheckoutDisabled,
  onCheckoutClick,
}: CartSummaryProps) {
  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "đ";
  };

  const totalDiscount = summary.voucherDiscount + summary.pointsDiscount;

  return (
    <div className="bg-surface border border-border rounded-xl p-4 md:p-6 flex flex-col gap-4 sticky top-24">
      <h2 className="text-[16px] font-bold text-text-primary border-b border-border pb-3">
        Tóm tắt đơn hàng
      </h2>

      <div className="flex flex-col gap-2.5 text-[13.5px]">
        <div className="flex justify-between text-text-secondary">
          <span>Tạm tính</span>
          <span className="font-semibold text-text-primary">
            {formatPrice(summary.subtotal)}
          </span>
        </div>

        <div className="flex justify-between text-text-secondary">
          <span>Phí vận chuyển</span>
          <span className="font-semibold text-text-primary">
            {summary.shippingFee === 0 ? (
              <span className="text-emerald-600 font-bold">Miễn phí</span>
            ) : (
              formatPrice(summary.shippingFee)
            )}
          </span>
        </div>

        {summary.voucherDiscount > 0 && (
          <div className="flex justify-between text-text-secondary">
            <span>Mã giảm giá</span>
            <span className="font-semibold text-emerald-600">
              -{formatPrice(summary.voucherDiscount)}
            </span>
          </div>
        )}

        {summary.pointsDiscount > 0 && (
          <div className="flex justify-between text-text-secondary">
            <span>Giảm từ điểm thưởng</span>
            <span className="font-semibold text-emerald-600">
              -{formatPrice(summary.pointsDiscount)}
            </span>
          </div>
        )}

        {totalDiscount > 0 && (
          <div className="flex justify-between text-text-secondary pt-1">
            <span>Tổng giảm giá</span>
            <span className="font-bold text-emerald-600">
              -{formatPrice(totalDiscount)}
            </span>
          </div>
        )}
      </div>

      <div className="border-t border-border pt-3 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-bold text-text-primary">
            Tổng thanh toán
          </span>
          <span className="text-[20px] font-bold text-secondary">
            {formatPrice(summary.total)}
          </span>
        </div>
        <p className="text-[11px] text-text-secondary text-right">
          (Đã bao gồm VAT nếu có)
        </p>
      </div>

      <div className="hidden md:flex flex-col gap-2 mt-2">
        {isCheckoutDisabled ? (
          <Button
            variant="primary"
            size="md"
            disabled
            className="w-full py-3.5 text-[14px] font-bold rounded-md justify-center opacity-60 cursor-not-allowed"
          >
            Vui lòng xóa sản phẩm hết hàng
          </Button>
        ) : (
          <Button
            type="button"
            variant="primary"
            size="md"
            className="w-full py-3.5 text-[14px] font-bold rounded-md justify-center gap-2"
            onClick={onCheckoutClick}
          >
            <span>Tiến hành đặt hàng</span>
            <ArrowRight size={16} />
          </Button>
        )}

        <Link href="/san-pham" className="w-full">
          <Button
            variant="outline"
            size="md"
            className="w-full py-2.5 text-[13px] font-semibold rounded-md justify-center border-border text-text-primary hover:bg-background"
          >
            Tiếp tục mua sắm
          </Button>
        </Link>
      </div>

      {/* Trust Badges */}
      <div className="border-t border-border/60 pt-4 flex flex-col gap-2.5 text-[12px] text-text-secondary">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-secondary shrink-0" />
          <span>Thanh toán 100% qua chuyển khoản QR an toàn</span>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw size={16} className="text-secondary shrink-0" />
          <span>Đổi trả sản phẩm trong vòng 7 ngày nếu lỗi</span>
        </div>
      </div>
    </div>
  );
}
