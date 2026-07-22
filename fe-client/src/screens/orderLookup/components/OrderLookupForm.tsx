"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Search, AlertCircle } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface OrderLookupFormInputs {
  orderCode: string;
  phone: string;
}

interface OrderLookupFormProps {
  onSearch: (data: OrderLookupFormInputs) => void;
  isLoading?: boolean;
}

export default function OrderLookupForm({ onSearch, isLoading = false }: OrderLookupFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderLookupFormInputs>({
    defaultValues: {
      orderCode: "",
      phone: "",
    },
    mode: "onTouched",
  });

  const onSubmit = (data: OrderLookupFormInputs) => {
    onSearch(data);
  };

  return (
    <div className="w-full border-0 md:border md:border-border rounded-none md:rounded-xl bg-transparent md:bg-surface p-0 md:p-6 flex flex-col gap-4 shadow-none">
      <div className="flex flex-col gap-1 text-left">
        <h2 className="text-[16px] md:text-[18px] font-bold text-text-primary border-l-4 border-primary pl-3">
          Thông tin tra cứu
        </h2>
        <p className="text-[13px] text-text-secondary pl-3.5">
          Nhập đúng Mã đơn hàng (ví dụ: TLNK8899) và Số điện thoại bạn đã dùng khi chốt đơn.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4 pt-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="orderCode" className="text-[12.5px] font-semibold text-text-primary">
              Mã đơn hàng <span className="text-secondary">*</span>
            </label>
            <Input
              id="orderCode"
              placeholder="Ví dụ: TLNK8899"
              error={!!errors.orderCode}
              {...register("orderCode", {
                required: "Vui lòng nhập mã đơn hàng",
                minLength: { value: 4, message: "Mã đơn hàng cần ít nhất 4 ký tự" },
              })}
            />
            {errors.orderCode && (
              <span className="text-[11.5px] text-error font-medium flex items-center gap-1 mt-0.5">
                <AlertCircle size={12} className="shrink-0" />
                {errors.orderCode.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="phone" className="text-[12.5px] font-semibold text-text-primary">
              Số điện thoại đặt hàng <span className="text-secondary">*</span>
            </label>
            <Input
              id="phone"
              type="tel"
              placeholder="Ví dụ: 0987654321"
              error={!!errors.phone}
              {...register("phone", {
                required: "Vui lòng nhập số điện thoại",
                pattern: {
                  value: /^(0[3|5|7|8|9])+([0-9]{8})$/,
                  message: "Số điện thoại không hợp lệ (gồm 10 chữ số)",
                },
              })}
            />
            {errors.phone && (
              <span className="text-[11.5px] text-error font-medium flex items-center gap-1 mt-0.5">
                <AlertCircle size={12} className="shrink-0" />
                {errors.phone.message}
              </span>
            )}
          </div>
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          loadingText="Đang tìm kiếm..."
          className="w-full sm:w-fit self-start mt-1"
        >
          <Search size={15} />
          <span>Tra cứu ngay</span>
        </Button>
      </form>
    </div>
  );
}
