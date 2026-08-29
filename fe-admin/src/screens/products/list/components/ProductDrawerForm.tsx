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
  Palette,
  Ruler,
  Sliders,
  X,
} from "lucide-react";
import Image from "next/image";
import { Drawer } from "@/components/ui/Drawer";
import { Input } from "@/components/ui/Input";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { Switch } from "@/components/ui/Switch";
import { Modal } from "@/components/ui/Modal";
import { SwiperImageModal } from "@/components/ui/SwiperImageModal";
import { useListCategoriesQuery } from "@/services/api/categoryApi";
import { useUploadManyImagesMutation } from "@/services/api/uploadApi";
import type {
  ProductStatus,
  ProductHighlightType,
  ProductOptionType,
  ProductOptionItem,
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

interface FormOptionValue {
  id: string;
  code: string;
  label: string;
  colorHex?: string | null;
  priceDiff?: number;
  isDefault?: boolean;
}

interface FormOption {
  optionType: ProductOptionType;
  name: string;
  values: FormOptionValue[];
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

const COLOR_PRESETS = [
  { label: "Hồng", hex: "#FFB6C1" },
  { label: "Xanh dương", hex: "#60A5FA" },
  { label: "Vàng", hex: "#FDE047" },
  { label: "Trắng", hex: "#F8FAFC" },
  { label: "Tím", hex: "#C084FC" },
  { label: "Nâu", hex: "#D97706" },
  { label: "Xanh lá", hex: "#4ADE80" },
  { label: "Đỏ", hex: "#F87171" },
  { label: "Đen", hex: "#1E293B" },
];

const SIZE_PRESETS = ["Tiêu chuẩn", "Nhỏ (5cm)", "Vừa (8cm)", "Lớn (12cm)"];

function generateOptionCode(label: string, prefix = ""): string {
  const normalized = label
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/Đ/g, "D")
    .replace(/[^A-Z0-9]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
  return prefix && !normalized.startsWith(prefix)
    ? `${prefix}_${normalized}`
    : normalized || "VALUE";
}

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
  const [productOptions, setProductOptions] = useState<FormOption[]>([]);
  const [showCloseConfirmModal, setShowCloseConfirmModal] = useState(false);
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
    formState: { errors, isDirty },
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

  // Determine if form has unsaved modifications
  const isImagesDirty = isEditMode
    ? imageList.some((img) => !img.isUploaded) ||
      imageList.length !==
        (initialData?.images?.length ?? (initialData?.image ? 1 : 0))
    : imageList.length > 0;

  const isOptionsDirty = isEditMode
    ? JSON.stringify(
        productOptions.map((o) => ({
          t: o.optionType,
          n: o.name,
          v: o.values.map((v) => ({ l: v.label, p: v.priceDiff, c: v.colorHex })),
        }))
      ) !==
      JSON.stringify(
        (initialData?.options || []).map((o: any) => ({
          t: o.optionType,
          n: o.name,
          v: (o.values || []).map((v: any) => ({
            l: v.label,
            p: v.priceDiff,
            c: v.colorHex,
          })),
        }))
      )
    : productOptions.length > 0;

  const isFormDirty = Boolean(
    isDirty || isImagesDirty || isOptionsDirty || nameVal.trim() !== ""
  );

  const handleRequestClose = () => {
    if (isFormDirty) {
      setShowCloseConfirmModal(true);
    } else {
      onClose();
    }
  };

  const handleConfirmDiscard = () => {
    setShowCloseConfirmModal(false);
    imageList.forEach((item) => {
      if (!item.isUploaded) {
        URL.revokeObjectURL(item.url);
      }
    });
    setImageList([]);
    setProductOptions([]);
    reset();
    onClose();
  };

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

  // Re-fill form, images and options when drawer opens or initialData changes
  useEffect(() => {
    if (!isOpen) {
      setImageList([]);
      setProductOptions([]);
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

      if (Array.isArray(initialData.images) && initialData.images.length > 0) {
        setImageList(
          initialData.images.map((img: any) => ({
            id: img.id || `img-${Date.now()}-${Math.random()}`,
            url: img.url,
            isUploaded: true,
            publicId: img.publicId || null,
          }))
        );
      } else {
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
      }

      if (initialData.options && Array.isArray(initialData.options)) {
        setProductOptions(
          initialData.options.map((opt: any) => ({
            optionType: opt.optionType,
            name: opt.name,
            values: Array.isArray(opt.values)
              ? opt.values.map((v: any, i: number) => ({
                  id: `init-opt-${i}-${Date.now()}`,
                  code: v.code,
                  label: v.label,
                  colorHex: v.colorHex || null,
                  priceDiff: v.priceDiff || 0,
                  isDefault: Boolean(v.isDefault),
                }))
              : [],
          }))
        );
      } else {
        setProductOptions([]);
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
      setProductOptions([]);
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

  // Image handling
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

  // Option handling
  const handleAddOption = (type: ProductOptionType) => {
    if (productOptions.some((o) => o.optionType === type)) return;
    if (type === "COLOR") {
      setProductOptions((prev) => [
        ...prev,
        {
          optionType: "COLOR",
          name: "Màu sắc",
          values: [
            {
              id: `color-${Date.now()}-1`,
              label: "Hồng",
              code: "COLOR_HONG",
              colorHex: "#FFB6C1",
              priceDiff: 0,
              isDefault: true,
            },
            {
              id: `color-${Date.now()}-2`,
              label: "Xanh dương",
              code: "COLOR_XANH_DUONG",
              colorHex: "#60A5FA",
              priceDiff: 0,
              isDefault: false,
            },
          ],
        },
      ]);
    } else {
      setProductOptions((prev) => [
        ...prev,
        {
          optionType: "SIZE",
          name: "Kích thước",
          values: [
            {
              id: `size-${Date.now()}-1`,
              label: "Tiêu chuẩn",
              code: "SIZE_TIEU_CHUAN",
              priceDiff: 0,
              isDefault: true,
            },
          ],
        },
      ]);
    }
  };

  const handleRemoveOption = (type: ProductOptionType) => {
    setProductOptions((prev) => prev.filter((o) => o.optionType !== type));
  };

  const handleUpdateOptionName = (type: ProductOptionType, name: string) => {
    setProductOptions((prev) =>
      prev.map((o) => (o.optionType === type ? { ...o, name } : o))
    );
  };

  const handleAddOptionValue = (
    type: ProductOptionType,
    label: string,
    colorHex?: string
  ) => {
    setProductOptions((prev) =>
      prev.map((o) => {
        if (o.optionType !== type) return o;
        const code = generateOptionCode(label, type);
        const isFirst = o.values.length === 0;
        return {
          ...o,
          values: [
            ...o.values,
            {
              id: `val-${Date.now()}-${Math.random()}`,
              label,
              code,
              colorHex: colorHex || (type === "COLOR" ? "#FFB6C1" : null),
              priceDiff: 0,
              isDefault: isFirst,
            },
          ],
        };
      })
    );
  };

  const handleUpdateOptionValue = (
    type: ProductOptionType,
    valId: string,
    partial: Partial<FormOptionValue>
  ) => {
    setProductOptions((prev) =>
      prev.map((o) => {
        if (o.optionType !== type) return o;
        return {
          ...o,
          values: o.values.map((v) => {
            if (v.id !== valId) {
              if (partial.isDefault) {
                return { ...v, isDefault: false };
              }
              return v;
            }
            const updated = { ...v, ...partial };
            if (partial.label !== undefined) {
              updated.code = generateOptionCode(partial.label, type);
            }
            return updated;
          }),
        };
      })
    );
  };

  const handleRemoveOptionValue = (type: ProductOptionType, valId: string) => {
    setProductOptions((prev) =>
      prev.map((o) => {
        if (o.optionType !== type) return o;
        const remaining = o.values.filter((v) => v.id !== valId);
        if (remaining.length > 0 && !remaining.some((v) => v.isDefault)) {
          remaining[0].isDefault = true;
        }
        return {
          ...o,
          values: remaining,
        };
      })
    );
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

    // Validate options
    for (const opt of productOptions) {
      if (opt.values.length === 0) {
        toast.error(
          `Tùy chọn "${opt.name}" phải có ít nhất 1 giá trị phân loại.`
        );
        return;
      }
      for (const val of opt.values) {
        if (!val.label.trim()) {
          toast.error(
            `Vui lòng nhập tên giá trị cho phân loại trong nhóm "${opt.name}".`
          );
          return;
        }
      }
    }

    const formattedOptions: ProductOptionItem[] | undefined =
      productOptions.length > 0
        ? productOptions.map((opt, optIndex) => ({
            optionType: opt.optionType,
            name:
              opt.name.trim() ||
              (opt.optionType === "COLOR" ? "Màu sắc" : "Kích thước"),
            displayOrder: optIndex,
            values: opt.values.map((val) => ({
              code: (
                val.code || generateOptionCode(val.label, opt.optionType)
              ).trim(),
              label: val.label.trim(),
              colorHex:
                opt.optionType === "COLOR" && val.colorHex?.trim()
                  ? val.colorHex.trim()
                  : null,
              priceDiff: val.priceDiff ? Number(val.priceDiff) : 0,
              isDefault: Boolean(val.isDefault),
            })),
          }))
        : undefined;

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
      options: formattedOptions,
    };

    await onSave(productPayload);
  };

  const hasColorOption = productOptions.some((o) => o.optionType === "COLOR");
  const hasSizeOption = productOptions.some((o) => o.optionType === "SIZE");

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={handleRequestClose}
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

        {/* 3. TÙY CHỌN SẢN PHẨM (PHÂN LOẠI MÀU SẮC, KÍCH THƯỚC) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-primary" />
              <span>Phân loại hàng</span>
              <span className="text-[11px] text-text-muted font-normal lowercase">
                (tùy chọn)
              </span>
            </h3>

            <div className="flex items-center gap-2">
              {!hasColorOption && (
                <button
                  type="button"
                  onClick={() => handleAddOption("COLOR")}
                  className="px-2.5 py-1.5 rounded-lg border border-primary/40 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold transition-all cursor-pointer"
                >
                  + Thêm màu sắc
                </button>
              )}

              {!hasSizeOption && (
                <button
                  type="button"
                  onClick={() => handleAddOption("SIZE")}
                  className="px-2.5 py-1.5 rounded-lg border border-primary/40 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold transition-all cursor-pointer"
                >
                  + Thêm kích thước
                </button>
              )}
            </div>
          </div>

          {productOptions.length === 0 ? (
            <div className="py-3 px-4 rounded-xl border border-dashed border-border bg-surface-muted/30 text-center">
              <p className="text-xs text-text-muted">
                Chưa có phân loại (màu sắc, kích thước).
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {productOptions.map((opt) => (
                <div
                  key={opt.optionType}
                  className="p-3.5 rounded-xl bg-surface-muted/30 border border-border space-y-3"
                >
                  {/* Option Group Header */}
                  <div className="flex items-center justify-between gap-3 pb-2 border-b border-border/60">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="p-1.5 rounded-md bg-primary/15 text-primary">
                        {opt.optionType === "COLOR" ? (
                          <Palette className="w-4 h-4" />
                        ) : (
                          <Ruler className="w-4 h-4" />
                        )}
                      </span>
                      <div className="flex-1 max-w-xs">
                        <input
                          type="text"
                          value={opt.name}
                          onChange={(e) =>
                            handleUpdateOptionName(opt.optionType, e.target.value)
                          }
                          placeholder={
                            opt.optionType === "COLOR"
                              ? "Tên nhóm: Màu sắc"
                              : "Tên nhóm: Kích thước"
                          }
                          className="w-full px-2.5 py-1 text-xs font-bold rounded-md border border-border bg-surface text-text-primary focus:outline-none focus:border-primary"
                        />
                      </div>
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-surface border border-border text-text-muted font-bold">
                        {opt.optionType}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveOption(opt.optionType)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-status-danger hover:bg-status-danger/10 transition-colors cursor-pointer"
                      title="Xóa nhóm tùy chọn này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Option Values List */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-12 gap-2 text-[11px] font-semibold text-text-muted px-1">
                      <div className="col-span-7">Tên phân loại</div>
                      <div className="col-span-3">Chênh lệch giá (±VNĐ)</div>
                      <div className="col-span-2 text-right">Mặc định</div>
                    </div>

                    {opt.values.map((val) => (
                      <div
                        key={val.id}
                        className="grid grid-cols-12 gap-2 items-center p-2 rounded-lg bg-surface border border-border/80"
                      >
                        {/* Label & Color Picker */}
                        <div className="col-span-7 flex items-center gap-2">
                          {opt.optionType === "COLOR" && (
                            <div className="relative shrink-0">
                              <input
                                type="color"
                                value={val.colorHex || "#FFB6C1"}
                                onChange={(e) =>
                                  handleUpdateOptionValue(opt.optionType, val.id, {
                                    colorHex: e.target.value,
                                  })
                                }
                                className="w-6 h-6 rounded-full border border-border cursor-pointer overflow-hidden p-0 bg-transparent"
                                title="Chọn mã màu hex"
                              />
                            </div>
                          )}
                          <input
                            type="text"
                            value={val.label}
                            onChange={(e) =>
                              handleUpdateOptionValue(opt.optionType, val.id, {
                                label: e.target.value,
                              })
                            }
                            placeholder={
                              opt.optionType === "COLOR"
                                ? "Ví dụ: Hồng pastel..."
                                : "Ví dụ: Size Nhỏ 5cm..."
                            }
                            className="w-full px-2 py-1 text-xs rounded border border-border bg-surface-muted/30 text-text-primary focus:outline-none focus:border-primary"
                          />
                        </div>

                        {/* Price Diff */}
                        <div className="col-span-3">
                          <input
                            type="number"
                            step={1000}
                            value={val.priceDiff || 0}
                            onChange={(e) =>
                              handleUpdateOptionValue(opt.optionType, val.id, {
                                priceDiff: Number(e.target.value),
                              })
                            }
                            placeholder="±0"
                            className="w-full px-2 py-1 text-xs rounded border border-border bg-surface-muted/30 text-text-primary focus:outline-none focus:border-primary"
                          />
                        </div>

                        {/* Default Radio & Delete */}
                        <div className="col-span-2 flex items-center justify-end gap-2">
                          <label
                            className="flex items-center gap-1 cursor-pointer"
                            title="Đặt làm giá trị mặc định khi khách vào trang sản phẩm"
                          >
                            <input
                              type="radio"
                              name={`default-${opt.optionType}`}
                              checked={Boolean(val.isDefault)}
                              onChange={() =>
                                handleUpdateOptionValue(opt.optionType, val.id, {
                                  isDefault: true,
                                })
                              }
                              className="w-3.5 h-3.5 text-primary accent-primary cursor-pointer"
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => handleRemoveOptionValue(opt.optionType, val.id)}
                            className="p-1 rounded text-text-muted hover:text-status-danger transition-colors cursor-pointer"
                            title="Xóa giá trị này"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Preset quick buttons & Add custom value */}
                  <div className="pt-2 border-t border-border/50 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] text-text-muted font-medium">
                        Gợi ý nhanh:
                      </span>
                      {opt.optionType === "COLOR"
                        ? COLOR_PRESETS.map((preset) => (
                            <button
                              key={preset.label}
                              type="button"
                              onClick={() =>
                                handleAddOptionValue(
                                  "COLOR",
                                  preset.label,
                                  preset.hex
                                )
                              }
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface border border-border hover:border-primary/60 text-[10px] font-medium text-text-secondary transition-colors cursor-pointer"
                            >
                              <span
                                className="w-2 h-2 rounded-full border border-black/20"
                                style={{ backgroundColor: preset.hex }}
                              />
                              <span>{preset.label}</span>
                            </button>
                          ))
                        : SIZE_PRESETS.map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => handleAddOptionValue("SIZE", preset)}
                              className="px-2 py-0.5 rounded-md bg-surface border border-border hover:border-primary/60 text-[10px] font-medium text-text-secondary transition-colors cursor-pointer"
                            >
                              {preset}
                            </button>
                          ))}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleAddOptionValue(
                          opt.optionType,
                          opt.optionType === "COLOR" ? "Màu mới" : "Kích thước mới"
                        )
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-muted hover:bg-surface-hover border border-border text-text-primary text-xs font-semibold transition-colors cursor-pointer ml-auto"
                    >
                      <Plus className="w-3.5 h-3.5 text-primary" />
                      <span>Thêm giá trị</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. HÌNH ẢNH SẢN PHẨM */}
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

        {/* 5. MÔ TẢ & HƯỚNG DẪN BẢO QUẢN (TÙY CHỌN) */}
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

        {/* 6. TỐI ƯU SEO (TÙY CHỌN) */}
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

        {/* 7. TRẠNG THÁI BÁN HÀNG */}
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
            onClick={handleRequestClose}
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

    {/* Discard changes confirmation modal */}
    <Modal
      isOpen={showCloseConfirmModal}
      onClose={() => setShowCloseConfirmModal(false)}
      onConfirm={handleConfirmDiscard}
      type="WARNING"
      title="Xác nhận hủy thay đổi"
      description="Thông tin sản phẩm đã được chỉnh sửa. Bạn có chắc chắn muốn bỏ qua các thay đổi này và đóng lại không?"
      confirmText="Bỏ thay đổi"
      cancelText="Tiếp tục sửa"
      size="sm"
    />
  </>
);
}
