"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  UploadCloud,
  CheckCircle2,
  Trash2,
  Camera,
  User,
  Mail,
  Phone,
  Eye,
  EyeOff,
  Lock,
  KeyRound,
} from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/DropdownMenu";
import { Switch } from "@/components/ui/Switch";
import { useUploadImageMutation } from "@/services/api/uploadApi";
import { StaffListItem, StaffRole, MOCK_ROLES } from "../constants";

interface StaffFormData {
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  status: "ACTIVE" | "LOCKED";
  pw?: string;
  pwConfirm?: string;
}

interface StaffDrawerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<StaffListItem>) => void;
  editingStaff?: (StaffListItem & { fullName?: string }) | null;
}

export function StaffDrawerForm({
  isOpen,
  onClose,
  onSubmit,
  editingStaff,
}: StaffDrawerFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showCloseConfirmModal, setShowCloseConfirmModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<StaffFormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "STAFF_ORDER",
      status: "ACTIVE",
      pw: "",
      pwConfirm: "",
    },
  });

  const currentRole = watch("role") || "STAFF_ORDER";
  const currentStatus = watch("status") || "ACTIVE";
  const pwValue = watch("pw") || "";

  const resetForm = () => {
    reset({
      name: "",
      email: "",
      phone: "",
      role: "STAFF_ORDER",
      status: "ACTIVE",
      pw: "",
      pwConfirm: "",
    });
    setAvatarUrl(null);
    setSelectedFile(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
      setLocalPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
      setShowCloseConfirmModal(false);
    } else if (editingStaff) {
      reset({
        name: editingStaff.name || editingStaff.fullName || "",
        email: editingStaff.email || "",
        phone: editingStaff.phone || "",
        role: editingStaff.role || "STAFF_ORDER",
        status: editingStaff.status || "ACTIVE",
      });
      setAvatarUrl(editingStaff.avatar || null);
      setSelectedFile(null);
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
        setLocalPreviewUrl(null);
      }
      setShowCloseConfirmModal(false);
    } else {
      resetForm();
      setShowCloseConfirmModal(false);
    }
  }, [isOpen, editingStaff, reset]);

  // Kiểm tra có thay đổi nào chưa được lưu hay không
  const isAvatarDirty =
    selectedFile !== null || avatarUrl !== (editingStaff?.avatar || null);
  const isFormDirty = isDirty || isAvatarDirty;

  const handleRequestClose = () => {
    if (isFormDirty) {
      setShowCloseConfirmModal(true);
    } else {
      onClose();
    }
  };

  const handleConfirmDiscard = () => {
    setShowCloseConfirmModal(false);
    resetForm();
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn tệp hình ảnh (PNG, JPG, WEBP)");
        return;
      }
      setSelectedFile(file);
      setLocalPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUploadAvatar = async () => {
    if (!selectedFile) return;

    try {
      const response = await uploadImage({
        file: selectedFile,
        target: "USER_AVATAR",
      }).unwrap();

      setAvatarUrl(response.url);
      setSelectedFile(null);
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
        setLocalPreviewUrl(null);
      }
      toast.success("Tải ảnh đại diện lên thành công.");
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Tải ảnh thất bại, vui lòng thử lại."
      );
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl(null);
    setSelectedFile(null);
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
      setLocalPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onFormSubmit = async (formData: StaffFormData) => {
    let finalAvatar = avatarUrl;

    // Nếu còn file chưa bấm nút "Lưu ảnh", tự động upload trước khi submit
    if (selectedFile) {
      try {
        const response = await uploadImage({
          file: selectedFile,
          target: "USER_AVATAR",
        }).unwrap();
        finalAvatar = response.url;
        setAvatarUrl(response.url);
        setSelectedFile(null);
      } catch (error: any) {
        toast.error(
          error?.data?.message ||
            error?.message ||
            "Không thể tải ảnh đại diện lên. Vui lòng thử lại."
        );
        return;
      }
    }

    const selectedRole = MOCK_ROLES.find((r) => r.key === formData.role);

    onSubmit({
      id: editingStaff?.id,
      name: formData.name.trim(),
      fullName: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone?.trim() || undefined,
      role: formData.role,
      roleName: selectedRole ? selectedRole.name : "Nhân viên",
      status: formData.status,
      avatar: finalAvatar || undefined,
      pw: formData.pw,
      pwConfirm: formData.pwConfirm,
    });
  };

  const displayImageSrc = localPreviewUrl || avatarUrl;

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={handleRequestClose}
        title={
          editingStaff ? "Chỉnh sửa thông tin nhân viên" : "Thêm mới nhân viên"
        }
        description={
          editingStaff
            ? `Cập nhật thông tin và vai trò của nhân viên ${editingStaff.code}`
            : "Tạo tài khoản truy cập hệ thống quản trị cho nhân viên mới"
        }
        size="md"
      >
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
          <Input
            label="Họ và tên nhân viên *"
            type="text"
            leftIcon={<User className="w-4 h-4" />}
            placeholder="Nhập đầy đủ họ tên nhân viên..."
            error={errors.name?.message}
            {...register("name", {
              required: "Vui lòng nhập họ và tên nhân viên",
              minLength: {
                value: 2,
                message: "Họ và tên tối thiểu 2 ký tự",
              },
            })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Địa chỉ Email *"
              type="email"
              leftIcon={<Mail className="w-4 h-4" />}
              placeholder="example@tiemlennhakieu.vn"
              error={errors.email?.message}
              {...register("email", {
                required: "Vui lòng nhập địa chỉ email",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Địa chỉ email không hợp lệ",
                },
              })}
            />

            <Input
              label="Số điện thoại"
              type="tel"
              leftIcon={<Phone className="w-4 h-4" />}
              placeholder="0901234567 (tùy chọn)"
              error={errors.phone?.message}
              {...register("phone")}
            />
          </div>

          {!editingStaff && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Mật khẩu *"
                type={showPassword ? "text" : "password"}
                leftIcon={<Lock className="w-4 h-4 text-text-muted" />}
                placeholder="Tối thiểu 8 ký tự..."
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
                  required: !editingStaff ? "Vui lòng nhập mật khẩu" : false,
                  minLength: {
                    value: 8,
                    message: "Mật khẩu phải có tối thiểu 8 ký tự",
                  },
                })}
              />

              <Input
                label="Xác nhận mật khẩu *"
                type={showConfirmPassword ? "text" : "password"}
                leftIcon={<KeyRound className="w-4 h-4 text-text-muted" />}
                placeholder="Nhập lại mật khẩu..."
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
                  required:
                    !editingStaff ? "Vui lòng xác nhận mật khẩu" : false,
                  validate: (val) =>
                    !editingStaff && val !== pwValue
                      ? "Mật khẩu xác nhận không khớp"
                      : true,
                })}
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-text-secondary">
              Vai trò / Phân quyền *
            </label>
            <DropdownMenu
              variant="surface"
              label={
                MOCK_ROLES.find((r) => r.key === currentRole)?.name ??
                "Chọn vai trò"
              }
              selectedKey={currentRole}
              items={MOCK_ROLES.map<DropdownMenuItem>((r) => ({
                key: r.key,
                label: r.name,
              }))}
              onSelect={(key) =>
                setValue("role", key as StaffRole, { shouldDirty: true })
              }
              className="w-full"
            />
            <p className="text-[11px] text-text-muted">
              {MOCK_ROLES.find((r) => r.key === currentRole)?.description}
            </p>
          </div>

          {/* Upload Avatar */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-text-secondary">
              Ảnh đại diện
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {displayImageSrc ? (
              <div className="relative p-3 rounded-xl bg-surface-muted/50 border border-border flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="relative w-14 h-14 rounded-full bg-surface border-2 border-primary/40 overflow-hidden shrink-0 flex items-center justify-center">
                    <Image
                      src={displayImageSrc}
                      alt="Staff avatar preview"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    {selectedFile ? (
                      <div>
                        <p
                          className="text-xs font-bold text-text-primary truncate max-w-[140px] sm:max-w-[180px]"
                          title={selectedFile.name}
                        >
                          {selectedFile.name}
                        </p>
                        <p className="text-[11px] text-text-muted">
                          {(selectedFile.size / 1024).toFixed(1)} KB • Chưa lưu ảnh
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs font-bold text-status-success flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Ảnh đã sẵn sàng</span>
                        </p>
                        <p
                          className="text-[11px] text-text-muted truncate max-w-[140px] sm:max-w-[180px]"
                          title={avatarUrl || undefined}
                        >
                          {avatarUrl}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {selectedFile && (
                    <button
                      type="button"
                      onClick={handleUploadAvatar}
                      disabled={isUploading}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-bg-deep font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>{isUploading ? "Đang lưu..." : "Lưu ảnh"}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    disabled={isUploading}
                    title="Gỡ ảnh này"
                    className="p-2 rounded-lg text-text-muted hover:text-status-danger hover:bg-status-danger/10 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2 p-5 rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-surface-muted/40 hover:bg-surface-muted transition-all cursor-pointer select-none text-center"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-text-primary">
                    Nhấp để tải lên ảnh đại diện nhân viên
                  </p>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    Định dạng PNG, JPG, WEBP (Tối đa 5MB)
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-lg bg-surface-muted border border-border">
            <div>
              <div className="text-xs font-bold text-text-primary">
                Trạng thái tài khoản
              </div>
              <div className="text-[11px] text-text-muted">
                Cho phép nhân viên đăng nhập vào hệ thống
              </div>
            </div>
            <Switch
              checked={currentStatus === "ACTIVE"}
              onChange={(checked) =>
                setValue("status", checked ? "ACTIVE" : "LOCKED", {
                  shouldDirty: true,
                })
              }
            />
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRequestClose}
              type="button"
              disabled={isUploading}
            >
              Hủy bỏ
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={isUploading}
            >
              {isUploading
                ? "Đang lưu ảnh..."
                : editingStaff
                ? "Lưu thay đổi"
                : "Tạo tài khoản"}
            </Button>
          </div>
        </form>
      </Drawer>

      {/* Modal xác nhận thoát khi có thay đổi chưa lưu */}
      <Modal
        isOpen={showCloseConfirmModal}
        onClose={() => setShowCloseConfirmModal(false)}
        onConfirm={handleConfirmDiscard}
        type="DANGER"
        title="Xác nhận đóng form"
        description="Bạn có thay đổi chưa được lưu. Bạn có chắc chắn muốn đóng form mà không lưu các thay đổi này không?"
        confirmText="Rời khỏi"
        cancelText="Tiếp tục chỉnh sửa"
        size="sm"
      />
    </>
  );
}
