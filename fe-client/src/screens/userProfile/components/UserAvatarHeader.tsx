"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Camera, Check, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "@/utils/apiErrorUtils";
import { useUpdateCustomerAvatarMutation } from "@/services/api/customerApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCustomerProfile } from "@/store/slices/authSlice";
import type { CustomerSession } from "@/types/auth.type";

interface UserAvatarHeaderProps {
  subtitle?: string;
  avatarSizeClass?: string;
  avatarImageSize?: string;
}

export default function UserAvatarHeader({
  subtitle,
  avatarSizeClass = "w-12 h-12",
  avatarImageSize = "48px",
}: UserAvatarHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const activeUser = useAppSelector((state) => state.auth.customer);

  const [updateCustomerAvatar] = useUpdateCustomerAvatarMutation();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Vui lòng chọn ảnh định dạng JPG, PNG hoặc WebP!");
      return;
    }

    const maxSizeBytes = 2 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error("Vui lòng chọn ảnh nhỏ dưới 2MB!");
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleCancelPreview = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveAvatar = async () => {
    if (!selectedFile || !previewUrl) return;

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("avatar", selectedFile);
      const updatedCustomer = await updateCustomerAvatar(formData).unwrap();
      if (updatedCustomer) {
        dispatch(setCustomerProfile(updatedCustomer));
      }
      toast.success("Cập nhật ảnh đại diện thành công!");
      setPreviewUrl(null);
      setSelectedFile(null);
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Cập nhật avatar thất bại, vui lòng thử lại."),
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!activeUser) return null;

  const activeAvatar = previewUrl || activeUser.avatar || "/logo.png";
  const displaySubtitle = subtitle ?? activeUser.phone ?? "";

  return (
    <div className="flex flex-col gap-3 w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg, image/png, image/webp"
        className="hidden"
      />

      <div className="flex items-center gap-3.5">
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`relative ${avatarSizeClass} rounded-full overflow-hidden border-2 border-primary/30 bg-background shrink-0 group cursor-pointer shadow-xs`}
          title="Đổi ảnh đại diện"
        >
          <Image
            src={activeAvatar}
            alt={activeUser.fullName}
            fill
            sizes={avatarImageSize}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
            <Camera size={16} />
          </div>
        </div>

        <div className="flex flex-col min-w-0 text-left flex-1">
          <span className="text-[14.5px] font-bold text-text-primary truncate">
            {activeUser.fullName}
          </span>
          {displaySubtitle && (
            <span className="text-[12px] text-text-secondary truncate mt-0.5">
              {displaySubtitle}
            </span>
          )}
        </div>
      </div>

      {previewUrl && (
        <div className="flex items-center gap-2 pt-1">
          <Button
            type="button"
            variant="primary"
            size="sm"
            isLoading={isSaving}
            loadingText="Đang lưu..."
            onClick={handleSaveAvatar}
            className="py-1 px-3 text-[12px] font-bold rounded-lg flex-1 justify-center"
          >
            <Check size={14} className="mr-1" />
            Lưu
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isSaving}
            onClick={handleCancelPreview}
            className="py-1 px-3 text-[12px] font-semibold rounded-lg text-text-secondary hover:text-text-primary"
          >
            <X size={14} className="mr-1" />
            Hủy
          </Button>
        </div>
      )}
    </div>
  );
}
