import React, { useState } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { ChevronLeft, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import { LoginFormData, AuthViewMode } from "@/types/auth.type";
import { useLazyGetMeQuery, useLoginMutation } from "@/services/api/authApi";
import { saveAuthTokens } from "@/services/authStorage";
import { useAppDispatch } from "@/store/hooks";
import { setCustomerProfile } from "@/store/slices/authSlice";
import { getApiErrorMessage } from "@/utils/apiErrorUtils";
import { toast } from "react-toastify";

import { useRouter } from "next/navigation";

interface LoginFormViewProps {
  onSwitchView: (mode: AuthViewMode) => void;
  onSubmitSuccess?: (data: LoginFormData) => void;
}

export default function LoginFormView({
  onSwitchView,
  onSubmitSuccess,
}: LoginFormViewProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [getMe, { isFetching: isFetchingProfile }] = useLazyGetMeQuery();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "demo@gmail.com",
      password: "12345678",
      rememberMe: true,
    },
    mode: "onTouched",
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const tokens = await login({
        email: data.email,
        password: data.password,
      }).unwrap();
      saveAuthTokens(tokens);
      const customer = await getMe().unwrap();
      dispatch(setCustomerProfile(customer));
      toast.success("Đăng nhập thành công.");
      if (onSubmitSuccess) {
        onSubmitSuccess(data);
      } else {
        router.push("/tai-khoan");
      }
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Đăng nhập thất bại, vui lòng thử lại."),
      );
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full text-left animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onSwitchView("LANDING")}
          className="p-1.5 -ml-1.5 text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface transition-colors flex items-center gap-1 text-[13px] font-medium"
        >
          <ChevronLeft size={18} />
          <span>Quay lại</span>
        </button>

        <Link
          href="/"
          className="text-[12.5px] font-semibold text-text-secondary hover:text-secondary transition-colors"
        >
          Bỏ qua
        </Link>
      </div>

      <div>
        <h2 className="text-[20px] font-bold text-text-primary">
          Đăng nhập
        </h2>
        <p className="text-[12.5px] text-text-secondary mt-1">
          Nhập thông tin tài khoản của bạn để tiếp tục
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-bold text-text-primary">
            Địa chỉ email
          </label>
          <Input
            {...register("email", {
              required: "Vui lòng nhập địa chỉ email",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Email không hợp lệ (ví dụ: example@gmail.com)",
              },
            })}
            type="email"
            placeholder="Nhập địa chỉ email của bạn"
            error={!!errors.email}
            leftIcon={<Mail size={16} />}
          />
          {errors.email && (
            <div className="flex items-center gap-1 text-[11.5px] text-error font-medium">
              <AlertCircle size={13} />
              <span>{errors.email.message}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-bold text-text-primary">
            Mật khẩu
          </label>
          <Input
            {...register("password", {
              required: "Vui lòng nhập mật khẩu",
              minLength: {
                value: 6,
                message: "Mật khẩu phải có ít nhất 6 ký tự",
              },
            })}
            type={showPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu"
            error={!!errors.password}
            leftIcon={<Lock size={16} />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-text-secondary hover:text-text-primary transition-colors focus:outline-none p-1"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />
          {errors.password && (
            <div className="flex items-center gap-1 text-[11.5px] text-error font-medium">
              <AlertCircle size={13} />
              <span>{errors.password.message}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-1 text-[13px]">
          <Controller
            name="rememberMe"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="rememberMe"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                label="Ghi nhớ đăng nhập"
              />
            )}
          />

          <button
            type="button"
            onClick={() => onSwitchView("FORGOT_PASSWORD")}
            className="text-[12.5px] font-semibold text-secondary hover:underline"
          >
            Quên mật khẩu?
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isLoggingIn || isFetchingProfile}
          loadingText="Đang xử lý..."
          className="w-full py-3 text-[14px] font-bold rounded-xl justify-center mt-2"
        >
          Đăng nhập
        </Button>
      </form>
    </div>
  );
}
