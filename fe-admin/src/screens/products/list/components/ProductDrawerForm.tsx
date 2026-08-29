"use client";

import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  Package,
  Layers,
  UploadCloud,
  Eye,
  Star,
  Trash2,
  Plus,
  AlertCircle,
  CheckCircle2,
  Link as LinkIcon,
  Sparkles,
  FileText,
  ShieldCheck,
  Search,
} from "lucide-react";
import Image from "next/image";
import { Drawer } from "@/components/ui/Drawer";
import { Input } from "@/components/ui/Input";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { Switch } from "@/components/ui/Switch";
import { SwiperImageModal } from "@/components/ui/SwiperImageModal";
import { useListCategoriesQuery } from "@/services/api/categoryApi";
import { useUploadManyImagesMutation } from "@/services/api/uploadApi";
import type {
  ProductStatus,
  ProductHighlightType,
  CreateAdminProductDto,
} from "@/types/product.type";
import { MOCK_CATEGORIES } from "../constants";
import { toast } from "react-toastify";

interface ProductFormData {
  name: string;
  slug: string;
  categoryId: string;
  originalPrice: number;
  salePrice?: number;
  stockQuantity: number;
  status: ProductStatus;
  highlightType?: ProductHighlightType | "";
  shortDescription?: string;
  descriptionHtml?: string;
  careInstructionHtml?: string;
  metaTitle?: string;
  metaDescription?: string;
}

interface ImageItem {
  id: string;
  url: string;
  file?: File;
  isUploaded: boolean;
  publicId?: string | null;
}

interface ProductDrawerFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
  onSave: (productData: CreateAdminProductDto) => Promise<void> | void;
  isLoading?: boolean;
}

const HIGHLIGHT_TYPE_OPTIONS: {
  key: ProductHighlightType | "";
  label: string;
}[] = [
  { key: "", label: "Không có nhãn nổi bật" },
  { key: "HOT_PRODUCT", label: "Sản phẩm Hot (HOT_PRODUCT)" },
  { key: "TODAY_DEAL", label: "Deal hôm nay (TODAY_DEAL)" },
  { key: "HOT_TIKTOK", label: "Hot TikTok (HOT_TIKTOK)" },
];

