"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { User, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { toast } from "react-toastify";
import { DEFAULT_LOGIN_VALUES } from "../constants";
import { useAdminLoginMutation, useLazyGetMeQuery } from "@/services/api/adminAuthApi";
import { saveAuthTokens } from "@/services/authStorage";
import { setAdminProfile } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/store/hooks";
import { getApiErrorMessage } from "@/utils/apiErrorUtils";

interface LoginFormValues {
  account: string;
  password: string;
  rememberMe: boolean;
}

export function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [adminLogin, { isLoading: isLoggingIn }] = useAdminLoginMutation();
  const [getMe] = useLazyGetMeQuery();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: DEFAULT_LOGIN_VALUES,
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const tokens = await adminLogin({
        email: data.account,
        password: data.password,
      }).unwrap();

      saveAuthTokens(tokens);

      const admin = await getMe().unwrap();
      dispatch(setAdminProfile(admin));

      toast.success("Đăng nhập thành công! Đang chuyển hướng...");

      setTimeout(() => {
        router.push("/");
      }, 500);
    } catch (err: unknown) {
      toast.error(
        getApiErrorMessage(err, "Không thể kết nối đến máy chủ.")
      );
    }
  };

  return (
    <Card className="p-6 sm:p-8 space-y-6 shadow-2xl border-border">
      <div className="pb-3 border-b border-border text-center">
        <h2 className="text-xl font-bold text-text-highlight tracking-tight">
          Đăng nhập Hệ thống
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          {...register("account", {
            required: "Vui lòng nhập email",
          })}
          error={errors.account?.message}
          placeholder="admin@tiemlen.vn"
          leftIcon={<User className="w-4 h-4 text-text-muted" />}
        />

        <div className="space-y-1">
          <Input
            label="Mật khẩu"
            type={showPassword ? "text" : "password"}
            {...register("password", {
              required: "Vui lòng nhập mật khẩu",
              minLength: {
                value: 6,
                message: "Mật khẩu phải chứa ít nhất 6 ký tự",
              },
            })}
            error={errors.password?.message}
            placeholder="Nhập mật khẩu..."
            leftIcon={<Lock className="w-4 h-4 text-text-muted" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-text-muted hover:text-text-primary transition-colors cursor-pointer pointer-events-auto flex items-center justify-center"
                title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            }
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <Controller
              name="rememberMe"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onChange={field.onChange}
                  size="sm"
                  label="Ghi nhớ đăng nhập"
                />
              )}
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoggingIn}
          className="w-full justify-center text-sm font-bold h-11"
          leftIcon={<LogIn className="w-4 h-4 shrink-0" />}
        >
          {isLoggingIn ? "Đang xác thực..." : "Đăng nhập ngay"}
        </Button>
      </form>
    </Card>
  );
}
