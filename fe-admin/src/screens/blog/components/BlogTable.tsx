"use client";

import React from "react";
import Image from "next/image";
import {
  Eye,
  Edit2,
  Trash2,
  Copy,
  ExternalLink,
  Sparkles,
  Home,
  Clock,
  Send,
  Archive,
} from "lucide-react";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Tooltip } from "@/components/ui/Tooltip";
import type { BlogPostListItem, BlogPostStatus } from "@/types/blog.type";
import { BLOG_STATUS_MAP } from "../constants";
import { toast } from "react-toastify";

interface BlogTableProps {
  posts: BlogPostListItem[];
  totalItems: number;
  page: number;
  pageSize: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onEditPost: (post: BlogPostListItem) => void;
  onPreviewPost: (post: BlogPostListItem) => void;
  onDeletePost: (post: BlogPostListItem) => void;
  onToggleStatus: (post: BlogPostListItem, nextStatus: BlogPostStatus) => void;
}

export function BlogTable({
  posts,
  totalItems,
  page,
  pageSize,
  isLoading,
  onPageChange,
  onEditPost,
  onPreviewPost,
  onDeletePost,
  onToggleStatus,
}: BlogTableProps) {
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const handleCopyLink = (e: React.MouseEvent, slug: string) => {
    e.stopPropagation();
    const url = `${window.location.origin.replace("-admin", "")}/blog/${slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      toast.info("Đã sao chép đường dẫn bài viết vào bộ nhớ tạm.");
    }
  };

  const columns: Column<BlogPostListItem>[] = [
    {
      key: "title",
      header: "Bài viết",
      width: "36%",
      render: (post) => {
        const thumb = post.thumbnail?.url || "/images/blog-placeholder.png";

        return (
          <div className="flex items-center gap-3.5 py-1">
            <div className="relative w-14 h-12 rounded-md overflow-hidden bg-surface-muted border border-border shrink-0">
              <Image
                src={thumb}
                alt={post.thumbnail?.altText || post.title}
                fill
                sizes="56px"
                className="object-cover"
                unoptimized
              />
            </div>

            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="flex items-center gap-2">
                <span
                  title={post.title}
                  onClick={() => onEditPost(post)}
                  className="font-semibold text-text-highlight text-sm hover:text-primary transition-colors truncate cursor-pointer"
                >
                  {post.title}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-text-muted">
                <span
                  title={post.slug}
                  className="truncate max-w-[200px] text-[11px] font-mono"
                >
                  /{post.slug}
                </span>
                <button
                  type="button"
                  onClick={(e) => handleCopyLink(e, post.slug)}
                  className="p-0.5 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                  title="Sao chép link bài viết"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: "tag",
      header: "Chủ đề",
      width: "16%",
      render: (post) => (
        <Badge variant="neutral" size="sm">
          {post.tag?.name || "Chưa gắn tag"}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      width: "14%",
      render: (post) => {
        const conf = BLOG_STATUS_MAP[post.status] || {
          label: post.status,
          variant: "neutral" as const,
        };

        return (
          <Badge variant={conf.variant} dot size="sm">
            {conf.label}
          </Badge>
        );
      },
    },
    {
      key: "metrics",
      header: "Hiển thị & Lượt xem",
      width: "16%",
      render: (post) => (
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-3 text-text-secondary">
            <span className="inline-flex items-center gap-1 text-[11px]">
              <Eye className="w-3.5 h-3.5 text-text-muted" />
              <span className="font-semibold text-text-primary">
                {post.viewCount || 0}
              </span>{" "}
              lượt xem
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-text-muted">
              <Clock className="w-3 h-3" />
              {post.readTimeMinutes || 3} phút
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {post.isFeatured && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/15 text-primary border border-primary/25">
                <Sparkles className="w-2.5 h-2.5" />
                Nổi bật
              </span>
            )}
            {post.showOnHome && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/25">
                <Home className="w-2.5 h-2.5" />
                Trang chủ
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "publishedAt",
      header: "Ngày đăng",
      width: "12%",
      render: (post) => {
        const dateStr = post.publishedAt
          ? new Date(post.publishedAt).toLocaleDateString("vi-VN")
          : "Chưa đăng";

        return (
          <div className="space-y-0.5 text-xs">
            <p className="font-medium text-text-primary">{dateStr}</p>
            <p
              title={post.author?.fullName || "Tiệm Len Nhà Kiều"}
              className="text-[11px] text-text-muted truncate max-w-[110px]"
            >
              {post.author?.fullName || "Tiệm Len Nhà Kiều"}
            </p>
          </div>
        );
      },
    },
    {
      key: "actions",
      header: <div className="text-right">Thao tác</div>,
      align: "right",
      width: "12%",
      render: (post) => (
        <div className="flex items-center justify-end gap-1">
          {/* Preview action */}
          <button
            type="button"
            onClick={() => onPreviewPost(post)}
            className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors cursor-pointer"
            title="Xem trước giao diện"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Quick Publish / Unpublish action */}
          {post.status === "DRAFT" ? (
            <button
              type="button"
              onClick={() => onToggleStatus(post, "PUBLISHED")}
              className="p-1.5 rounded-md text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors cursor-pointer"
              title="Xuất bản ngay"
            >
              <Send className="w-4 h-4" />
            </button>
          ) : post.status === "PUBLISHED" ? (
            <button
              type="button"
              onClick={() => onToggleStatus(post, "HIDDEN")}
              className="p-1.5 rounded-md text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 transition-colors cursor-pointer"
              title="Chuyển sang Lưu trữ / Ẩn"
            >
              <Archive className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onToggleStatus(post, "PUBLISHED")}
              className="p-1.5 rounded-md text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors cursor-pointer"
              title="Khôi phục & Xuất bản"
            >
              <Send className="w-4 h-4" />
            </button>
          )}

          {/* Edit action */}
          <button
            type="button"
            onClick={() => onEditPost(post)}
            className="p-1.5 rounded-md text-text-muted hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
            title="Chỉnh sửa bài viết"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          {/* Delete action */}
          <button
            type="button"
            onClick={() => onDeletePost(post)}
            className="p-1.5 rounded-md text-text-muted hover:text-status-danger hover:bg-status-danger/10 transition-colors cursor-pointer"
            title="Xóa bài viết"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={posts}
      isLoading={isLoading}
      emptyMessage="Không tìm thấy bài viết nào phù hợp với bộ lọc."
      keyExtractor={(item) => item.id}
      pagination={{
        currentPage: page,
        totalPages,
        totalItems,
        pageSize,
        onPageChange,
      }}
    />
  );
}
