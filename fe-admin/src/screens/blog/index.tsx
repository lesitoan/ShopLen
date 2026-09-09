"use client";

import React, { useState, useMemo } from "react";
import { Plus, Tag } from "lucide-react";
import { useTableFilters } from "@/hooks/useTableFilters";
import {
  useListBlogPostsQuery,
  useGetBlogPostDetailQuery,
  useListBlogTagsQuery,
  useCreateBlogPostMutation,
  useUpdateBlogPostMutation,
  useUpdateBlogPostStatusMutation,
  useDeleteBlogPostMutation,
  useCreateBlogTagMutation,
} from "@/services/api/blogApi";
import type {
  BlogPostListItem,
  BlogPostDetail,
  BlogPostStatus,
  CreateAdminBlogPostDto,
  AdminBlogPostListQueryDto,
} from "@/types/blog.type";
import {
  DEFAULT_BLOG_FILTERS,
  PRESET_BLOG_TAGS,
} from "./constants";
import { BlogFilterBar } from "./components/BlogFilterBar";
import { BlogTable } from "./components/BlogTable";
import { BlogDrawerForm } from "./components/BlogDrawerForm";
import { BlogTagsDrawer } from "./components/BlogTagsDrawer";
import { BlogPreviewModal } from "./components/BlogPreviewModal";
import { Modal } from "@/components/ui/Modal";
import { toast } from "react-toastify";

