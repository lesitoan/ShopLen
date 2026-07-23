"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Package, Layers } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { Input } from "@/components/ui/Input";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { Switch } from "@/components/ui/Switch";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { MOCK_CATEGORIES, ProductListItem, ProductStatus } from "../constants";

interface ProductFormData {
  code: string;
  name: string;
  categoryId: string;
  originalPrice: number;
  salePrice?: number;
  stockQuantity: number;
  status: ProductStatus;
  images: string[];
}

interface ProductDrawerFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ProductListItem | null;
  onSave: (productData: Omit<ProductListItem, "id" | "updatedAt">) => void;
}

export function ProductDrawerForm({
  isOpen,
  onClose,
  initialData,
  onSave,
}: ProductDrawerFormProps) {
  const isEditMode = Boolean(initialData);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      code: initialData?.code || `SP-LEN-${Math.floor(100 + Math.random() * 900)}`,
      name: initialData?.name || "",
      categoryId: initialData?.categoryId || MOCK_CATEGORIES[0]?.id || "CAT-KEYCHAIN",
      originalPrice: initialData?.originalPrice || 75000,
      salePrice: initialData?.salePrice,
      stockQuantity: initialData?.stockQuantity ?? 10,
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
        categoryId: initialData.categoryId,
        originalPrice: initialData.originalPrice,
        salePrice: initialData.salePrice,
        stockQuantity: initialData.stockQuantity,
        status: initialData.status,
        images: initialData.image ? [initialData.image] : [],
      });
    } else {
      reset({
        code: `SP-LEN-${Math.floor(100 + Math.random() * 900)}`,
        name: "",
        categoryId: MOCK_CATEGORIES[0]?.id || "CAT-KEYCHAIN",
        originalPrice: 75000,
        salePrice: undefined,
        stockQuantity: 10,
        status: "HIDDEN",
        images: [],
      });
    }
  }, [initialData, reset]);

  useEffect(() => {
    register("images", {
      validate: (val) => (val && val.length > 0) || "Vui lòng tải lên ít nhất 1 hình ảnh sản phẩm",
    });
  }, [register]);

  const categoryId = watch("categoryId");
  const status = watch("status");
  const images = watch("images") || [];
  const originalPriceVal = watch("originalPrice");

  const selectedCategoryName =
    MOCK_CATEGORIES.find((c) => c.id === categoryId)?.name || "Chọn danh mục";

  const categoryMenuItems = MOCK_CATEGORIES.map((cat) => ({
    key: cat.id,
    label: cat.name,
    onClick: () => setValue("categoryId", cat.id),
  }));

  const onSubmit = (data: ProductFormData) => {
    const catObj = MOCK_CATEGORIES.find((c) => c.id === data.categoryId);
    const mainImage = data.images && data.images.length > 0 ? data.images[0] : "";

    onSave({
      code: data.code,
      name: data.name,
      slug: data.name.toLowerCase().trim().replace(/\s+/g, "-"),
      categoryId: data.categoryId,
      categoryName: catObj?.name || "Móc khóa len",
      image: mainImage,
      originalPrice: Number(data.originalPrice),
      salePrice: data.salePrice ? Number(data.salePrice) : undefined,
      stockQuantity: Number(data.stockQuantity),
      status: Number(data.stockQuantity) === 0 ? "OUT_OF_STOCK" : data.status,
      isFeatured: initialData?.isFeatured || false,
    });
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
      description={
        isEditMode
          ? `Cập nhật thông tin chi tiết của sản phẩm ${initialData?.code}`
          : "Điền thông tin sản phẩm móc khóa len hoặc quà tặng để đưa lên hệ thống"
      }
      size="third"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">
            Thông tin cơ bản
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Mã sản phẩm"
              placeholder="SP-LEN-009"
              error={errors.code?.message}
              {...register("code", { required: "Vui lòng nhập mã sản phẩm" })}
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-text-secondary">
                Danh mục sản phẩm <span className="text-status-danger">*</span>
              </label>
              <DropdownMenu
                label={selectedCategoryName}
                triggerIcon={<Layers className="w-4 h-4 text-primary" />}
                variant="surface"
                items={categoryMenuItems}
                selectedKey={categoryId}
                width="w-full"
                className="w-full"
              />
            </div>
          </div>

          <Input
            label="Tên sản phẩm"
            placeholder="Móc khóa len Thỏ Mập Tai Dài Handmade..."
            leftIcon={<Package className="w-4 h-4 text-text-muted" />}
            error={errors.name?.message}
            {...register("name", {
              required: "Vui lòng nhập tên sản phẩm",
              minLength: { value: 3, message: "Tên sản phẩm phải từ 3 ký tự trở lên" },
            })}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">
            Giá bán & Tồn kho
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Giá niêm yết (VNĐ)"
              type="number"
              step={1000}
              placeholder="75000"
              error={errors.originalPrice?.message}
              {...register("originalPrice", {
                valueAsNumber: true,
                required: "Vui lòng nhập giá niêm yết",
                min: { value: 1000, message: "Giá niêm yết tối thiểu 1,000 VNĐ" },
              })}
            />

            <Input
              label="Giá khuyến mãi (VNĐ)"
              type="number"
              step={1000}
              placeholder="65000"
              error={errors.salePrice?.message}
              {...register("salePrice", {
                valueAsNumber: true,
                validate: (val) => {
                  if (!val || isNaN(val)) return true;
                  if (val >= originalPriceVal) {
                    return "Giá khuyến mãi phải nhỏ hơn giá niêm yết";
                  }
                  return true;
                },
              })}
            />
          </div>

          <Input
            label="Số lượng tồn kho"
            type="number"
            step={1}
            min={0}
            placeholder="10"
            error={errors.stockQuantity?.message}
            {...register("stockQuantity", {
              valueAsNumber: true,
              required: "Vui lòng nhập số lượng tồn kho",
              min: { value: 0, message: "Tồn kho không được là số âm" },
            })}
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">
            Hình ảnh sản phẩm
          </h3>

          <ImageUploader
            label="Bộ sưu tập ảnh sản phẩm"
            values={images}
            onChange={(urls: string[]) => {
              setValue("images", urls, { shouldValidate: true });
            }}
            maxFiles={6}
            error={errors.images?.message}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-muted/40 border border-border/60">
            <div>
              <div className="text-xs font-bold text-text-primary">Trạng thái bán hàng</div>
              <div className="text-[11px] text-text-muted">
                {status === "ACTIVE" ? "Đang bán trên website" : "Đang ẩn khỏi cửa hàng"}
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
            {isEditMode ? "Lưu thay đổi" : "Lưu sản phẩm"}
          </button>
        </div>
      </form>
    </Drawer>
  );
}
