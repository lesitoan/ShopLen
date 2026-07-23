"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FolderTree } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { CategoryListItem, CategoryStatus } from "../constants";

interface CategoryFormData {
  code: string;
  name: string;
  slug: string;
  description?: string;
  displayOrder: number;
  status: CategoryStatus;
  images: string[];
}

interface CategoryDrawerFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: CategoryListItem | null;
  onSave: (categoryData: Omit<CategoryListItem, "id" | "createdAt" | "updatedAt" | "productCount">) => void;
}

export function CategoryDrawerForm({
  isOpen,
  onClose,
  initialData,
  onSave,
}: CategoryDrawerFormProps) {
  const isEditMode = Boolean(initialData);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    defaultValues: {
      code: initialData?.code || `CAT-${Math.floor(100 + Math.random() * 900)}`,
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      displayOrder: initialData?.displayOrder ?? 1,
      status: initialData?.status || "HIDDEN",
      images: initialData?.image ? [initialData.image] : [],
    },
  });

  // Re-fill form when editing initialData changes
  useEffect(() => {
    if (initialData) {
      reset({
        code: initialData.code,
        name: initialData.name,
        slug: initialData.slug,
        description: initialData.description || "",
        displayOrder: initialData.displayOrder,
        status: initialData.status,
        images: initialData.image ? [initialData.image] : [],
      });
    } else {
      reset({
        code: `CAT-${Math.floor(100 + Math.random() * 900)}`,
        name: "",
        slug: "",
        description: "",
        displayOrder: 1,
        status: "HIDDEN",
        images: [],
      });
    }
  }, [initialData, reset]);

  const nameVal = watch("name");
  const status = watch("status");
  const images = watch("images") || [];

  // Auto generate slug from category name
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

  const onSubmit = (data: CategoryFormData) => {
    const mainImage = data.images && data.images.length > 0 ? data.images[0] : undefined;

    onSave({
      code: data.code,
      name: data.name,
      slug: data.slug || data.name.toLowerCase().trim().replace(/\s+/g, "-"),
      description: data.description,
      displayOrder: Number(data.displayOrder),
      image: mainImage,
      status: data.status,
    });
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Mã danh mục"
              placeholder="CAT-KEYCHAIN"
              error={errors.code?.message}
              {...register("code", { required: "Vui lòng nhập mã danh mục" })}
            />

            <Input
              label="Thứ tự hiển thị"
              type="number"
              step={1}
              min={1}
              placeholder="1"
              error={errors.displayOrder?.message}
              {...register("displayOrder", {
                valueAsNumber: true,
                required: "Vui lòng nhập thứ tự hiển thị",
                min: { value: 1, message: "Thứ tự tối thiểu là 1" },
              })}
            />
          </div>

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

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-text-secondary">
              Mô tả ngắn danh mục
            </label>
            <textarea
              rows={3}
              placeholder="Nhập mô tả ngắn giới thiệu cho danh mục này..."
              className="w-full bg-surface-muted text-text-primary placeholder:text-text-muted text-xs rounded-md border border-border p-3 outline-none focus:border-primary transition-colors resize-none"
              {...register("description")}
            />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">
            Hình ảnh đại diện
          </h3>

          <ImageUploader
            label="Ảnh bìa danh mục"
            values={images}
            onChange={(urls: string[]) => {
              setValue("images", urls, { shouldValidate: true });
            }}
            maxFiles={1}
            error={errors.images?.message}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-muted/40 border border-border/60">
            <div>
              <div className="text-xs font-bold text-text-primary">Trạng thái danh mục</div>
              <div className="text-[11px] text-text-muted">
                {status === "ACTIVE" ? "Đang hiển thị trên website" : "Đang ẩn khỏi cửa hàng"}
              </div>
            </div>
            <Switch
              checked={status === "ACTIVE"}
              onChange={(checked) => setValue("status", checked ? "ACTIVE" : "HIDDEN")}
              size="md"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-surface-hover hover:bg-surface-active text-text-primary transition-colors"
          >
            Hủy bỏ
          </button>

          <button
            type="submit"
            className="px-5 py-2 text-xs font-bold text-bg-deep bg-primary hover:bg-primary-hover rounded-lg transition-all shadow-md shadow-primary/20"
          >
            {isEditMode ? "Lưu thay đổi" : "Lưu danh mục"}
          </button>
        </div>
      </form>
    </Drawer>
  );
}
