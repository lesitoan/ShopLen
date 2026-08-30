"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { KeyRound, Eye, EyeOff, Lock } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useUpdateStaffPasswordMutation } from "@/services/api/staffApi";
import type { AdminUserItem } from "@/types/staff.type";

interface UpdatePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: AdminUserItem | null;
  onSuccess?: () => void;
}

interface UpdatePasswordFormData {
  pw: string;
  pwConfirm: string;
}

export function UpdatePasswordModal({
  isOpen,
  onClose,
  staff,
  onSuccess,
}: UpdatePasswordModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [updatePassword, { isLoading }] = useUpdateStaffPasswordMutation();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<UpdatePasswordFormData>({
    defaultValues: {
      pw: "",
      pwConfirm: "",
    },
  });

  const pwValue = watch("pw");

  useEffect(() => {
    if (!isOpen) {
      reset({ pw: "", pwConfirm: "" });
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: UpdatePasswordFormData) => {
    if (!staff) return;

    try {
      await updatePassword({
        id: staff.id,
        body: {
          pw: data.pw,
          pwConfirm: data.pwConfirm,
        },
      }).unwrap();

      toast.success("Cập nhật mật khẩu nhân viên thành công.");
      onClose();
      onSuccess?.();
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Không thể cập nhật mật khẩu. Vui lòng thử lại."
      );
    }
  };

  const displayName = staff?.fullName || staff?.name || "Nhân viên";

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!isLoading) onClose();
      }}
      size="sm"
      title="Đổi mật khẩu nhân viên"
      description={`Cập nhật mật khẩu đăng nhập mới cho tài khoản "${displayName}" (${staff?.code || ""}).`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
        <div className="relative">
          <Input
            label="Mật khẩu mới *"
            type={showPassword ? "text" : "password"}
            placeholder="Nhập tối thiểu 8 ký tự..."
            leftIcon={<Lock className="w-4 h-4 text-text-muted" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-text-muted hover:text-text-primary p-0.5 rounded cursor-pointer transition-colors"
                title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            }
            error={errors.pw?.message}
            {...register("pw", {
              required: "Vui lòng nhập mật khẩu mới",
              minLength: {
                value: 8,
                message: "Mật khẩu phải có tối thiểu 8 ký tự",
              },
            })}
          />
        </div>

        <div className="relative">
          <Input
            label="Xác nhận mật khẩu mới *"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Nhập lại mật khẩu mới..."
            leftIcon={<KeyRound className="w-4 h-4 text-text-muted" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="text-text-muted hover:text-text-primary p-0.5 rounded cursor-pointer transition-colors"
                title={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            }
            error={errors.pwConfirm?.message}
            {...register("pwConfirm", {
              required: "Vui lòng xác nhận mật khẩu mới",
              validate: (val) =>
                val === pwValue || "Mật khẩu xác nhận không khớp",
            })}
          />
        </div>

        <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            type="button"
            onClick={onClose}
            disabled={isLoading}
          >
            Hủy bỏ
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            isLoading={isLoading}
            leftIcon={<KeyRound className="w-4 h-4" />}
          >
            Lưu mật khẩu
          </Button>
        </div>
      </form>
    </Modal>
  );
}