export function BlogListScreen() {
  const { filters, setFilter, setFilters, resetFilters } = useTableFilters(
    DEFAULT_BLOG_FILTERS
  );

  // Modal / Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isTagsDrawerOpen, setIsTagsDrawerOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [previewPost, setPreviewPost] = useState<BlogPostListItem | null>(null);
  const [pendingDeletePost, setPendingDeletePost] =
    useState<BlogPostListItem | null>(null);

  // Queries
  const queryDto: AdminBlogPostListQueryDto = useMemo(() => {
    return {
      page: filters.page,
      limit: filters.limit,
      search: filters.search.trim() || undefined,
      tagId: filters.tagId || undefined,
      status: (filters.status as BlogPostStatus) || undefined,
      sort: filters.sort,
    };
  }, [filters]);

  const { data: apiData, isLoading, isFetching } = useListBlogPostsQuery(
    queryDto
  );
  const { data: apiTags } = useListBlogTagsQuery();

  const { data: editingPostDetail, isFetching: isFetchingDetail } =
    useGetBlogPostDetailQuery(editingPostId!, {
      skip: !editingPostId,
    });

  // Mutations
  const [createPost, { isLoading: isCreating }] = useCreateBlogPostMutation();
  const [updatePost, { isLoading: isUpdating }] = useUpdateBlogPostMutation();
  const [updateStatus] = useUpdateBlogPostStatusMutation();
  const [deletePost, { isLoading: isDeleting }] = useDeleteBlogPostMutation();
  const [createTag] = useCreateBlogTagMutation();

  const availableTags = apiTags && apiTags.length > 0 ? apiTags : PRESET_BLOG_TAGS;

  // Real API posts display
  const { posts, totalItems } = useMemo(() => {
    if (apiData) {
      return {
        posts: apiData.items,
        totalItems: apiData.pagination.total,
      };
    }

    return {
      posts: [],
      totalItems: 0,
    };
  }, [apiData]);

  // Handlers
  const handleFilterChange = (
    updated: Partial<typeof DEFAULT_BLOG_FILTERS>
  ) => {
    setFilters(updated);
  };

  const handleSavePost = async (postData: CreateAdminBlogPostDto) => {
    try {
      if (editingPostId) {
        await updatePost({
          id: editingPostId,
          data: postData,
        }).unwrap();
        toast.success("Cập nhật bài viết thành công!");
      } else {
        await createPost(postData).unwrap();
        toast.success("Tạo bài viết mới thành công!");
      }
      setIsDrawerOpen(false);
      setEditingPostId(null);
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.message ||
        "Có lỗi xảy ra khi lưu bài viết. Vui lòng kiểm tra lại.";
      toast.error(message);
    }
  };

  const handleToggleStatus = async (
    post: BlogPostListItem,
    nextStatus: BlogPostStatus
  ) => {
    try {
      await updateStatus({ id: post.id, status: nextStatus }).unwrap();
      toast.success(`Đã chuyển trạng thái bài viết sang "${nextStatus}".`);
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.message ||
        "Không thể cập nhật trạng thái bài viết.";
      toast.error(message);
    }
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeletePost) return;
    try {
      await deletePost(pendingDeletePost.id).unwrap();
      toast.success("Đã xóa bài viết thành công.");
      setPendingDeletePost(null);
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.message ||
        "Không thể xóa bài viết. Vui lòng thử lại.";
      toast.error(message);
    }
  };

  const handleCreateTag = async (name: string) => {
    try {
      const created = await createTag({ name }).unwrap();
      toast.success(`Đã tạo chủ đề mới: "${name}"`);
      return created;
    } catch {
      toast.info(`Đã áp dụng chủ đề: "${name}"`);
      return {
        id: `tag-${Date.now()}`,
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
      };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-highlight tracking-tight">
            Quản lý Bài Viết Blog CMS
          </h1>

        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsTagsDrawerOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-3.5 h-[38px] bg-surface hover:bg-surface-hover active:bg-surface-active text-text-highlight border border-border font-semibold text-xs rounded-lg transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <Tag className="w-3.5 h-3.5 text-primary" />
            <span>Chủ đề</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingPostId(null);
              setIsDrawerOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 h-[38px] bg-primary hover:bg-primary-hover active:bg-primary-active text-bg-deep font-bold text-xs rounded-lg transition-all shadow-md shadow-primary/25 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Viết bài mới</span>
          </button>
        </div>
      </div>

      <BlogFilterBar
        filters={filters}
        tags={availableTags}
        onFilterChange={handleFilterChange}
        onResetFilter={resetFilters}
      />

      <BlogTable
        posts={posts}
        totalItems={totalItems}
        page={filters.page}
        pageSize={filters.limit}
        isLoading={isLoading || isFetching}
        onPageChange={(page) => setFilter("page", page)}
        onEditPost={(post) => {
          setEditingPostId(post.id);
          setIsDrawerOpen(true);
        }}
        onPreviewPost={(post) => setPreviewPost(post)}
        onDeletePost={(post) => setPendingDeletePost(post)}
        onToggleStatus={handleToggleStatus}
      />

      <BlogDrawerForm
        isOpen={isDrawerOpen}
        isEditMode={Boolean(editingPostId)}
        isLoadingDetail={
          Boolean(editingPostId) &&
          (isFetchingDetail ||
            !editingPostDetail ||
            editingPostDetail.id !== editingPostId)
        }
        initialData={editingPostId ? editingPostDetail || null : null}
        tags={availableTags}
        isLoading={isCreating || isUpdating}
        onSave={handleSavePost}
        onClose={() => {
          setIsDrawerOpen(false);
          setEditingPostId(null);
        }}
        onCreateTag={handleCreateTag}
      />

      <BlogPreviewModal
        isOpen={Boolean(previewPost)}
        onClose={() => setPreviewPost(null)}
        post={previewPost}
      />

      <BlogTagsDrawer
        isOpen={isTagsDrawerOpen}
        onClose={() => setIsTagsDrawerOpen(false)}
      />

      <Modal
        isOpen={Boolean(pendingDeletePost)}
        onClose={() => setPendingDeletePost(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        type="DANGER"
        title="Xác nhận xóa bài viết"
        description={`Bạn có chắc chắn muốn xóa vĩnh viễn bài viết "${pendingDeletePost?.title}" không? Thao tác này không thể hoàn tác.`}
        confirmText="Xác nhận xóa"
        cancelText="Bỏ qua"
        size="sm"
      />
    </div>
  );
}
