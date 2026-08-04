"use client";

import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import BlogCard from "@/components/blog/BlogCard";
import { useGetBlogPostsQuery } from "@/services/api/blogApi";
import BlogGridSkeleton from "@/components/skeletons/blog/BlogGridSkeleton";
import EmptyState from "@/components/ui/EmptyState";

export default function BlogSection() {
  const { data, isLoading } = useGetBlogPostsQuery({ home: true, limit: 4 });

  const posts = data?.items ?? [];

  return (
    <section className="w-full max-w-6xl mx-auto px-4 md:px-6 mb-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-[20px] md:text-[22px] font-bold text-text-primary mb-2 leading-tight">
            KIẾN THỨC & GỢI Ý QUÀ TẶNG HANDMADE
          </h2>
          <p className="text-[12px] md:text-[13px] text-text-secondary">
            Chia sẻ các bài viết hướng dẫn móc len và cẩm nang quà tặng ý nghĩa.
          </p>
        </div>
        <Link
          href="/bai-viet"
          className="text-[13px] font-semibold text-secondary hover:text-primary-active transition-colors inline-flex items-center gap-1 group whitespace-nowrap self-start sm:self-auto"
        >
          <span>Xem tất cả bài viết</span>
          <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      {isLoading ? (
        <BlogGridSkeleton count={4} variant="responsive" />
      ) : posts.length === 0 ? (
        <EmptyState
          icon={<FileText size={32} />}
          title="Chưa có bài viết nào"
          description="Các bài viết chia sẻ kinh nghiệm móc len sẽ sớm được cập nhật."
        />
      ) : (
        <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-4 gap-0 md:gap-6">
          {posts.map((post) => (
            <BlogCard
              key={post.id}
              post={post}
              variant="responsive"
            />
          ))}
        </div>
      )}
    </section>
  );
}
