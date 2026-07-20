import React from "react";
import { UseFormRegister, FieldErrors, Control, Controller } from "react-hook-form";
import { ArrowRight, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import { CheckoutFormData } from "../types";

interface MobileCheckoutActionBarProps {
  total: number;
  isSubmitting: boolean;
  register: UseFormRegister<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
  control: Control<CheckoutFormData>;
}

export default function MobileCheckoutActionBar({
  total,
  isSubmitting,
  control,
  errors,
}: MobileCheckoutActionBarProps) {
  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "đ";
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border/80 p-3 flex flex-col gap-2.5 md:hidden select-none">
      <div className="flex flex-col gap-1">
        <Controller
          name="confirmTerms"
          control={control}
          rules={{
            required: "Vui lòng xác nhận thông tin đơn hàng trước khi bấm đặt hàng",
          }}
          render={({ field }) => (
            <Checkbox
              id="confirmTermsMobile"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              label="Tôi xác nhận thông tin & đồng ý thanh toán QR."
            />
          )}
        />
        {errors.confirmTerms && (
          <div className="flex items-center gap-1 text-[11px] text-error font-medium pl-1">
            <AlertCircle size={12} />
            <span>{errors.confirmTerms.message}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 pt-1 border-t border-border/40">
        <div className="flex flex-col text-left">
          <span className="text-[11px] text-text-secondary">Tổng thanh toán</span>
          <span className="text-[16px] font-bold text-secondary">{formatPrice(total)}</span>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={isSubmitting}
          className="flex-1 py-2.5 text-[12.5px] font-bold rounded-md justify-center gap-1.5"
        >
          <span>{isSubmitting ? "Đang xử lý..." : "Đặt hàng & Lấy mã QR"}</span>
          <ArrowRight size={14} />
        </Button>
      </div>
    </div>
  );
}
