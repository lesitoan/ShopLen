"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { User, Lock, Eye, EyeOff, LogIn, AlertCircle, CheckCircle2 } from "lucide-react";
import { DEFAULT_LOGIN_VALUES } from "./constants";

interface LoginFormValues {
  account: string;
  password: string;
  rememberMe: boolean;
}

export function LoginScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: DEFAULT_LOGIN_VALUES,
  });

  const onSubmit = async (data: LoginFormValues) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    try {

      setSuccessMsg("Đăng nhập thành công! Đang chuyển hướng...");

      setTimeout(() => {
        router.push("/");
      }, 800);
    } catch (err) {
      const error = err as Error;
      setErrorMsg(error.message || "Không thể kết nối đến máy chủ.");
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden select-none">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        <Card className="p-6 sm:p-8 space-y-6 shadow-2xl border-border">
          <div className="pb-3 border-b border-border text-center">
            <h2 className="text-xl font-bold text-text-highlight tracking-tight">
              Đăng nhập Hệ thống
            </h2>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-lg bg-red-500/15 border border-red-500/30 text-xs text-red-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

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
              isLoading={isSubmitting}
              className="w-full justify-center text-sm font-bold h-11"
              leftIcon={<LogIn className="w-4 h-4 shrink-0" />}
            >
              {isSubmitting ? "Đang xác thực..." : "Đăng nhập ngay"}
            </Button>
          </form>
        </Card>

        <p className="text-center text-[11px] text-text-muted">
          Tiệm Len Nhà Kiều Portal &copy; 2026. Tất cả các quyền được bảo lưu.
        </p>
      </div>
    </div>
  );
}
