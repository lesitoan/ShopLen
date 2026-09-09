"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import {
  FileText,
  Image as ImageIcon,
  Check,
  Plus,
  Trash2,
  Copy,
  Wand2,
  Clock,
  Globe,
  UploadCloud,
  Loader2,
} from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { Badge } from "@/components/ui/Badge";
import { TipTapEditor } from "./TipTapEditor";
import { useUploadImageMutation } from "@/services/api/uploadApi";
import type {
  BlogPostDetail,
  BlogPostListItem,
  BlogPostTag,
  BlogPostStatus,
  CreateAdminBlogPostDto,
  BlogPostImageItem,
} from "@/types/blog.type";
import { PRESET_BLOG_TAGS } from "../constants";
import { toast } from "react-toastify";

export interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  contentHtml: string;
  tagId: string;
  authorName: string;
  status: BlogPostStatus;
  isFeatured: boolean;
  showOnHome: boolean;
  readTimeMinutes: number;
  publishedAt: string;
  metaTitle: string;
  metaDescription: string;
}

interface BlogDrawerFormProps {
  isOpen: boolean;
  initialData: BlogPostDetail | BlogPostListItem | null;
  isEditMode?: boolean;
  isLoadingDetail?: boolean;
  tags: BlogPostTag[];
  isLoading: boolean;
  onSave: (data: CreateAdminBlogPostDto) => Promise<void> | void;
  onClose: () => void;
  onCreateTag?: (name: string) => Promise<BlogPostTag | void>;
}

type TabType = "content" | "media" | "seo";

function slugifyVietnamese(str: string): string {
  if (!str) return "";
  let slug = str.toLowerCase();
  slug = slug.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  slug = slug.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  slug = slug.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  slug = slug.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  slug = slug.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  slug = slug.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  slug = slug.replace(/đ/g, "d");
  slug = slug.replace(/[^a-z0-9\s-]/g, "");
  slug = slug.replace(/\s+/g, "-");
  slug = slug.replace(/-+/g, "-");
  return slug.replace(/^-+|-+$/g, "");
}

