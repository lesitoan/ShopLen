import React from "react";
import { UseFormRegister, FieldErrors, Control, Controller } from "react-hook-form";
import { ArrowRight, Lock, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import { CheckoutSummaryData, CheckoutFormData } from "../types";

interface CheckoutSummaryProps {
  summary: CheckoutSummaryData;
  isSubmitting: boolean;
  register: UseFormRegister<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
  control: Control<CheckoutFormData>;
}

export default function CheckoutSummary({
  summary,
  isSubmitting,
  control,
  errors,
}: CheckoutSummaryProps) {
  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "đ";
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-4 md:p-6 flex flex-col gap-4 sticky top-24">
      <h2 className="text-[16px] font-bold text-text-primary border-b border-border pb-3">
        Tổng quan chi phí
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
            <span>Giảm điểm thưởng</span>
            <span className="font-semibold text-emerald-600">
              -{formatPrice(summary.pointsDiscount)}
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
      </div>

      <div className="hidden md:flex flex-col gap-3 mt-1 pt-2 border-t border-border/60">
        <div className="flex flex-col gap-1">
          <Controller
            name="confirmTerms"
            control={control}
            rules={{
              required: "Vui lòng xác nhận thông tin đơn hàng trước khi tiến hành thanh toán",
            }}
            render={({ field }) => (
              <Checkbox
                id="confirmTermsDesktop"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                label="Tôi xác nhận thông tin nhận hàng đã chính xác và đồng ý thanh toán trước 100% qua QR."
              />
            )}
          />
          {errors.confirmTerms && (
            <div className="flex items-center gap-1 text-[11.5px] text-error font-medium pl-1">
              <AlertCircle size={13} />
              <span>{errors.confirmTerms.message}</span>
            </div>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSubmitting}
          loadingText="Đang tạo đơn hàng..."
          className="w-full py-3.5 text-[14px] font-bold rounded-md justify-center gap-2"
        >
          <span>Xác nhận đặt hàng & Lấy mã QR</span>
          <ArrowRight size={16} />
        </Button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-text-secondary mt-0.5">
          <Lock size={12} />
          <span>Thông tin được mã hóa bảo mật 100%</span>
        </div>
      </div>
    </div>
  );
}
