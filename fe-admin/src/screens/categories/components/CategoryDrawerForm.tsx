"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { FolderTree, UploadCloud, CheckCircle2, Image as ImageIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import { Drawer } from "@/components/ui/Drawer";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useUploadImageMutation } from "@/services/api/uploadApi";
import type { AdminCategoryItem } from "@/types/category.type";
import { toast } from "react-toastify";

interface CategoryFormData {
  name: string;
  slug: string;
}

interface CategoryDrawerFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: AdminCategoryItem | null;
  onSave: (payload: { name: string; slug: string; image?: string | null }) => void;
  isLoading?: boolean;
}

export function CategoryDrawerForm({
  isOpen,
  onClose,
  initialData,
  onSave,
  isLoading = false,
}: CategoryDrawerFormProps) {
  const isEditMode = Boolean(initialData);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(initialData?.image || null);
  const [showCloseConfirmModal, setShowCloseConfirmModal] = useState(false);

  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
    },
  });

  const resetForm = () => {
    reset({
      name: "",
      slug: "",
    });
    setImageUrl(null);
    setSelectedFile(null);
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
    } else if (initialData) {
      reset({
        name: initialData.name,
        slug: initialData.slug,
      });
      setImageUrl(initialData.image || null);
      setSelectedFile(null);
      setLocalPreviewUrl(null);
    } else {
      resetForm();
    }
  }, [isOpen, initialData, reset]);

  const nameVal = watch("name") || "";
  const slugVal = watch("slug") || "";

  // Auto generate slug from category name when creating new category
  useEffect(() => {
    if (nameVal && !isEditMode) {
      const generatedSlug = nameVal
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "d")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");

      setValue("slug", generatedSlug);
    }
  }, [nameVal, isEditMode, setValue]);

  // Check if user made any changes compared to initial state
  const isNameDirty = nameVal.trim() !== (initialData?.name || "").trim();
  const isSlugDirty = slugVal.trim() !== (initialData?.slug || "").trim();
  const isImageDirty =
    selectedFile !== null || imageUrl !== (initialData?.image || null);

  const isFormDirty = isNameDirty || isSlugDirty || isImageDirty;

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

  const handleUploadImage = async () => {
    if (!selectedFile) return;

    try {
      const response = await uploadImage({
        file: selectedFile,
        target: "CATEGORY",
      }).unwrap();

      setImageUrl(response.url);
      setSelectedFile(null);
      setLocalPreviewUrl(null);
      toast.success("Tải ảnh lên thành công.");
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.message || "Tải ảnh thất bại, vui lòng thử lại."
      );
    }
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
    setSelectedFile(null);
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
      setLocalPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const hasUnsavedFile = Boolean(selectedFile);
  const displayImageSrc = localPreviewUrl || imageUrl;

  const onSubmit = (data: CategoryFormData) => {
    if (hasUnsavedFile) {
      toast.warning("Vui lòng nhấn 'Lưu ảnh' trước khi lưu danh mục!");
      return;
    }

    onSave({
      name: data.name,
      slug: data.slug || data.name.toLowerCase().trim().replace(/\s+/g, "-"),
      image: imageUrl,
    });
  };

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={handleRequestClose}
        title={isEditMode ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
        description={
          isEditMode
            ? `Cập nhật thông tin danh mục ${initialData?.code}`
            : "Tạo danh mục sản phẩm mới để phân loại hàng hóa trên cửa hàng"
        }
        size="third"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Thông tin danh mục
            </h3>

            <Input
              label="Tên danh mục"
              placeholder="Móc khóa len, Hoa len bó..."
              leftIcon={<FolderTree className="w-4 h-4 text-text-muted" />}
              error={errors.name?.message}
              {...register("name", {
                required: "Vui lòng nhập tên danh mục",
                minLength: { value: 2, message: "Tên danh mục phải từ 2 ký tự trở lên" },
              })}
            />

            <Input
              label="Đường dẫn (Slug)"
              placeholder="moc-khoa-len"
              error={errors.slug?.message}
              {...register("slug", { required: "Vui lòng nhập đường dẫn danh mục" })}
            />
          </div>

          {/* Section Upload Ảnh Đại Diện */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">
                Hình ảnh đại diện
              </h3>
              {hasUnsavedFile && (
                <span className="text-[11px] font-semibold text-status-warning animate-pulse">
                  • Cần bấm "Lưu ảnh"
                </span>
              )}
            </div>

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
                  <div className="relative w-14 h-14 rounded-lg bg-surface border border-border overflow-hidden shrink-0">
                    <Image
                      src={displayImageSrc}
                      alt="Category image preview"
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
                          {(selectedFile.size / 1024).toFixed(1)} KB - Chưa tải lên
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
                          title={imageUrl || undefined}
                        >
                          {imageUrl}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Nút "Lưu ảnh" khi người dùng chọn ảnh mới */}
                  {selectedFile && (
                    <button
                      type="button"
                      onClick={handleUploadImage}
                      disabled={isUploading}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-bg-deep font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>{isUploading ? "Đang lưu..." : "Lưu ảnh"}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={isUploading}
                    title="Xóa ảnh này"
                    className="p-2 rounded-lg text-text-muted hover:text-status-danger hover:bg-status-danger/10 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-surface-muted/40 hover:bg-surface-muted transition-all cursor-pointer select-none text-center"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-text-primary">
                    Nhấp vào đây để chọn ảnh danh mục từ máy tính
                  </p>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    Hỗ trợ các định dạng PNG, JPG, WEBP (Tối đa 5MB)
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={handleRequestClose}
              disabled={isLoading || isUploading}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-surface-hover hover:bg-surface-active text-text-primary transition-colors cursor-pointer disabled:opacity-50"
            >
              Hủy bỏ
            </button>

            <button
              type="submit"
              disabled={isLoading || isUploading || hasUnsavedFile}
              title={
                hasUnsavedFile
                  ? "Vui lòng bấm 'Lưu ảnh' trước khi lưu danh mục"
                  : undefined
              }
              className="px-5 py-2 text-xs font-bold text-bg-deep bg-primary hover:bg-primary-hover rounded-lg transition-all shadow-md shadow-primary/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading
                ? "Đang lưu ảnh..."
                : isLoading
                ? "Đang lưu danh mục..."
                : isEditMode
                ? "Lưu thay đổi"
                : "Lưu danh mục"}
            </button>
          </div>
        </form>
      </Drawer>

      <Modal
        isOpen={showCloseConfirmModal}
        onClose={() => setShowCloseConfirmModal(false)}
        onConfirm={handleConfirmDiscard}
        type="WARNING"
        title="Xác nhận hủy thay đổi"
        description="Thông tin danh mục đã được thay đổi. Bạn có chắc chắn muốn bỏ qua các thay đổi này và đóng lại không?"
        confirmText="Bỏ thay đổi"
        cancelText="Tiếp tục sửa"
        size="sm"
      />
    </>
  );
}