export function BlogDrawerForm({
  isOpen,
  initialData,
  isEditMode = false,
  isLoadingDetail = false,
  tags,
  isLoading,
  onSave,
  onClose,
  onCreateTag,
}: BlogDrawerFormProps) {
  const [activeTab, setActiveTab] = useState<TabType>("content");
  const [showCloseConfirmModal, setShowCloseConfirmModal] = useState(false);

  // Media states (uploaded files)
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [thumbnailAlt, setThumbnailAlt] = useState("");
  const [images, setImages] = useState<BlogPostImageItem[]>([]);
  const [isUploadingThumb, setIsUploadingThumb] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  const thumbInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [uploadImage] = useUploadImageMutation();

  // Quick tag creation
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");

  const defaultTagId = tags[0]?.id || PRESET_BLOG_TAGS[0].id;

  // React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<BlogFormData>({
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      contentHtml: "",
      tagId: defaultTagId,
      authorName: "Tiệm Len Nhà Kiều",
      status: "DRAFT",
      isFeatured: false,
      showOnHome: false,
      readTimeMinutes: 3,
      publishedAt: "",
      metaTitle: "",
      metaDescription: "",
    },
    mode: "onBlur",
  });

  // Watch form fields for live sync / preview
  const titleVal = watch("title") || "";
  const slugVal = watch("slug") || "";
  const excerptVal = watch("excerpt") || "";
  const contentHtmlVal = watch("contentHtml") || "";
  const tagIdVal = watch("tagId") || defaultTagId;
  const statusVal = watch("status") || "DRAFT";
  const isFeaturedVal = watch("isFeatured");
  const showOnHomeVal = watch("showOnHome");
  const readTimeMinutesVal = watch("readTimeMinutes") || 3;
  const metaTitleVal = watch("metaTitle") || "";
  const metaDescriptionVal = watch("metaDescription") || "";

  // Reset all form fields to default clean state
  const resetForm = () => {
    reset({
      title: "",
      slug: "",
      excerpt: "",
      contentHtml: "",
      tagId: defaultTagId,
      authorName: "Tiệm Len Nhà Kiều",
      status: "DRAFT",
      isFeatured: false,
      showOnHome: false,
      readTimeMinutes: 3,
      publishedAt: "",
      metaTitle: "",
      metaDescription: "",
    });
    setThumbnailUrl("");
    setThumbnailAlt("");
    setImages([]);
    setActiveTab("content");
    setShowCloseConfirmModal(false);
    setIsAddingTag(false);
    setNewTagName("");
    if (thumbInputRef.current) thumbInputRef.current.value = "";
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  };

  // Sync form when opening / initialData changes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
      return;
    }

    if (isEditMode) {
      if (initialData) {
        reset({
          title: initialData.title || "",
          slug: initialData.slug || "",
          excerpt: initialData.excerpt || "",
          contentHtml:
            (initialData as BlogPostDetail).contentHtml ||
            initialData.excerpt ||
            "",
          tagId: initialData.tag?.id || defaultTagId,
          authorName: initialData.author?.fullName || "Tiệm Len Nhà Kiều",
          status: initialData.status || "DRAFT",
          isFeatured: Boolean(initialData.isFeatured),
          showOnHome: Boolean(initialData.showOnHome),
          readTimeMinutes: initialData.readTimeMinutes || 3,
          publishedAt: initialData.publishedAt
            ? new Date(initialData.publishedAt).toISOString().slice(0, 16)
            : "",
          metaTitle:
            (initialData as BlogPostDetail).metaTitle ||
            initialData.title ||
            "",
          metaDescription:
            (initialData as BlogPostDetail).metaDescription ||
            initialData.excerpt ||
            "",
        });
        setThumbnailUrl(initialData.thumbnail?.url || "");
        setThumbnailAlt(
          initialData.thumbnail?.altText || initialData.title || ""
        );
        setImages((initialData as BlogPostDetail).images || []);
      }
    } else {
      // Create mode: ensure completely blank fresh form
      resetForm();
    }
  }, [initialData, isOpen, isEditMode, defaultTagId, reset]);

  // Check if form has unsaved modifications
  const isFormDirty = useMemo(() => {
    if (!isOpen) return false;

    if (isEditMode && initialData) {
      const initialDetail = initialData as BlogPostDetail;
      const initialContent =
        initialDetail.contentHtml || initialData.excerpt || "";

      const isTitleChanged =
        titleVal.trim() !== (initialData.title || "").trim();
      const isSlugChanged =
        slugVal.trim() !== (initialData.slug || "").trim();
      const isExcerptChanged =
        excerptVal.trim() !== (initialData.excerpt || "").trim();
      const isContentChanged =
        contentHtmlVal.trim() !== initialContent.trim();
      const isTagChanged =
        tagIdVal !== (initialData.tag?.id || defaultTagId);
      const isStatusChanged =
        statusVal !== (initialData.status || "DRAFT");
      const isFeaturedChanged =
        Boolean(isFeaturedVal) !== Boolean(initialData.isFeatured);
      const isShowOnHomeChanged =
        Boolean(showOnHomeVal) !== Boolean(initialData.showOnHome);
      const isMetaTitleChanged =
        metaTitleVal.trim() !==
        (initialDetail.metaTitle || initialData.title || "").trim();
      const isMetaDescChanged =
        metaDescriptionVal.trim() !==
        (initialDetail.metaDescription || initialData.excerpt || "").trim();
      const isThumbChanged =
        thumbnailUrl !== (initialData.thumbnail?.url || "");

      const initialImagesUrls = (initialDetail.images || []).map(
        (i) => i.url
      );
      const currentImagesUrls = images.map((i) => i.url);
      const isImagesChanged =
        JSON.stringify(initialImagesUrls) !==
        JSON.stringify(currentImagesUrls);

      return (
        isTitleChanged ||
        isSlugChanged ||
        isExcerptChanged ||
        isContentChanged ||
        isTagChanged ||
        isStatusChanged ||
        isFeaturedChanged ||
        isShowOnHomeChanged ||
        isMetaTitleChanged ||
        isMetaDescChanged ||
        isThumbChanged ||
        isImagesChanged
      );
    }

    // In create mode: if user typed anything meaningful
    return (
      titleVal.trim() !== "" ||
      slugVal.trim() !== "" ||
      excerptVal.trim() !== "" ||
      (contentHtmlVal.trim() !== "" && contentHtmlVal.trim() !== "<p></p>") ||
      thumbnailUrl !== "" ||
      images.length > 0 ||
      metaTitleVal.trim() !== "" ||
      metaDescriptionVal.trim() !== ""
    );
  }, [
    isOpen,
    isEditMode,
    initialData,
    titleVal,
    slugVal,
    excerptVal,
    contentHtmlVal,
    tagIdVal,
    defaultTagId,
    statusVal,
    isFeaturedVal,
    showOnHomeVal,
    metaTitleVal,
    metaDescriptionVal,
    thumbnailUrl,
    images,
  ]);

  // Handle close requests: show confirm if dirty
  const handleRequestClose = () => {
    if (isFormDirty) {
      setShowCloseConfirmModal(true);
    } else {
      handleForceClose();
    }
  };

  const handleForceClose = () => {
    setShowCloseConfirmModal(false);
    resetForm();
    onClose();
  };

  // Auto-generate slug when title changes (if not editing an existing post)
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue("title", val, { shouldValidate: true });
    if (!initialData || !slugVal) {
      setValue("slug", slugifyVietnamese(val), { shouldValidate: true });
    }
  };

  const handleGenerateSlug = () => {
    if (titleVal) {
      const generated = slugifyVietnamese(titleVal);
      setValue("slug", generated, { shouldValidate: true });
      toast.info("Đã tạo đường dẫn tĩnh (slug) chuẩn SEO từ tiêu đề.");
    }
  };

  // Auto calculate read time
  const handleCalculateReadTime = () => {
    const wordCount = (
      contentHtmlVal.replace(/<[^>]*>/g, " ").match(/\S+/g) || []
    ).length;
    const time = Math.max(1, Math.ceil(wordCount / 200));
    setValue("readTimeMinutes", time, { shouldValidate: true });
    toast.info(`Đã ước tính thời gian đọc: ~${time} phút (${wordCount} từ).`);
  };

  // Upload thumbnail directly from computer
  const handleUploadThumbnailFile = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingThumb(true);
    const toastId = toast.loading("Đang tải ảnh đại diện lên server...");
    try {
      const res = await uploadImage({ file, target: "BLOG" }).unwrap();
      if (res?.url) {
        setThumbnailUrl(res.url);
        setThumbnailAlt(titleVal || file.name.replace(/\.[^/.]+$/, ""));
        toast.update(toastId, {
          render: "Tải ảnh đại diện thành công!",
          type: "success",
          isLoading: false,
          autoClose: 2500,
        });
      }
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnailUrl(reader.result as string);
        setThumbnailAlt(titleVal || file.name.replace(/\.[^/.]+$/, ""));
      };
      reader.readAsDataURL(file);
      toast.update(toastId, {
        render: "Đã chọn ảnh đại diện.",
        type: "info",
        isLoading: false,
        autoClose: 2500,
      });
    } finally {
      setIsUploadingThumb(false);
      e.target.value = "";
    }
  };

  // Upload gallery images from computer (supports multiple files)
  const handleUploadGalleryFile = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    setIsUploadingGallery(true);
    const toastId = toast.loading(
      `Đang tải ${fileList.length} ảnh vào thư viện...`
    );
    try {
      const uploadedImages: BlogPostImageItem[] = [];
      let currentThumb = thumbnailUrl;

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        try {
          const res = await uploadImage({ file, target: "BLOG" }).unwrap();
          if (res?.url) {
            const newImg: BlogPostImageItem = {
              id: `img-${Date.now()}-${i}`,
              url: res.url,
              altText: titleVal || file.name.replace(/\.[^/.]+$/, ""),
              isThumbnail: images.length === 0 && !currentThumb,
              displayOrder: images.length + i + 1,
            };
            uploadedImages.push(newImg);
            if (!currentThumb) {
              currentThumb = res.url;
              setThumbnailUrl(res.url);
              setThumbnailAlt(titleVal || file.name.replace(/\.[^/.]+$/, ""));
            }
          }
        } catch {
          await new Promise<void>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              const localUrl = reader.result as string;
              const newImg: BlogPostImageItem = {
                id: `img-${Date.now()}-${i}`,
                url: localUrl,
                altText: titleVal || file.name.replace(/\.[^/.]+$/, ""),
                isThumbnail: images.length === 0 && !currentThumb,
                displayOrder: images.length + i + 1,
              };
              uploadedImages.push(newImg);
              if (!currentThumb) {
                currentThumb = localUrl;
                setThumbnailUrl(localUrl);
                setThumbnailAlt(titleVal || file.name.replace(/\.[^/.]+$/, ""));
              }
              resolve();
            };
            reader.readAsDataURL(file);
          });
        }
      }

      setImages((prev) => [...prev, ...uploadedImages]);
      toast.update(toastId, {
        render: `Đã thêm ${uploadedImages.length} ảnh vào thư viện!`,
        type: "success",
        isLoading: false,
        autoClose: 2500,
      });
    } finally {
      setIsUploadingGallery(false);
      e.target.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, idx) => idx !== index);
    setImages(updated);
  };

  const handleSetAsThumbnail = (img: BlogPostImageItem) => {
    setThumbnailUrl(img.url);
    setThumbnailAlt(img.altText || titleVal);
    toast.success("Đã đặt làm ảnh đại diện chính.");
  };

  const handleCopyImageMarkdown = (url: string) => {
    const md = `![${titleVal || "Ảnh bài viết"}](${url})`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(md);
      toast.info("Đã sao chép cú pháp chèn ảnh vào bài viết.");
    }
  };

  // Quick tag creation
  const handleQuickAddTag = async () => {
    if (!newTagName.trim()) return;
    if (onCreateTag) {
      const created = await onCreateTag(newTagName.trim());
      if (created) {
        setValue("tagId", created.id, { shouldValidate: true });
      }
    }
    setIsAddingTag(false);
    setNewTagName("");
  };

  // Form submission handler
  const onValidSubmit = async (
    formData: BlogFormData,
    overrideStatus?: BlogPostStatus
  ) => {
    const postStatus = overrideStatus || formData.status;

    const payload: CreateAdminBlogPostDto = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      excerpt: formData.excerpt.trim(),
      contentHtml: formData.contentHtml || `<p>${formData.excerpt.trim()}</p>`,
      tagId: formData.tagId || defaultTagId,
      status: postStatus,
      isFeatured: formData.isFeatured,
      showOnHome: formData.showOnHome,
      readTimeMinutes: Number(formData.readTimeMinutes) || 3,
      publishedAt:
        postStatus === "PUBLISHED"
          ? formData.publishedAt
            ? new Date(formData.publishedAt).toISOString()
            : new Date().toISOString()
          : formData.publishedAt
          ? new Date(formData.publishedAt).toISOString()
          : null,
      metaTitle: formData.metaTitle?.trim() || formData.title.trim(),
      metaDescription:
        formData.metaDescription?.trim() || formData.excerpt.trim(),
      thumbnailUrl: thumbnailUrl.trim() || undefined,
      images: images.map((img, idx) => ({
        url: img.url,
        altText: img.altText || formData.title,
        isThumbnail: img.url === thumbnailUrl,
        displayOrder: idx + 1,
      })),
    };

    await onSave(payload);
  };

  const handleActionSubmit = (overrideStatus?: BlogPostStatus) => {
    handleSubmit(
      (data) => onValidSubmit(data, overrideStatus),
      (validationErrors) => {
        // Auto-switch to tab containing error
        if (
          validationErrors.title ||
          validationErrors.slug ||
          validationErrors.excerpt ||
          validationErrors.contentHtml ||
          validationErrors.tagId
        ) {
          setActiveTab("content");
        } else if (
          validationErrors.metaTitle ||
          validationErrors.metaDescription
        ) {
          setActiveTab("seo");
        }

        const firstErrorKey = Object.keys(validationErrors)[0];
        const firstError =
          validationErrors[firstErrorKey as keyof BlogFormData];
        if (firstError?.message) {
          toast.error(String(firstError.message));
        }
      }
    )();
  };

  const availableTags = tags.length > 0 ? tags : PRESET_BLOG_TAGS;

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={handleRequestClose}
        title={
          isEditMode
            ? "Chỉnh sửa bài viết Blog CMS"
            : "Thêm bài viết mới"
        }
        description={
          isEditMode
            ? initialData
              ? `Mã bài viết: ${initialData.code || initialData.id}`
              : "Đang tải dữ liệu bài viết từ hệ thống..."
            : "Soạn thảo bài viết chia sẻ mẹo, hướng dẫn đan móc len và tối ưu hóa SEO kéo traffic"
        }
        size="half"
        footer={
          <div className="flex items-center justify-between w-full">
            <button
              type="button"
              onClick={handleRequestClose}
              className="px-4 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-hover rounded-md transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>

            {!(isEditMode && isLoadingDetail) && (
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleActionSubmit("DRAFT")}
                  className="px-4 py-2 text-xs font-semibold bg-surface-hover hover:bg-surface-active text-text-highlight border border-border-light rounded-md transition-colors cursor-pointer disabled:opacity-50"
                >
                  Lưu bản nháp
                </button>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() =>
                    handleActionSubmit(
                      statusVal === "HIDDEN" ? "HIDDEN" : "PUBLISHED"
                    )
                  }
                  className="px-4.5 py-2 text-xs font-bold bg-primary hover:bg-primary-hover text-bg-deep rounded-md transition-all shadow-md shadow-primary/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {isEditMode
                      ? "Cập nhật bài viết"
                      : statusVal === "PUBLISHED"
                      ? "Xuất bản ngay"
                      : "Lưu bài viết"}
                  </span>
                </button>
              </div>
            )}
          </div>
        }
      >
        {isEditMode && isLoadingDetail ? (
          <div className="flex flex-col items-center justify-center min-h-[420px] space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-text-highlight">
                Đang tải dữ liệu bài viết...
              </p>
              <p className="text-xs text-text-muted">
                Hệ thống đang tải nội dung chi tiết bài viết và thư viện hình ảnh
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 border-b border-border pb-2 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab("content")}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-md transition-colors shrink-0 cursor-pointer ${
                  activeTab === "content"
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Nội dung & Soạn thảo</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("media")}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-md transition-colors shrink-0 cursor-pointer ${
                  activeTab === "media"
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>
                  Ảnh & Media ({images.length + (thumbnailUrl ? 1 : 0)})
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("seo")}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-md transition-colors shrink-0 cursor-pointer ${
                  activeTab === "seo"
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>Cấu hình & Tối ưu SEO</span>
              </button>
            </div>

            {/* Tab 1: Nội dung & Soạn thảo */}
            {activeTab === "content" && (
              <div className="space-y-5">
                {/* Tiêu đề & Slug */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-primary flex items-center justify-between">
                      <span>Tiêu đề bài viết *</span>
                      <span className="text-[11px] font-normal text-text-muted">
                        {titleVal.length}/220 ký tự
                      </span>
                    </label>
                    <Input
                      placeholder="Ví dụ: Top 5 mẫu móc khóa len hoa tulip xinh xắn được yêu thích nhất..."
                      value={titleVal}
                      onChange={handleTitleChange}
                      error={errors.title?.message}
                      className="h-10 text-sm font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-text-primary">
                        Đường dẫn tĩnh (Slug) *
                      </label>
                      <button
                        type="button"
                        onClick={handleGenerateSlug}
                        className="text-[11px] font-semibold text-primary hover:text-primary-hover flex items-center gap-1 cursor-pointer"
                      >
                        <Wand2 className="w-3 h-3" />
                        <span>Tạo từ tiêu đề</span>
                      </button>
                    </div>
                    <div
                      className={`flex items-center rounded-md border bg-bg-mid overflow-hidden focus-within:border-primary transition-colors ${
                        errors.slug ? "border-status-danger" : "border-border"
                      }`}
                    >
                      <span className="px-3 text-xs text-text-muted select-none border-r border-border/60 bg-surface-muted py-2">
                        /blog/
                      </span>
                      <input
                        type="text"
                        {...register("slug", {
                          required: "Vui lòng nhập đường dẫn tĩnh (slug)",
                          maxLength: {
                            value: 220,
                            message: "Slug tối đa 220 ký tự",
                          },
                          pattern: {
                            value: /^[a-z0-9-]+$/,
                            message:
                              "Slug chỉ chấp nhận chữ thường không dấu, số và dấu gạch ngang",
                          },
                        })}
                        placeholder="top-5-mau-moc-khoa-len-hoa-tulip"
                        className="w-full bg-transparent px-3 py-2 text-xs font-mono text-text-highlight focus:outline-hidden"
                      />
                    </div>
                    {errors.slug && (
                      <p className="text-[11px] text-status-danger mt-1">
                        {errors.slug.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Chủ đề & Tác giả */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-text-primary">
                        Chủ đề bài viết (Tag) *
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsAddingTag(!isAddingTag)}
                        className="text-[11px] font-semibold text-primary hover:text-primary-hover flex items-center gap-0.5 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Thêm tag</span>
                      </button>
                    </div>

                    {isAddingTag ? (
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Nhập tên tag mới..."
                          value={newTagName}
                          onChange={(e) => setNewTagName(e.target.value)}
                          className="h-9 text-xs"
                        />
                        <button
                          type="button"
                          onClick={handleQuickAddTag}
                          className="px-3 h-9 rounded-md bg-primary text-bg-deep font-bold text-xs shrink-0 cursor-pointer"
                        >
                          Lưu
                        </button>
                      </div>
                    ) : (
                      <Controller
                        control={control}
                        name="tagId"
                        rules={{ required: "Vui lòng chọn chủ đề bài viết" }}
                        render={({ field, fieldState }) => (
                          <Select
                            options={availableTags.map((t) => ({
                              label: t.name,
                              value: t.id,
                            }))}
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            error={fieldState.error?.message}
                            className="h-9 text-xs"
                          />
                        )}
                      />
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-primary">
                      Tác giả hiển thị
                    </label>
                    <Input
                      {...register("authorName")}
                      placeholder="Tiệm Len Nhà Kiều"
                      className="h-9 text-xs"
                    />
                  </div>
                </div>

                {/* Tóm tắt bài viết (Excerpt) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-primary flex items-center justify-between">
                    <span>Tóm tắt bài viết (Excerpt / Lead paragraph) *</span>
                    <span className="text-[11px] font-normal text-text-muted">
                      {excerptVal.length}/500 ký tự
                    </span>
                  </label>
                  <textarea
                    {...register("excerpt", {
                      required: "Vui lòng nhập tóm tắt ngắn cho bài viết",
                      maxLength: {
                        value: 500,
                        message: "Tóm tắt không được vượt quá 500 ký tự",
                      },
                    })}
                    rows={3}
                    placeholder="Đoạn mở đầu hoặc tóm tắt ngắn gọn cuốn hút để hiển thị trên danh sách bài viết ngoài trang chủ và mạng xã hội..."
                    className={`w-full rounded-md border bg-bg-mid px-3 py-2.5 text-xs text-text-primary focus:border-primary focus:outline-hidden leading-relaxed resize-y ${
                      errors.excerpt ? "border-status-danger" : "border-border"
                    }`}
                  />
                  {errors.excerpt && (
                    <p className="text-[11px] text-status-danger mt-1">
                      {errors.excerpt.message}
                    </p>
                  )}
                </div>

                {/* TipTap Rich Text Editor */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-text-primary">
                      Nội dung bài viết (Trình soạn thảo TipTap) *
                    </label>
                    <button
                      type="button"
                      onClick={handleCalculateReadTime}
                      className="text-[11px] text-text-secondary hover:text-primary flex items-center gap-1 cursor-pointer"
                      title="Ước tính lại thời gian đọc"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Ước tính thời gian đọc</span>
                    </button>
                  </div>

                  <Controller
                    control={control}
                    name="contentHtml"
                    rules={{
                      required: "Vui lòng nhập nội dung bài viết",
                      validate: (val) => {
                        const textOnly = val
                          ? val.replace(/<[^>]*>/g, "").trim()
                          : "";
                        const hasImg = val && val.includes("<img");
                        if (!textOnly && !hasImg) {
                          return "Nội dung bài viết không được để trống";
                        }
                        return true;
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <div>
                        <TipTapEditor
                          content={field.value}
                          onChange={field.onChange}
                          placeholder="Bắt đầu viết nội dung bài viết hướng dẫn đan móc len hoặc mẹo vặt tại đây..."
                          className={
                            fieldState.error ? "ring-1 ring-status-danger" : ""
                          }
                        />
                        {fieldState.error && (
                          <p className="text-[11px] text-status-danger mt-1.5">
                            {fieldState.error.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Tab 2: Ảnh bìa & Thư viện ảnh */}
            {activeTab === "media" && (
              <div className="space-y-6">
                {/* Hidden file inputs */}
                <input
                  ref={thumbInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUploadThumbnailFile}
                  className="hidden"
                />
                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleUploadGalleryFile}
                  className="hidden"
                />

                {/* Ảnh đại diện chính (Thumbnail) */}
                <div className="p-4 rounded-lg bg-bg-mid border border-border space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-text-highlight flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-primary" />
                      <span>Ảnh đại diện chính (Thumbnail / OpenGraph)</span>
                    </h4>

                    <button
                      type="button"
                      disabled={isUploadingThumb}
                      onClick={() => thumbInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-md bg-primary hover:bg-primary-hover text-bg-deep text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm shadow-primary/20 disabled:opacity-50"
                    >
                      {isUploadingThumb ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <UploadCloud className="w-3.5 h-3.5" />
                      )}
                      <span>Tải ảnh từ máy</span>
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="relative w-full sm:w-44 aspect-4/3 rounded-lg overflow-hidden border border-border bg-surface shrink-0">
                      {thumbnailUrl ? (
                        <Image
                          src={thumbnailUrl}
                          alt={thumbnailAlt || "Thumbnail"}
                          fill
                          sizes="180px"
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-text-muted p-2 text-center">
                          <ImageIcon className="w-8 h-8 opacity-30 mb-1" />
                          <span className="text-[10px]">
                            Chưa có ảnh đại diện
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-3 w-full">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-text-secondary">
                          Thẻ Alt mô tả ảnh (Tối ưu SEO)
                        </label>
                        <Input
                          placeholder="Ví dụ: Móc khóa hoa tulip len màu pastel"
                          value={thumbnailAlt}
                          onChange={(e) => setThumbnailAlt(e.target.value)}
                          className="h-8.5 text-xs"
                        />
                      </div>

                      {thumbnailUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setThumbnailUrl("");
                            setThumbnailAlt("");
                          }}
                          className="text-xs text-status-danger hover:underline flex items-center gap-1 cursor-pointer pt-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Gỡ ảnh đại diện</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Thư viện ảnh đính kèm bài viết */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-text-highlight">
                        Thư viện ảnh đính kèm bài viết
                      </h4>
                      <p className="text-[11px] text-text-muted">
                        Tải ảnh từ máy tính (có thể chọn cùng lúc nhiều ảnh) để
                        lưu trữ và tái sử dụng trong bài viết
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={isUploadingGallery}
                      onClick={() => galleryInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-md bg-surface-hover hover:bg-surface-active text-text-highlight border border-border-light text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {isUploadingGallery ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <UploadCloud className="w-3.5 h-3.5" />
                      )}
                      <span>Tải ảnh từ máy</span>
                    </button>
                  </div>

                  {/* Images Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative group rounded-lg border border-border overflow-hidden bg-surface"
                      >
                        <div className="relative aspect-4/3 w-full bg-surface-muted">
                          <Image
                            src={img.url}
                            alt={img.altText || `Ảnh ${idx + 1}`}
                            fill
                            sizes="180px"
                            className="object-cover"
                            unoptimized
                          />
                        </div>

                        <div className="p-2 bg-surface-deep/90 border-t border-border flex items-center justify-between gap-1">
                          <span className="text-[10px] text-text-muted truncate max-w-[90px]">
                            {img.altText || `Ảnh #${idx + 1}`}
                          </span>

                          <div className="flex items-center gap-1">
                            {img.url === thumbnailUrl ? (
                              <Badge variant="success" size="sm">
                                Đại diện
                              </Badge>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSetAsThumbnail(img)}
                                className="text-[10px] text-text-secondary hover:text-primary cursor-pointer"
                              >
                                Đặt làm bìa
                              </button>
                            )}

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() =>
                                  handleCopyImageMarkdown(img.url)
                                }
                                className="p-1 rounded text-text-muted hover:text-text-primary"
                                title="Sao chép cú pháp chèn vào bài"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                className="p-1 rounded text-text-muted hover:text-status-danger"
                                title="Xóa ảnh"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {images.length === 0 && (
                      <div className="col-span-full py-6 text-center border border-dashed border-border rounded-lg text-text-muted text-xs">
                        Chưa có ảnh nào trong thư viện đính kèm.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Cấu hình & Tối ưu SEO */}
            {activeTab === "seo" && (
              <div className="space-y-6">
                {/* Publishing Controls */}
                <div className="p-4 rounded-lg bg-bg-mid border border-border space-y-4">
                  <h4 className="text-xs font-bold text-text-highlight">
                    Cấu hình xuất bản & Hiển thị
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-text-primary">
                        Trạng thái bài viết
                      </label>
                      <Controller
                        control={control}
                        name="status"
                        render={({ field }) => (
                          <Select
                            options={[
                              {
                                label: "Bản nháp (Chưa công khai)",
                                value: "DRAFT",
                              },
                              {
                                label: "Đã xuất bản (Công khai)",
                                value: "PUBLISHED",
                              },
                              {
                                label: "Lưu trữ / Ẩn (Ẩn khỏi web)",
                                value: "HIDDEN",
                              },
                            ]}
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(e.target.value as BlogPostStatus)
                            }
                            className="h-9 text-xs"
                          />
                        )}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-text-primary">
                        Thời gian đọc ước tính (Phút)
                      </label>
                      <Input
                        type="number"
                        min={1}
                        max={120}
                        {...register("readTimeMinutes", {
                          valueAsNumber: true,
                          min: { value: 1, message: "Tối thiểu 1 phút" },
                          max: { value: 120, message: "Tối đa 120 phút" },
                        })}
                        error={errors.readTimeMinutes?.message}
                        className="h-9 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/60">
                    <div className="flex items-center justify-between p-2.5 rounded-md bg-surface border border-border">
                      <div>
                        <p className="text-xs font-bold text-text-highlight">
                          Bài viết nổi bật
                        </p>
                        <p className="text-[11px] text-text-muted">
                          Hiển thị lớn ở banner đầu trang blog
                        </p>
                      </div>
                      <Controller
                        control={control}
                        name="isFeatured"
                        render={({ field }) => (
                          <Switch
                            checked={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-md bg-surface border border-border">
                      <div>
                        <p className="text-xs font-bold text-text-highlight">
                          Hiển thị ngoài trang chủ
                        </p>
                        <p className="text-[11px] text-text-muted">
                          Xuất hiện tại khối Tin tức trang chủ
                        </p>
                      </div>
                      <Controller
                        control={control}
                        name="showOnHome"
                        render={({ field }) => (
                          <Switch
                            checked={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* SEO Meta Tags */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-primary flex items-center justify-between">
                      <span>Tiêu đề SEO (Meta Title)</span>
                      <span
                        className={`text-[11px] font-mono ${
                          metaTitleVal.length > 60
                            ? "text-status-danger"
                            : metaTitleVal.length >= 40
                            ? "text-emerald-400"
                            : "text-text-muted"
                        }`}
                      >
                        {metaTitleVal.length}/60 ký tự
                      </span>
                    </label>
                    <Input
                      placeholder="Để trống sẽ tự động lấy theo tiêu đề bài viết..."
                      {...register("metaTitle", {
                        maxLength: {
                          value: 180,
                          message: "Tiêu đề SEO không được vượt quá 180 ký tự",
                        },
                      })}
                      error={errors.metaTitle?.message}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-primary flex items-center justify-between">
                      <span>Mô tả SEO (Meta Description)</span>
                      <span
                        className={`text-[11px] font-mono ${
                          metaDescriptionVal.length > 160
                            ? "text-status-danger"
                            : metaDescriptionVal.length >= 120
                            ? "text-emerald-400"
                            : "text-text-muted"
                        }`}
                      >
                        {metaDescriptionVal.length}/160 ký tự
                      </span>
                    </label>
                    <textarea
                      {...register("metaDescription", {
                        maxLength: {
                          value: 300,
                          message: "Mô tả SEO không được vượt quá 300 ký tự",
                        },
                      })}
                      rows={3}
                      placeholder="Để trống sẽ tự động lấy theo tóm tắt bài viết..."
                      className={`w-full rounded-md border bg-bg-mid px-3 py-2 text-xs text-text-primary focus:border-primary focus:outline-hidden leading-relaxed resize-y ${
                        errors.metaDescription
                          ? "border-status-danger"
                          : "border-border"
                      }`}
                    />
                    {errors.metaDescription && (
                      <p className="text-[11px] text-status-danger mt-1">
                        {errors.metaDescription.message}
                      </p>
                    )}
                  </div>

                  {/* Google SERP Snippet Preview */}
                  <div className="p-4 rounded-lg bg-bg-mid border border-border space-y-2">
                    <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                      Mô phỏng kết quả tìm kiếm Google (SERP Preview)
                    </p>

                    <div className="p-3.5 rounded-md bg-[#161b2e] border border-border/80 space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <span className="font-semibold text-emerald-400">
                          tiemlennhakieu.vn
                        </span>
                        <span>›</span>
                        <span className="truncate">
                          blog › {slugVal || "bai-viet"}
                        </span>
                      </div>

                      <h5 className="text-sm font-bold text-blue-400 hover:underline cursor-pointer truncate">
                        {metaTitleVal ||
                          titleVal ||
                          "Tiêu đề bài viết hiển thị trên Google..."}
                      </h5>

                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {metaDescriptionVal ||
                          excerptVal ||
                          "Mô tả ngắn gọn về nội dung bài viết hướng dẫn đan móc len handmade giúp người dùng bấm vào từ công cụ tìm kiếm..."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* Close confirmation modal when form is dirty */}
      <Modal
        isOpen={showCloseConfirmModal}
        onClose={() => setShowCloseConfirmModal(false)}
        type="WARNING"
        title="Xác nhận thoát & lưu thay đổi"
        description="Nội dung bài viết đã được chỉnh sửa nhưng chưa được lưu lại. Bạn có muốn lưu các thay đổi này trước khi đóng không?"
        size="md"
        footer={
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 w-full">
            <Button
              variant="secondary"
              onClick={() => setShowCloseConfirmModal(false)}
              disabled={isLoading}
            >
              Tiếp tục sửa
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="danger"
                onClick={handleForceClose}
                disabled={isLoading}
              >
                Hủy bỏ thay đổi
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setShowCloseConfirmModal(false);
                  handleActionSubmit();
                }}
                isLoading={isLoading}
              >
                Lưu bài viết
              </Button>
            </div>
          </div>
        }
      />
    </>
  );
}
