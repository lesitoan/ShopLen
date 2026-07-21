"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { User, Phone, Mail, Calendar, CheckCircle2 } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Radio from "@/components/ui/Radio";
import { UserProfile, PersonalInfoFormData } from "../types";

interface PersonalInfoTabProps {
  user: UserProfile;
  onUpdateSuccess?: (updated: UserProfile) => void;
}

export default function PersonalInfoTab({
  user,
  onUpdateSuccess,
}: PersonalInfoTabProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PersonalInfoFormData>({
    defaultValues: {
      fullName: user.fullName,
      phone: user.phone,
      email: user.email,
      gender: user.gender,
      birthday: user.birthday,
    },
    mode: "onTouched",
  });

  const onSubmit = (data: PersonalInfoFormData) => {
    setIsSubmitting(true);
    setSavedSuccess(false);

    setTimeout(() => {
      setIsSubmitting(false);
      setSavedSuccess(true);
      if (onUpdateSuccess) {
        onUpdateSuccess({
          ...user,
          fullName: data.fullName,
          phone: data.phone,
          email: data.email,
          gender: data.gender,
          birthday: data.birthday,
        });
      }
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 700);
  };

  return (
    <div className="bg-transparent border-0 p-0 sm:bg-surface sm:border sm:border-border sm:rounded-xl sm:p-6 flex flex-col gap-6 text-left">
      <div className="hidden md:block">
        <h2 className="text-[18px] font-bold text-text-primary">
          Thông tin cá nhân
        </h2>
        <p className="text-[12.5px] text-text-secondary mt-1">
          Quản lý thông tin hồ sơ của bạn để phục vụ việc giao nhận hàng nhanh chóng
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-[13px] font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 size={16} />
          <span>Cập nhật thông tin cá nhân thành công!</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-bold text-text-primary">
            Họ và tên <span className="text-error">*</span>
          </label>
          <Input
            {...register("fullName", { required: "Vui lòng nhập họ và tên" })}
            type="text"
            placeholder="Nhập họ và tên"
            error={!!errors.fullName}
            leftIcon={<User size={16} />}
          />
          {errors.fullName && (
            <span className="text-[11.5px] text-error font-medium">
              {errors.fullName.message}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-text-primary">
              Số điện thoại <span className="text-error">*</span>
            </label>
            <Input
              {...register("phone", { required: "Vui lòng nhập số điện thoại" })}
              type="text"
              placeholder="Nhập số điện thoại"
              error={!!errors.phone}
              leftIcon={<Phone size={16} />}
            />
            {errors.phone && (
              <span className="text-[11.5px] text-error font-medium">
                {errors.phone.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-text-primary">
              Địa chỉ Email <span className="text-error">*</span>
            </label>
            <Input
              {...register("email", { required: "Vui lòng nhập email" })}
              type="email"
              placeholder="Nhập email"
              error={!!errors.email}
              leftIcon={<Mail size={16} />}
            />
            {errors.email && (
              <span className="text-[11.5px] text-error font-medium">
                {errors.email.message}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-text-primary">
              Giới tính
            </label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-5 pt-1">
                  {(["Nam", "Nữ", "Khác"] as const).map((g) => (
                    <Radio
                      key={g}
                      id={`gender-${g}`}
                      name="gender"
                      value={g}
                      checked={field.value === g}
                      onChange={() => field.onChange(g)}
                      label={g}
                    />
                  ))}
                </div>
              )}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-text-primary">
              Ngày sinh
            </label>
            <Input
              {...register("birthday")}
              type="text"
              placeholder="DD/MM/YYYY"
              leftIcon={<Calendar size={16} />}
            />
          </div>
        </div>

        <div className="pt-3">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            loadingText="Đang lưu thông tin..."
            className="w-full sm:w-auto justify-center px-6 py-3 font-bold rounded-lg text-[14px]"
          >
            Lưu thay đổi
          </Button>
        </div>
      </form>
    </div>
  );
}
