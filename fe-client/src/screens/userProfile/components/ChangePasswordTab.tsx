"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "@/utils/apiErrorUtils";
import { useChangePasswordMutation } from "@/services/api/customerApi";
import { clearAuthTokens } from "@/services/authStorage";
import { useAppDispatch } from "@/store/hooks";
import { clearAuthState } from "@/store/slices/authSlice";
import { ChangePasswordFormData } from "../types";

export default function ChangePasswordTab() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const [changePassword, { isLoading: isSubmitting }] =
    useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  const newPasswordValue = watch("newPassword");

  const onSubmit = async (data: ChangePasswordFormData) => {
    setSuccessMsg(false);
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      }).unwrap();

      setSuccessMsg(true);
      toast.success("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
      reset();

      clearAuthTokens();
      dispatch(clearAuthState());
      router.push("/dang-nhap");
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Đổi mật khẩu thất bại, vui lòng thử lại."),
      );
    }
  };

  return (
    <div className="bg-transparent border-0 p-0 sm:bg-surface sm:border sm:border-border sm:rounded-xl sm:p-6 flex flex-col gap-6 text-left">
      <div className="hidden md:block">
        <h2 className="text-[18px] font-bold text-text-primary">
          Đổi mật khẩu
        </h2>
        <p className="text-[12.5px] text-text-secondary mt-1">
          Bảo mật tài khoản của bạn bằng mật khẩu mạnh dài ít nhất 6 ký tự
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-[13px] font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 size={16} />
          <span>Đổi mật khẩu tài khoản thành công!</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-bold text-text-primary">
            Mật khẩu hiện tại <span className="text-error">*</span>
          </label>
          <Input
            {...register("currentPassword", {
              required: "Vui lòng nhập mật khẩu hiện tại",
            })}
            type={showCurrent ? "text" : "password"}
            placeholder="Nhập mật khẩu hiện tại"
            error={!!errors.currentPassword}
            leftIcon={<Lock size={16} />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowCurrent((prev) => !prev)}
                className="text-text-secondary hover:text-text-primary focus:outline-none p-1"
              >
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />
          {errors.currentPassword && (
            <span className="text-[11.5px] text-error font-medium">
              {errors.currentPassword.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-bold text-text-primary">
            Mật khẩu mới <span className="text-error">*</span>
          </label>
          <Input
            {...register("newPassword", {
              required: "Vui lòng nhập mật khẩu mới",
              minLength: {
                value: 6,
                message: "Mật khẩu mới phải có ít nhất 6 ký tự",
              },
            })}
            type={showNew ? "text" : "password"}
            placeholder="Nhập mật khẩu mới"
            error={!!errors.newPassword}
            leftIcon={<Lock size={16} />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowNew((prev) => !prev)}
                className="text-text-secondary hover:text-text-primary focus:outline-none p-1"
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />
          {errors.newPassword && (
            <span className="text-[11.5px] text-error font-medium">
              {errors.newPassword.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-bold text-text-primary">
            Xác nhận mật khẩu mới <span className="text-error">*</span>
          </label>
          <Input
            {...register("confirmPassword", {
              required: "Vui lòng xác nhận mật khẩu mới",
              validate: (val) =>
                val === newPasswordValue || "Mật khẩu xác nhận không khớp",
            })}
            type={showConfirm ? "text" : "password"}
            placeholder="Nhập lại mật khẩu mới"
            error={!!errors.confirmPassword}
            leftIcon={<Lock size={16} />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirm((prev) => !prev)}
                className="text-text-secondary hover:text-text-primary focus:outline-none p-1"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />
          {errors.confirmPassword && (
            <span className="text-[11.5px] text-error font-medium">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <div className="pt-3">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            loadingText="Đang đổi mật khẩu..."
            className="w-full sm:w-auto justify-center px-6 py-3 font-bold rounded-lg text-[14px]"
          >
            Đổi mật khẩu
          </Button>
        </div>
      </form>
    </div>
  );
}
