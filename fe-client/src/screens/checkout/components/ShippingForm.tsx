import React from "react";
import { UseFormRegister, FieldErrors, Control, Controller } from "react-hook-form";
import { AlertCircle, User, Phone, MapPin, FileText, Plus } from "lucide-react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { CheckoutFormData } from "../types";
import { PROVINCE_OPTIONS } from "@/constants/location";
import { CustomerAddress } from "@/services/api/customerAddressApi";

interface ShippingFormProps {
  register: UseFormRegister<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
  control: Control<CheckoutFormData>;
  addresses: CustomerAddress[];
  selectedAddressId: string | null;
  onSelectAddress: (address: CustomerAddress) => void;
  isAddingNewAddress: boolean;
  onToggleAddNewAddress: (show: boolean) => void;
}

export default function ShippingForm({
  register,
  errors,
  control,
  addresses,
  selectedAddressId,
  onSelectAddress,
  isAddingNewAddress,
  onToggleAddNewAddress,
}: ShippingFormProps) {
  const hasSavedAddresses = addresses && addresses.length > 0;

  return (
    <div className="bg-surface border-y md:border border-border rounded-none md:rounded-xl p-4 md:p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h2 className="text-[16px] font-bold text-text-primary flex items-center gap-2">
          <User size={18} className="text-secondary" />
          <span>Thông tin nhận hàng</span>
        </h2>
        {hasSavedAddresses && !isAddingNewAddress && (
          <button
            type="button"
            onClick={() => onToggleAddNewAddress(true)}
            className="text-[12.5px] font-semibold text-secondary hover:underline flex items-center gap-1"
          >
            <Plus size={14} />
            <span>Thêm địa chỉ mới</span>
          </button>
        )}
        {hasSavedAddresses && isAddingNewAddress && (
          <button
            type="button"
            onClick={() => onToggleAddNewAddress(false)}
            className="text-[12.5px] font-semibold text-secondary hover:underline"
          >
            ← Chọn địa chỉ đã lưu
          </button>
        )}
      </div>

      {/* DANH SÁCH ĐỊA CHỈ ĐÃ LƯU (Mặc định hiển thị nếu user có địa chỉ & không ở chế độ thêm mới) */}
      {hasSavedAddresses && !isAddingNewAddress && (
        <div className="flex flex-col gap-3">
          <label className="text-[13px] font-bold text-text-primary">
            Chọn địa chỉ giao hàng:
          </label>
          <div className="flex flex-col gap-2.5">
            {addresses.map((item) => {
              const isSelected = selectedAddressId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectAddress(item)}
                  className={`cursor-pointer border rounded-xl p-3.5 flex items-start gap-3 transition-all ${
                    isSelected
                      ? "border-primary bg-primary-light/10 ring-1 ring-primary/30"
                      : "border-border bg-background/30 hover:border-border-dark"
                  }`}
                >
                  <div className="pt-0.5 shrink-0">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected
                          ? "border-primary bg-primary text-white"
                          : "border-border bg-surface"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[13.5px] font-bold text-text-primary">
                        {item.fullName}
                      </span>
                      <span className="text-[12.5px] text-text-secondary">
                        • {item.phone}
                      </span>
                      {item.isDefault && (
                        <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10.5px] font-bold">
                          Mặc định
                        </span>
                      )}
                    </div>
                    <p className="text-[12.5px] text-text-secondary mt-1 flex items-start gap-1">
                      <MapPin size={14} className="shrink-0 text-secondary mt-0.5" />
                      <span>
                        {item.addressLine}, {item.provinceName}
                      </span>
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Option "Sử dụng địa chỉ khác" */}
            <div
              onClick={() => onToggleAddNewAddress(true)}
              className="cursor-pointer border border-dashed border-border hover:border-primary/60 rounded-xl p-3.5 flex items-center gap-2.5 text-text-secondary hover:text-primary transition-all bg-background/20"
            >
              <div className="w-4 h-4 rounded-full border border-border flex items-center justify-center shrink-0">
                <Plus size={12} />
              </div>
              <span className="text-[13px] font-semibold">
                Sử dụng địa chỉ giao hàng khác...
              </span>
            </div>
          </div>
        </div>
      )}

      {/* FORM NHẬP ĐỊA CHỈ (Hiện khi user chưa có địa chỉ nào OR bấm "Thêm địa chỉ mới" / "Sử dụng địa chỉ khác") */}
      {(!hasSavedAddresses || isAddingNewAddress) && (
        <div className="flex flex-col gap-4">
          {hasSavedAddresses && (
            <div className="p-3 bg-primary-light/10 border border-primary/20 rounded-lg text-[12.5px] text-text-secondary flex items-center justify-between">
              <span>Đang ở chế độ nhập địa chỉ giao hàng mới</span>
              <button
                type="button"
                onClick={() => onToggleAddNewAddress(false)}
                className="text-secondary font-bold hover:underline"
              >
                Hủy & chọn lại
              </button>
            </div>
          )}

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
        </div>
      )}

      {/* GHI CHÚ ĐƠN HÀNG */}
      <div className="flex flex-col gap-1.5 pt-2 border-t border-border/50">
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
