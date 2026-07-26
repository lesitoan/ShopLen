"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { User, Phone, Mail, CheckCircle2 } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Radio from "@/components/ui/Radio";
import DatePicker from "@/components/ui/DatePicker";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "@/utils/apiErrorUtils";
import { useUpdateCustomerProfileMutation } from "@/services/api/customerApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCustomerProfile } from "@/store/slices/authSlice";
import type {
  CustomerSession,
  UpdateCustomerProfileRequest,
} from "@/types/auth.type";
import EmptyState from "@/components/ui/EmptyState";
import { PersonalInfoFormData } from "../types";

type FormGender = PersonalInfoFormData["gender"];

function mapFormGenderToApi(gender: FormGender): NonNullable<CustomerSession["gender"]> {
  if (gender === "Nam") return "MALE";
  if (gender === "Khác") return "OTHER";
  return "FEMALE";
}

function normalizeDateToInputFormat(dateStr?: string | null): string {
  if (!dateStr) return "";
  if (dateStr.includes("/")) {
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
  }
  if (dateStr.includes("T")) {
    return dateStr.split("T")[0];
  }
  return dateStr;
}

function buildChangedProfilePayload(
  data: PersonalInfoFormData,
  activeUser: CustomerSession,
): UpdateCustomerProfileRequest {
  const payload: UpdateCustomerProfileRequest = {};
  const fullName = data.fullName.trim();
  const phone = data.phone.trim() || null;
  const gender = mapFormGenderToApi(data.gender);
  const birthday = data.birthday.trim() || null;

  if (fullName !== activeUser.fullName) {
    payload.fullName = fullName;
  }

  if (phone !== (activeUser.phone ?? null)) {
    payload.phone = phone;
  }

  if (gender !== (activeUser.gender ?? "OTHER")) {
    payload.gender = gender;
  }

  const activeBirthdayNormalized = normalizeDateToInputFormat(activeUser.birthday);
  if (birthday !== (activeBirthdayNormalized || null)) {
    payload.birthday = birthday;
  }

  return payload;
}

export default function PersonalInfoTab() {
  const dispatch = useAppDispatch();
  const activeUser = useAppSelector((state) => state.auth.customer);

  const [updateCustomerProfile, { isLoading: isSubmitting }] =
    useUpdateCustomerProfileMutation();

  const initialGender: "Nam" | "Nữ" | "Khác" =
    activeUser?.gender === "MALE"
      ? "Nam"
      : activeUser?.gender === "FEMALE"
        ? "Nữ"
        : "Khác";

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<PersonalInfoFormData>({
    defaultValues: {
      fullName: activeUser?.fullName ?? "",
      phone: activeUser?.phone ?? "",
      email: activeUser?.email ?? "",
      gender: initialGender,
      birthday: normalizeDateToInputFormat(activeUser?.birthday),
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (activeUser) {
      reset({
        fullName: activeUser.fullName,
        phone: activeUser.phone ?? "",
        email: activeUser.email,
        gender:
          activeUser.gender === "MALE"
            ? "Nam"
            : activeUser.gender === "FEMALE"
              ? "Nữ"
              : "Khác",
        birthday: normalizeDateToInputFormat(activeUser.birthday),
      });
    }
  }, [activeUser, reset]);

  const onSubmit = async (data: PersonalInfoFormData) => {
    if (!activeUser) return;
    try {
      const payload = buildChangedProfilePayload(data, activeUser);

      if (Object.keys(payload).length === 0) {
        toast.info("Không có thông tin nào thay đổi.");
        return;
      }

      const updatedCustomer = await updateCustomerProfile(payload).unwrap();

      if (updatedCustomer) {
        dispatch(setCustomerProfile(updatedCustomer));
      }
      toast.success("Cập nhật thông tin cá nhân thành công!");
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Cập nhật thông tin thất bại, vui lòng thử lại."),
      );
    }
  };

  if (!activeUser) {
    return (
      <div className="bg-transparent border-0 p-0 sm:bg-surface sm:border sm:border-border sm:rounded-xl sm:p-8 flex items-center justify-center min-h-[350px] w-full">
        <EmptyState title="Không có dữ liệu, thử lại sau" />
      </div>
    );
  }

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
              disabled
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
            <Controller
              name="birthday"
              control={control}
              render={({ field }) => (
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  onValueChange={field.onChange}
                  disableFutureDates={true}
                  placeholder="Chọn ngày sinh (DD/MM/YYYY)"
                  error={!!errors.birthday}
                />
              )}
            />
            {errors.birthday && (
              <span className="text-[11.5px] text-error font-medium">
                {errors.birthday.message}
              </span>
            )}
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