export function ProductDrawerForm({
  isOpen,
  onClose,
  initialData,
  onSave,
  isLoading = false,
}: ProductDrawerFormProps) {
  const isEditMode = Boolean(initialData);

  const { data: categoriesResponse, isLoading: isCategoriesLoading } =
    useListCategoriesQuery({ limit: 100 });
  const categories = categoriesResponse?.items?.length
    ? categoriesResponse.items
    : MOCK_CATEGORIES;

  const [uploadManyImages, { isLoading: isUploadingImages }] =
    useUploadManyImagesMutation();

  const [imageList, setImageList] = useState<ImageItem[]>([]);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialCategoryId =
    initialData?.categoryId ||
    initialData?.category?.id ||
    categories[0]?.id ||
    "";

  const initialSalePrice = initialData?.salePrice ?? undefined;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      categoryId: initialCategoryId,
      originalPrice: initialData?.originalPrice || 75000,
      salePrice: initialSalePrice,
      stockQuantity: initialData?.stockQuantity ?? 10,
      status: initialData?.status || "ACTIVE",
      highlightType: initialData?.highlightType || "",
      shortDescription: initialData?.shortDescription || "",
      descriptionHtml: initialData?.descriptionHtml || "",
      careInstructionHtml: initialData?.careInstructionHtml || "",
      metaTitle: initialData?.metaTitle || "",
      metaDescription: initialData?.metaDescription || "",
    },
  });

  const nameVal = watch("name") || "";
  const categoryId = watch("categoryId");
  const highlightType = watch("highlightType") || "";
  const status = watch("status");
  const originalPriceVal = watch("originalPrice");

  // Auto generate slug from product name when creating new product
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

      setValue("slug", generatedSlug, { shouldValidate: true });
    }
  }, [nameVal, isEditMode, setValue]);

  // Re-fill form and images when drawer opens or initialData changes
  useEffect(() => {
    if (!isOpen) {
      setImageList([]);
      return;
    }

    if (initialData) {
      reset({
        name: initialData.name || "",
        slug: initialData.slug || "",
        categoryId:
          initialData.categoryId ||
          initialData.category?.id ||
          categories[0]?.id ||
          "",
        originalPrice: initialData.originalPrice || 75000,
        salePrice: initialData.salePrice ?? undefined,
        stockQuantity: initialData.stockQuantity ?? 0,
        status: initialData.status || "HIDDEN",
        highlightType: initialData.highlightType || "",
        shortDescription: initialData.shortDescription || "",
        descriptionHtml: initialData.descriptionHtml || "",
        careInstructionHtml: initialData.careInstructionHtml || "",
        metaTitle: initialData.metaTitle || "",
        metaDescription: initialData.metaDescription || "",
      });

      const initialImgUrl =
        initialData.image || initialData.thumbnail?.url || "";
      if (initialImgUrl) {
        setImageList([
          {
            id: `init-${Date.now()}`,
            url: initialImgUrl,
            isUploaded: true,
          },
        ]);
      } else {
        setImageList([]);
      }
    } else {
      reset({
        name: "",
        slug: "",
        categoryId: categories[0]?.id || "",
        originalPrice: 75000,
        salePrice: undefined,
        stockQuantity: 10,
        status: "ACTIVE",
        highlightType: "",
        shortDescription: "",
        descriptionHtml: "",
        careInstructionHtml: "",
        metaTitle: "",
        metaDescription: "",
      });
      setImageList([]);
    }
  }, [isOpen, initialData, reset, categories]);

  // Set default category if not selected
  useEffect(() => {
    if (!categoryId && categories.length > 0) {
      setValue("categoryId", categories[0].id);
    }
  }, [categories, categoryId, setValue]);

  const selectedCategory = categories.find((c) => c.id === categoryId);
  const selectedCategoryName = isCategoriesLoading
    ? "Đang tải danh mục..."
    : selectedCategory?.name || "Chọn danh mục";

  const categoryMenuItems = categories.map((cat) => ({
    key: cat.id,
    label: cat.name,
    onClick: () => setValue("categoryId", cat.id, { shouldValidate: true }),
  }));

  const selectedHighlightLabel =
    HIGHLIGHT_TYPE_OPTIONS.find((opt) => opt.key === highlightType)?.label ||
    "Không có nhãn nổi bật";

  const highlightMenuItems = HIGHLIGHT_TYPE_OPTIONS.map((opt) => ({
    key: opt.key,
    label: opt.label,
    onClick: () =>
      setValue("highlightType", opt.key as ProductHighlightType | "", {
        shouldValidate: true,
      }),
  }));

  const handleFilesSelect = (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (validFiles.length === 0) {
      toast.error("Vui lòng chọn tệp hình ảnh (PNG, JPG, WEBP)");
      return;
    }

    const remainingSlots = 6 - imageList.length;
    if (remainingSlots <= 0) {
      toast.warning("Sản phẩm chỉ hỗ trợ tối đa 6 hình ảnh.");
      return;
    }

    const filesToAdd = validFiles.slice(0, remainingSlots);
    const newItems: ImageItem[] = filesToAdd.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(file),
      file,
      isUploaded: false,
    }));

    setImageList((prev) => [...prev, ...newItems]);
    if (filesToAdd.length < validFiles.length) {
      toast.info(`Chỉ chọn ${filesToAdd.length} ảnh do giới hạn tối đa 6 ảnh.`);
    }
  };

  const handleUploadPendingFiles = async () => {
    const pendingItems = imageList.filter(
      (item) => !item.isUploaded && item.file
    );
    if (pendingItems.length === 0) return;

    try {
      const files = pendingItems.map((item) => item.file!);
      const uploadRes = await uploadManyImages({
        files,
        target: "PRODUCT",
      }).unwrap();

      setImageList((prev) => {
        let uploadIdx = 0;
        return prev.map((item) => {
          if (!item.isUploaded && item.file && uploadRes[uploadIdx]) {
            const res = uploadRes[uploadIdx++];
            URL.revokeObjectURL(item.url);
            return {
              id: item.id,
              url: res.url,
              publicId: res.publicId,
              isUploaded: true,
            };
          }
          return item;
        });
      });

      toast.success(`Đã tải lên thành công ${uploadRes.length} ảnh sản phẩm.`);
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Tải ảnh thất bại, vui lòng thử lại."
      );
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageList((prev) => {
      const item = prev[index];
      if (item && !item.isUploaded) {
        URL.revokeObjectURL(item.url);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSetMainImage = (index: number) => {
    if (index === 0) return;
    setImageList((prev) => {
      const target = prev[index];
      const rest = prev.filter((_, i) => i !== index);
      return [target, ...rest];
    });
  };

  const pendingCount = imageList.filter((item) => !item.isUploaded).length;

  const onSubmit = async (data: ProductFormData) => {
    let currentList = [...imageList];
    const pendingItems = currentList.filter(
      (item) => !item.isUploaded && item.file
    );

    // Auto upload pending images if user forgot to click "Lưu ảnh"
    if (pendingItems.length > 0) {
      try {
        const files = pendingItems.map((item) => item.file!);
        const uploadRes = await uploadManyImages({
          files,
          target: "PRODUCT",
        }).unwrap();

        let uploadIdx = 0;
        currentList = currentList.map((item) => {
          if (!item.isUploaded && item.file && uploadRes[uploadIdx]) {
            const res = uploadRes[uploadIdx++];
            URL.revokeObjectURL(item.url);
            return {
              id: item.id,
              url: res.url,
              publicId: res.publicId,
              isUploaded: true,
            };
          }
          return item;
        });
        setImageList(currentList);
      } catch (error: any) {
        toast.error(
          error?.data?.message ||
            error?.message ||
            "Có lỗi xảy ra khi tải ảnh sản phẩm lên máy chủ."
        );
        return;
      }
    }

    const uploadedOnly = currentList.filter((item) => item.isUploaded);
    if (uploadedOnly.length === 0) {
      toast.error("Vui lòng tải lên ít nhất 1 hình ảnh sản phẩm.");
      return;
    }

    const productPayload: CreateAdminProductDto = {
      name: data.name.trim(),
      slug: (
        data.slug ||
        data.name
          .toLowerCase()
          .trim()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/đ/g, "d")
          .replace(/Đ/g, "d")
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
      ).trim(),
      categoryId: data.categoryId,
      originalPrice: Number(data.originalPrice),
      salePrice: data.salePrice ? Number(data.salePrice) : null,
      stockQuantity: Number(data.stockQuantity),
      status: Number(data.stockQuantity) === 0 ? "OUT_OF_STOCK" : data.status,
      highlightType:
        (data.highlightType as ProductHighlightType) || null,
      shortDescription: data.shortDescription?.trim() || null,
      descriptionHtml: data.descriptionHtml?.trim() || null,
      careInstructionHtml: data.careInstructionHtml?.trim() || null,
      metaTitle: data.metaTitle?.trim() || null,
      metaDescription: data.metaDescription?.trim() || null,
      images: uploadedOnly.map((img, index) => ({
        url: img.url,
        publicId: img.publicId || null,
        altText: data.name.trim(),
        displayOrder: index,
        isThumbnail: index === 0,
      })),
    };

    await onSave(productPayload);
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
      description={
        isEditMode
          ? `Cập nhật thông tin chi tiết của sản phẩm ${initialData?.name}`
          : "Điền thông tin sản phẩm móc khóa len để đưa lên cửa hàng"
      }
      size="half"
    >
      <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
        {/* 1. THÔNG TIN CƠ BẢN */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-primary" />
            <span>Thông tin cơ bản</span>
          </h3>

          <div className="space-y-3.5">
            <Input
              label="Tên sản phẩm"
              placeholder="Móc khóa len Thỏ Mập Tai Dài Handmade..."
              error={errors.name?.message}
              {...register("name", {
                required: "Vui lòng nhập tên sản phẩm",
                minLength: {
                  value: 3,
                  message: "Tên sản phẩm phải từ 3 ký tự trở lên",
                },
              })}
            />

            <Input
              label="Đường dẫn (Slug)"
              placeholder="moc-khoa-len-tho-map-tai-dai"
              leftIcon={<LinkIcon className="w-3.5 h-3.5 text-text-muted" />}
              error={errors.slug?.message}
              {...register("slug", {
                required: "Vui lòng nhập đường dẫn sản phẩm (slug)",
                pattern: {
                  value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                  message:
                    "Slug chỉ được chứa chữ thường không dấu, số và dấu gạch nối (-)",
                },
              })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-text-secondary">
                  Nhãn nổi bật{" "}
                  <span className="text-[11px] text-text-muted font-normal">
                    (Tùy chọn)
                  </span>
                </label>
                <DropdownMenu
                  label={selectedHighlightLabel}
                  triggerIcon={<Sparkles className="w-4 h-4 text-primary" />}
                  variant="surface"
                  items={highlightMenuItems}
                  selectedKey={highlightType}
                  width="w-full"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. GIÁ BÁN & TỒN KHO */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">
            Giá bán & Tồn kho
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
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

            <div>
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
        </div>

        {/* 3. HÌNH ẢNH SẢN PHẨM */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">
                Hình ảnh sản phẩm{" "}
                <span className="text-status-danger">*</span>
              </h3>
              <p className="text-[11px] text-text-muted mt-0.5">
                Tối đa 6 ảnh. Ảnh đầu tiên sẽ là ảnh chính hiển thị trên website.
              </p>
            </div>

            {pendingCount > 0 && (
              <button
                type="button"
                onClick={handleUploadPendingFiles}
                disabled={isUploadingImages}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-bg-deep font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                <UploadCloud className="w-4 h-4" />
                <span>
                  {isUploadingImages
                    ? "Đang lưu ảnh..."
                    : `Lưu ảnh (${pendingCount})`}
                </span>
              </button>
            )}
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/png, image/jpeg, image/webp"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFilesSelect(e.target.files);
                e.target.value = "";
              }
            }}
            className="hidden"
          />

          {/* Image Grid */}
          {imageList.length > 0 ? (
            <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-surface-muted/50 border border-border">
              {imageList.map((item, idx) => (
                <div
                  key={item.id}
                  className="relative group aspect-square rounded-lg bg-surface border border-border overflow-hidden shadow-sm"
                >
                  <Image
                    src={item.url}
                    alt={`Ảnh sản phẩm ${idx + 1}`}
                    fill
                    unoptimized
                    className="object-cover"
                  />

                  {/* Status Badges */}
                  <div className="absolute top-1.5 left-1.5 flex flex-col gap-1 z-10">
                    {idx === 0 && (
                      <div className="px-1.5 py-0.5 rounded bg-primary text-bg-deep text-[9px] font-extrabold shadow-md">
                        Ảnh chính
                      </div>
                    )}
                    {!item.isUploaded && (
                      <div className="px-1.5 py-0.5 rounded bg-status-warning text-bg-deep text-[9px] font-bold shadow-md">
                        Chưa tải lên
                      </div>
                    )}
                    {item.isUploaded && idx !== 0 && (
                      <div className="px-1.5 py-0.5 rounded bg-status-success/80 text-white text-[9px] font-bold shadow-md flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>Sẵn sàng</span>
                      </div>
                    )}
                  </div>

                  {/* Hover Actions Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-1.5 p-1 z-20">
                    <button
                      type="button"
                      onClick={() => setPreviewIndex(idx)}
                      title="Xem ảnh phóng to"
                      className="p-1.5 rounded-lg bg-surface-hover hover:bg-primary text-text-primary hover:text-bg-deep transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    {idx !== 0 && (
                      <button
                        type="button"
                        onClick={() => handleSetMainImage(idx)}
                        title="Đặt làm ảnh chính"
                        className="p-1.5 rounded-lg bg-surface-hover hover:bg-surface-active text-text-primary transition-colors cursor-pointer"
                      >
                        <Star className="w-3.5 h-3.5 text-status-warning" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      title="Xóa ảnh này"
                      className="p-1.5 rounded-lg bg-status-danger/20 text-status-danger hover:bg-status-danger/40 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add More Tile */}
              {imageList.length < 6 && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files?.length) {
                      handleFilesSelect(e.dataTransfer.files);
                    }
                  }}
                  className={`aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all cursor-pointer select-none text-center p-2 ${
                    isDragging
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/60 bg-surface-muted/40 hover:bg-surface-muted"
                  }`}
                >
                  <Plus className="w-5 h-5 text-primary" />
                  <span className="text-[11px] font-bold text-text-secondary">
                    Thêm ảnh
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files?.length) {
                  handleFilesSelect(e.dataTransfer.files);
                }
              }}
              className={`flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed transition-all cursor-pointer select-none text-center ${
                isDragging
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50 bg-surface-muted/40 hover:bg-surface-muted"
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-text-primary">
                  Nhấp để chọn tệp từ máy tính hoặc kéo thả vào đây
                </p>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Hỗ trợ PNG, JPG, WEBP (Tối đa 6 ảnh)
                </p>
              </div>
            </div>
          )}

          {/* Pending warning note */}
          {pendingCount > 0 && (
            <p className="text-[11px] text-status-warning flex items-center gap-1 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>
                Có {pendingCount} ảnh chưa tải lên Cloud. Bạn có thể bấm &quot;Lưu
                ảnh&quot; hoặc hệ thống sẽ tự động lưu khi bấm nút &quot;Lưu sản
                phẩm&quot;.
              </span>
            </p>
          )}
        </div>

        {/* 4. MÔ TẢ & HƯỚNG DẪN BẢO QUẢN (TÙY CHỌN) */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-primary" />
            <span>Mô tả & Hướng dẫn</span>
            <span className="text-[11px] text-text-muted font-normal lowercase">
              (tùy chọn)
            </span>
          </h3>

          <div className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-text-secondary">
                Mô tả ngắn{" "}
                <span className="text-[11px] text-text-muted font-normal">
                  (Tùy chọn - tối đa 500 ký tự)
                </span>
              </label>
              <textarea
                rows={2}
                maxLength={500}
                placeholder="Tóm tắt ngắn về chất liệu len, màu sắc hoặc đặc điểm nổi bật..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors resize-none"
                {...register("shortDescription")}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-text-secondary">
                Mô tả chi tiết sản phẩm{" "}
                <span className="text-[11px] text-text-muted font-normal">
                  (Tùy chọn)
                </span>
              </label>
              <textarea
                rows={4}
                maxLength={20000}
                placeholder="Thông tin chi tiết về kích thước, chất liệu len milk cotton, phụ kiện móc khóa..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors resize-y"
                {...register("descriptionHtml")}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-text-secondary flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span>Hướng dẫn bảo quản len handmade</span>
                <span className="text-[11px] text-text-muted font-normal">
                  (Tùy chọn)
                </span>
              </label>
              <textarea
                rows={2}
                maxLength={20000}
                placeholder="Ví dụ: Giặt nhẹ bằng tay trong nước lạnh, không dùng chất tẩy mạnh, phơi khô tự nhiên nơi thoáng mát..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors resize-none"
                {...register("careInstructionHtml")}
              />
            </div>
          </div>
        </div>

        {/* 5. TỐI ƯU SEO (TÙY CHỌN) */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-primary" />
            <span>Tối ưu hóa tìm kiếm (SEO)</span>
            <span className="text-[11px] text-text-muted font-normal lowercase">
              (tùy chọn)
            </span>
          </h3>

          <div className="space-y-3.5">
            <Input
              label="Tiêu đề SEO (Meta Title)"
              placeholder="Móc Khóa Len Thỏ Mập Handmade - Tiệm Len Nhà Kiều"
              maxLength={180}
              {...register("metaTitle")}
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-text-secondary">
                Mô tả SEO (Meta Description){" "}
                <span className="text-[11px] text-text-muted font-normal">
                  (Tùy chọn - tối đa 300 ký tự)
                </span>
              </label>
              <textarea
                rows={2}
                maxLength={300}
                placeholder="Mô tả sản phẩm hiển thị trên kết quả tìm kiếm Google..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors resize-none"
                {...register("metaDescription")}
              />
            </div>
          </div>
        </div>

        {/* 6. TRẠNG THÁI BÁN HÀNG */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-muted/40 border border-border/60">
            <div>
              <div className="text-xs font-bold text-text-primary">
                Trạng thái bán hàng <span className="text-status-danger">*</span>
              </div>
              <div className="text-[11px] text-text-muted">
                {status === "ACTIVE"
                  ? "Đang bán trên website (khách hàng có thể tìm thấy và mua)"
                  : "Đang ẩn khỏi cửa hàng (khách hàng không thể thấy)"}
              </div>
            </div>
            <Switch
              checked={status === "ACTIVE"}
              onChange={(checked) =>
                setValue("status", checked ? "ACTIVE" : "HIDDEN")
              }
              size="md"
            />
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading || isUploadingImages}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-surface-hover hover:bg-surface-active text-text-primary transition-colors cursor-pointer disabled:opacity-50"
          >
            Hủy bỏ
          </button>

          <button
            type="submit"
            disabled={isLoading || isUploadingImages}
            className="px-5 py-2 text-xs font-bold text-bg-deep bg-primary hover:bg-primary-hover rounded-lg transition-all shadow-md shadow-primary/20 cursor-pointer disabled:opacity-50"
          >
            {isUploadingImages
              ? "Đang tải ảnh lên..."
              : isLoading
              ? "Đang lưu sản phẩm..."
              : isEditMode
              ? "Lưu thay đổi"
              : "Lưu sản phẩm"}
          </button>
        </div>
      </form>

      {/* Swiper modal to preview image */}
      <SwiperImageModal
        isOpen={previewIndex !== null}
        initialIndex={previewIndex || 0}
        images={imageList.map((item) => item.url)}
        onClose={() => setPreviewIndex(null)}
      />
    </Drawer>
  );
}
