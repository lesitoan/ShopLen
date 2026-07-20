import React from "react";
import { UseFormRegister, FieldErrors, Control, Controller } from "react-hook-form";
import { AlertCircle, User, Phone, Mail, MapPin, FileText } from "lucide-react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { CheckoutFormData } from "../types";
import { PROVINCE_OPTIONS } from "../constants";

interface ShippingFormProps {
  register: UseFormRegister<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
  control: Control<CheckoutFormData>;
}

export default function ShippingForm({
  register,
  errors,
  control,
}: ShippingFormProps) {
  return (
    <div className="bg-surface border border-border rounded-xl p-4 md:p-6 flex flex-col gap-5">
      <h2 className="text-[16px] font-bold text-text-primary border-b border-border pb-3 flex items-center gap-2">
        <User size={18} className="text-secondary" />
        <span>Thông tin nhận hàng</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-bold text-text-primary">
            Họ và tên <span className="text-error">*</span>
          </label>
          <Input
            {...register("fullName", {
              required: "Vui lòng nhập họ và tên",
              minLength: {
                value: 2,
                message: "Họ và tên phải có ít nhất 2 ký tự",
              },
            })}
            placeholder="Nhập họ và tên người nhận"
            error={!!errors.fullName}
            leftIcon={<User size={16} />}
          />
          {errors.fullName && (
            <div className="flex items-center gap-1 text-[11.5px] text-error">
              <AlertCircle size={13} />
              <span>{errors.fullName.message}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-bold text-text-primary">
            Số điện thoại <span className="text-error">*</span>
          </label>
          <Input
            {...register("phone", {
              required: "Vui lòng nhập số điện thoại",
              pattern: {
                value: /^(0[3|5|7|8|9])+([0-9]{8})$/,
                message: "Số điện thoại không hợp lệ (ví dụ: 0912345678)",
              },
            })}
            placeholder="Nhập số điện thoại (ví dụ: 0912345678)"
            type="tel"
            error={!!errors.phone}
            leftIcon={<Phone size={16} />}
          />
          {errors.phone && (
            <div className="flex items-center gap-1 text-[11.5px] text-error">
              <AlertCircle size={13} />
              <span>{errors.phone.message}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-bold text-text-primary">
            Địa chỉ email <span className="text-error">*</span>
          </label>
          <Input
            {...register("email", {
              required: "Vui lòng nhập địa chỉ email",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Địa chỉ email không hợp lệ (ví dụ: example@gmail.com)",
              },
            })}
            placeholder="Nhập địa chỉ email để nhận thông báo đơn hàng"
            type="email"
            error={!!errors.email}
            leftIcon={<Mail size={16} />}
          />
          {errors.email && (
            <div className="flex items-center gap-1 text-[11.5px] text-error">
              <AlertCircle size={13} />
              <span>{errors.email.message}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-bold text-text-primary">
            Tỉnh / Thành phố <span className="text-error">*</span>
          </label>
          <Controller
            name="province"
            control={control}
            rules={{ required: "Vui lòng chọn Tỉnh / Thành phố" }}
            render={({ field }) => (
              <Select
                options={PROVINCE_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                placeholder="Chọn Tỉnh / Thành phố"
                error={!!errors.province}
              />
            )}
          />
          {errors.province && (
            <div className="flex items-center gap-1 text-[11.5px] text-error">
              <AlertCircle size={13} />
              <span>{errors.province.message}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-bold text-text-primary">
          Địa chỉ nhận hàng <span className="text-error">*</span>
        </label>
        <Input
          {...register("address", {
            required: "Vui lòng nhập địa chỉ chi tiết",
            minLength: {
              value: 5,
              message: "Địa chỉ phải có ít nhất 5 ký tự",
            },
          })}
          placeholder="Nhập số nhà, tên đường, phường/xã, quận/huyện"
          error={!!errors.address}
          leftIcon={<MapPin size={16} />}
        />
        {errors.address && (
          <div className="flex items-center gap-1 text-[11.5px] text-error">
            <AlertCircle size={13} />
            <span>{errors.address.message}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-bold text-text-primary">
          Ghi chú đơn hàng
        </label>
        <div className="relative w-full">
          <div className="absolute left-3 top-3 text-text-secondary pointer-events-none">
            <FileText size={16} />
          </div>
          <textarea
            {...register("note")}
            rows={3}
            placeholder="Ghi chú thêm về đơn hàng (ví dụ: giao giờ hành chính, đóng gói quà sinh nhật...)"
            className="w-full text-text-primary text-[14px] bg-surface border border-border rounded-md py-2.5 pl-9 pr-3 outline-none placeholder-text-secondary focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200 resize-none"
          />
        </div>
      </div>
    </div>
  );
}
