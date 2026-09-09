"use client";

import React from "react";
import { FileText, CheckCircle2, FileEdit, Eye } from "lucide-react";
import type { BlogPostListItem } from "@/types/blog.type";

interface BlogStatsCardsProps {
  posts: BlogPostListItem[];
  totalFromApi?: number;
}

export function BlogStatsCards({ posts, totalFromApi }: BlogStatsCardsProps) {
  const totalPosts = totalFromApi ?? posts.length;
  const publishedPosts = posts.filter((p) => p.status === "PUBLISHED").length;
  const draftPosts = posts.filter((p) => p.status === "DRAFT").length;
  const totalViews = posts.reduce((sum, p) => sum + (p.viewCount || 0), 0);

  const stats = [
    {
      title: "Tổng số bài viết",
      value: totalPosts,
      subtext: "Bao gồm cả bài nháp & lưu trữ",
      icon: FileText,
      iconBg: "bg-blue-500 text-white shadow-md shadow-blue-500/30",
    },
    {
      title: "Đã xuất bản",
      value: publishedPosts,
      subtext: "Đang hiển thị ngoài cửa hàng",
      icon: CheckCircle2,
      iconBg: "bg-emerald-500 text-white shadow-md shadow-emerald-500/30",
    },
    {
      title: "Bản nháp",
      value: draftPosts,
      subtext: "Đang biên tập nội dung",
      icon: FileEdit,
      iconBg: "bg-amber-500 text-white shadow-md shadow-amber-500/30",
    },
    {
      title: "Lượt đọc tích lũy",
      value: totalViews.toLocaleString("vi-VN"),
      subtext: "Lượt truy cập từ khách hàng",
      icon: Eye,
      iconBg: "bg-purple-500 text-white shadow-md shadow-purple-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="bg-surface border border-border rounded-lg p-4 flex items-center justify-between shadow-xs transition-colors hover:border-border-light"
          >
            <div className="space-y-1">
              <p className="text-xs font-medium text-text-secondary">
                {item.title}
              </p>
              <h3 className="text-xl font-bold text-text-highlight tracking-tight">
                {item.value}
              </h3>
              <p className="text-[11px] text-text-muted">{item.subtext}</p>
            </div>
            <div className={`p-2.5 rounded-md shrink-0 ${item.iconBg}`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
