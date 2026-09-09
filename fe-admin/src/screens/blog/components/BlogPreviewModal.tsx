"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import {
  X,
  Clock,
  Eye,
  Calendar,
  User,
  ShoppingBag,
  Share2,
  Bookmark,
  ChevronRight,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import type { BlogPostDetail, BlogPostListItem } from "@/types/blog.type";

interface BlogPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: BlogPostDetail | BlogPostListItem | null;
}

export function BlogPreviewModal({
  isOpen,
  onClose,
  post,
}: BlogPreviewModalProps) {
  if (!post) return null;

  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "Chưa xuất bản (Bản xem trước)";

  const contentHtml = (post as BlogPostDetail).contentHtml || post.excerpt;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <span className="text-primary font-semibold">Xem trước giao diện Storefront</span>
          <span>•</span>
          <span className="font-mono text-xs text-text-secondary">/{post.slug}</span>
        </div>
      }
      size="xl"
      cancelText="Đóng xem trước"
    >
      <div className="bg-[#111524] -m-6 p-6 sm:p-10 rounded-b-lg text-slate-200 max-h-[75vh] overflow-y-auto scrollbar-thin scrollbar-thumb-border">
        {/* Client Breadcrumb Preview */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-6">
          <span>Trang chủ</span>
          <ChevronRight className="w-3 h-3" />
          <span>Bài viết & Mẹo vặt</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-emerald-400 truncate max-w-[240px]">{post.tag?.name}</span>
        </div>

        {/* Header Section */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {post.tag?.name || "Chủ đề len handmade"}
            </span>
            {post.isFeatured && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Nổi bật
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 italic border-l-4 border-emerald-500 pl-4 py-1">
            {post.excerpt}
          </p>

          {/* Author info bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-800 text-xs sm:text-sm text-slate-400">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-slate-950 text-sm">
                {(post.author?.fullName || "TK").slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-slate-100">
                  {post.author?.fullName || "Tiệm Len Nhà Kiều"}
                </p>
                <p className="text-xs text-slate-500">Tác giả biên tập</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-500" />
                {publishedDate}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-500" />
                {post.readTimeMinutes || 4} phút đọc
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-slate-500" />
                {post.viewCount || 0} lượt xem
              </span>
            </div>
          </div>

          {/* Hero Thumbnail */}
          {post.thumbnail?.url && (
            <div className="relative w-full aspect-16/9 rounded-xl overflow-hidden shadow-2xl border border-slate-800 mt-6">
              <Image
                src={post.thumbnail.url}
                alt={post.thumbnail.altText || post.title}
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover"
                unoptimized
              />
            </div>
          )}

          {/* Article Body Content */}
          <div className="pt-8 space-y-6 text-slate-200 leading-relaxed text-base">
            <div
              className="prose prose-invert max-w-none space-y-4 clearfix after:content-[''] after:table after:clear-both [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-emerald-400 [&>h2]:pt-4 [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:text-slate-100 [&>p]:leading-relaxed [&>p]:after:content-[''] [&>p]:after:table [&>p]:after:clear-both [&>ul]:list-disc [&>ul]:pl-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>blockquote]:border-l-4 [&>blockquote]:border-emerald-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-slate-300"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </div>

          {/* Related Products CTA Preview */}
          <div className="mt-12 p-6 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-500 text-slate-950 font-bold">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">
                    Sản phẩm xuất hiện trong bài viết
                  </h4>
                  <p className="text-xs text-slate-400">
                    Đặt móc khóa len làm theo yêu cầu ngay hôm nay
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="px-3.5 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition-colors"
              >
                Xem shop
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
