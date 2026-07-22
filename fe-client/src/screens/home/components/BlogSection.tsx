"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BLOG_POSTS } from "../constants";
import BlogCard from "@/components/blog/BlogCard";

export default function BlogSection() {
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {BLOG_POSTS.map((post) => (
          <BlogCard
            key={post.id}
            id={post.id}
            title={post.title}
            description={post.description}
            image={post.image}
            tag={post.tag}
            date={post.date}
            readTime={post.readTime}
          />
        ))}
      </div>
    </section>
  );
}
