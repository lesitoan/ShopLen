"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Tag, Plus, Edit2, Trash2, Check, X, Loader2 } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { Modal } from "@/components/ui/Modal";
import {
  useListBlogTagsQuery,
  useCreateBlogTagMutation,
  useUpdateBlogTagMutation,
  useDeleteBlogTagMutation,
} from "@/services/api/blogApi";
import type { BlogPostTag } from "@/types/blog.type";
import { toast } from "react-toastify";

interface BlogTagsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TagFormData {
  name: string;
  slug: string;
}

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

export function BlogTagsDrawer({ isOpen, onClose }: BlogTagsDrawerProps) {
  const { data: tags = [], isLoading: isFetchingTags } = useListBlogTagsQuery(
    undefined,
    { skip: !isOpen }
  );

  const [createTag, { isLoading: isCreating }] = useCreateBlogTagMutation();
  const [updateTag, { isLoading: isUpdating }] = useUpdateBlogTagMutation();
  const [deleteTag, { isLoading: isDeleting }] = useDeleteBlogTagMutation();

  const [editingTag, setEditingTag] = useState<BlogPostTag | null>(null);
  const [pendingDeleteTag, setPendingDeleteTag] = useState<BlogPostTag | null>(null);
  const [isSlugTouched, setIsSlugTouched] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TagFormData>({
    defaultValues: {
      name: "",
      slug: "",
    },
    mode: "onBlur",
  });

  const nameVal = watch("name") || "";
  const slugVal = watch("slug") || "";

  // Reset form when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setEditingTag(null);
      setIsSlugTouched(false);
      reset({ name: "", slug: "" });
    }
  }, [isOpen, reset]);

  // Handle name input change with auto-slug
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue("name", val, { shouldValidate: true });
    if (!isSlugTouched && !editingTag) {
      setValue("slug", slugifyVietnamese(val), { shouldValidate: true });
    }
  };

  // Handle slug manual change
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSlugTouched(true);
    const val = e.target.value.toLowerCase().replace(/\s+/g, "-");
    setValue("slug", val, { shouldValidate: true });
  };

  const handleSlugBlur = () => {
    const cleanSlug = slugVal.replace(/^-+|-+$/g, "");
    setValue("slug", cleanSlug, { shouldValidate: true });
  };

  // Start editing a tag
  const handleStartEdit = (tag: BlogPostTag) => {
    setEditingTag(tag);
    setIsSlugTouched(true);
    setValue("name", tag.name, { shouldValidate: true });
    setValue("slug", tag.slug, { shouldValidate: true });
  };

  const handleCancelEdit = () => {
    setEditingTag(null);
    setIsSlugTouched(false);
    reset({ name: "", slug: "" });
  };

  // Submit create or update
  const onSubmit = async (data: TagFormData) => {
    const trimmedName = data.name.trim();
    const trimmedSlug =
      data.slug?.trim().replace(/^-+|-+$/g, "") ||
      slugifyVietnamese(trimmedName);

    try {
      if (editingTag) {
        await updateTag({
          id: editingTag.id,
          data: { name: trimmedName, slug: trimmedSlug },
        }).unwrap();
        toast.success(`Đã cập nhật chủ đề "${trimmedName}".`);
        handleCancelEdit();
      } else {
        await createTag({
          name: trimmedName,
          slug: trimmedSlug,
        }).unwrap();
        toast.success(`Đã thêm chủ đề "${trimmedName}".`);
        reset({ name: "", slug: "" });
        setIsSlugTouched(false);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Không thể lưu chủ đề.");
    }
  };

  // Delete tag
  const handleConfirmDelete = async () => {
    if (!pendingDeleteTag) return;
    try {
      await deleteTag(pendingDeleteTag.id).unwrap();
      toast.success(`Đã xóa chủ đề "${pendingDeleteTag.name}".`);
      if (editingTag?.id === pendingDeleteTag.id) {
        handleCancelEdit();
      }
      setPendingDeleteTag(null);
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          "Không thể xóa chủ đề này do đang có bài viết liên kết."
      );
    }
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        title="Quản lý chủ đề"
        description="Phân loại bài viết blog theo chủ đề"
        size="sm"
      >
        <div className="space-y-6">
          {/* Quick Create / Edit Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-2.5"
          >
            {editingTag && (
              <div className="flex items-center justify-between px-0.5">
                <span className="text-xs font-semibold text-primary flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Sửa chủ đề: {editingTag.name}</span>
                </span>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-xs text-text-muted hover:text-text-primary cursor-pointer flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  <span>Hủy</span>
                </button>
              </div>
            )}

            <div className="space-y-1">
              <input
                type="text"
                placeholder="Tên chủ đề (ví dụ: Mẹo đan móc len)..."
                value={nameVal}
                onChange={handleNameChange}
                className={`w-full h-[38px] px-3 bg-surface-muted text-text-primary placeholder:text-text-muted text-xs font-medium rounded-md border ${
                  errors.name ? "border-status-danger" : "border-border"
                } transition-colors outline-none focus:border-primary focus:ring-1 focus:ring-primary`}
              />
              <input
                type="hidden"
                {...register("name", {
                  required: "Vui lòng nhập tên chủ đề",
                  maxLength: { value: 100, message: "Tối đa 100 ký tự" },
                })}
              />
              {errors.name && (
                <p className="text-[11px] text-status-danger">{errors.name.message}</p>
              )}
            </div>

            <div className="flex items-start gap-2">
              <div className="flex-1 space-y-1">
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-mono text-text-muted/60 select-none pointer-events-none">
                    slug:
                  </span>
                  <input
                    type="text"
                    placeholder="meo-dan-moc-len"
                    value={slugVal}
                    onChange={handleSlugChange}
                    onBlur={handleSlugBlur}
                    className={`w-full h-[38px] pl-[50px] pr-3 bg-surface-muted text-text-primary placeholder:text-text-muted/40 text-xs font-mono rounded-md border ${
                      errors.slug ? "border-status-danger" : "border-border"
                    } transition-colors outline-none focus:border-primary focus:ring-1 focus:ring-primary`}
                  />
                  <input
                    type="hidden"
                    {...register("slug", {
                      required: "Vui lòng nhập slug",
                      maxLength: { value: 120, message: "Tối đa 120 ký tự" },
                      pattern: {
                        value: /^[a-z0-9-]+$/,
                        message: "Slug chỉ gồm ký tự thường không dấu và gạch ngang (-)",
                      },
                    })}
                  />
                </div>
                {errors.slug && (
                  <p className="text-[11px] text-status-danger">{errors.slug.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="h-[38px] px-4 rounded-md bg-primary hover:bg-primary-hover active:bg-primary-active text-bg-deep font-bold text-xs shrink-0 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : editingTag ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
                <span>{editingTag ? "Lưu" : "Thêm"}</span>
              </button>
            </div>
          </form>

          {/* Tags List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                Danh sách ({tags.length})
              </span>
            </div>

            {isFetchingTags ? (
              <div className="flex flex-col items-center justify-center py-10 text-text-muted">
                <Loader2 className="w-6 h-6 animate-spin text-primary mb-2" />
                <span className="text-xs">Đang tải chủ đề...</span>
              </div>
            ) : tags.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-border rounded-lg text-text-muted text-xs">
                Chưa có chủ đề nào. Hãy thêm chủ đề đầu tiên ở trên.
              </div>
            ) : (
              <div className="space-y-1.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                {tags.map((t) => {
                  const postCount = t._count?.posts ?? 0;
                  const isCurrentlyEditing = editingTag?.id === t.id;

                  return (
                    <div
                      key={t.id}
                      className={`flex items-center justify-between p-2.5 rounded-md border transition-all ${
                        isCurrentlyEditing
                          ? "bg-primary/10 border-primary/40 shadow-xs"
                          : "bg-surface hover:bg-surface-hover border-border"
                      }`}
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-text-highlight truncate">
                            {t.name}
                          </span>
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-surface-muted text-text-muted shrink-0">
                            {postCount} bài
                          </span>
                        </div>
                        <p className="text-[10px] font-mono text-text-muted truncate mt-0.5">
                          {t.slug}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(t)}
                          className="p-1.5 rounded hover:bg-surface-muted text-text-secondary hover:text-primary transition-colors cursor-pointer"
                          title="Sửa"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingDeleteTag(t)}
                          className="p-1.5 rounded hover:bg-status-danger/10 text-text-muted hover:text-status-danger transition-colors cursor-pointer"
                          title="Xóa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Drawer>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(pendingDeleteTag)}
        onClose={() => setPendingDeleteTag(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        type="DANGER"
        title="Xóa chủ đề"
        description={`Bạn có chắc chắn muốn xóa chủ đề "${pendingDeleteTag?.name}" không?`}
        confirmText="Xóa chủ đề"
        cancelText="Bỏ qua"
        size="sm"
      />
    </>
  );
}
