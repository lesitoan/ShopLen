"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { MapPin, User, Phone, AlertCircle } from "lucide-react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "@/utils/apiErrorUtils";
import { useCreateCustomerAddressMutation } from "@/services/api/customerAddressApi";
import { PROVINCE_OPTIONS } from "@/constants/location";

export interface AddressFormData {
  fullName: string;
  phone: string;
  address: string;
  province: string;
  isDefault?: boolean;
}

interface AddAddressFormProps {
  onCancel: () => void;
  onSuccess: () => void;
  isFirstAddress: boolean;
}

export default function AddAddressForm({
  onCancel,
  onSuccess,
  isFirstAddress,
}: AddAddressFormProps) {
  const [createCustomerAddress, { isLoading: isCreating }] =
    useCreateCustomerAddressMutation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AddressFormData>({
    defaultValues: {
      fullName: "",
      phone: "",
      address: "",
      province: "",
      isDefault: isFirstAddress,
    },
    mode: "onTouched",
  });

  const handleAddAddress = async (data: AddressFormData) => {
    const provinceObj = PROVINCE_OPTIONS.find((opt) => opt.value === data.province);
    const provinceName = provinceObj ? provinceObj.label : data.province;

    try {
      await createCustomerAddress({
        fullName: data.fullName.trim(),
        phone: data.phone.trim(),
        provinceName: provinceName.trim(),
        addressLine: data.address.trim(),
        isDefault: Boolean(data.isDefault || isFirstAddress),
      }).unwrap();

      toast.success("Thêm địa chỉ giao hàng thành công!");
      reset();
      onSuccess();
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Thêm địa chỉ thất bại, vui lòng thử lại.")
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleAddAddress)}
      className="p-0 border-0 bg-transparent rounded-none sm:p-5 sm:border sm:border-primary/30 sm:bg-primary-light/20 sm:rounded-lg flex flex-col gap-4 animate-in fade-in duration-200"
    >
      <span className="text-[14px] font-bold text-text-primary">
        Thêm địa chỉ giao hàng mới
      </span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-bold text-text-primary">
            Họ và tên người nhận <span className="text-error">*</span>
          </label>
          <Input
            {...register("fullName", {
              required: "Vui lòng nhập họ và tên người nhận",
              minLength: {
                value: 2,
                message: "Họ và tên phải có ít nhất 2 ký tự",
              },
            })}
            placeholder="Họ và tên người nhận"
            error={!!errors.fullName}
            leftIcon={<User size={16} />}
          />
          {errors.fullName && (
            <div className="flex items-center gap-1 text-[11.5px] text-error font-medium">
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
            placeholder="Số điện thoại người nhận"
            type="tel"
            error={!!errors.phone}
            leftIcon={<Phone size={16} />}
          />
          {errors.phone && (
            <div className="flex items-center gap-1 text-[11.5px] text-error font-medium">
              <AlertCircle size={13} />
              <span>{errors.phone.message}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="flex items-center gap-1 text-[11.5px] text-error font-medium">
              <AlertCircle size={13} />
              <span>{errors.province.message}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-bold text-text-primary">
            Địa chỉ chi tiết <span className="text-error">*</span>
          </label>
          <Input
            {...register("address", {
              required: "Vui lòng nhập địa chỉ chi tiết",
              minLength: {
                value: 5,
                message: "Địa chỉ phải có ít nhất 5 ký tự",
              },
            })}
            placeholder="Tòa nhà, số nhà, tên đường, phường/xã"
            error={!!errors.address}
            leftIcon={<MapPin size={16} />}
          />
          {errors.address && (
            <div className="flex items-center gap-1 text-[11.5px] text-error font-medium">
              <AlertCircle size={13} />
              <span>{errors.address.message}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 w-full">
        <Controller
          name="isDefault"
          control={control}
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              label="Đặt làm địa chỉ mặc định"
            />
          )}
        />

        <div className="grid grid-cols-2 sm:flex items-center justify-end gap-2.5 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            size="md"
            disabled={isCreating}
            onClick={onCancel}
            className="w-full sm:w-auto rounded-lg text-[13px] py-2.5 px-4 justify-center"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isCreating}
            loadingText="Đang lưu..."
            className="w-full sm:w-auto rounded-lg text-[13px] font-bold py-2.5 px-5 justify-center"
          >
            Lưu địa chỉ
          </Button>
        </div>
      </div>
    </form>
  );
}
