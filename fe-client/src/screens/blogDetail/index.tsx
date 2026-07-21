"use client";

import React from "react";
import ArticleHeader from "./components/ArticleHeader";
import TableOfContents from "./components/TableOfContents";
import ArticleBody from "./components/ArticleBody";
import RelatedArticles from "./components/RelatedArticles";
import AdBannerSidebar from "@/screens/blogListing/components/AdBannerSidebar";
import AdBannerCarousel from "@/screens/blogListing/components/AdBannerCarousel";
import { getPostBySlug, RELATED_POSTS } from "./constants";

interface BlogDetailScreenProps {
  slug: string;
}

export default function BlogDetailScreen({ slug }: BlogDetailScreenProps) {
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <main className="flex-1 py-12 px-4 text-center">
        <h1 className="text-[20px] font-bold text-text-primary mb-2">Bài viết không tồn tại</h1>
        <p className="text-[14px] text-text-secondary">Bài viết bạn tìm kiếm có thể đã bị xóa hoặc thay đổi đường dẫn.</p>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-6">
        <div className="flex gap-6 items-start">
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <ArticleHeader post={post} />

            {post.toc && post.toc.length > 0 && (
              <div className="md:hidden">
                <TableOfContents toc={post.toc} className="my-3" />
              </div>
            )}

            <ArticleBody content={post.content} />

            <RelatedArticles posts={RELATED_POSTS} />
          </div>

          <aside className="hidden md:flex w-[270px] shrink-0 flex-col gap-4 sticky top-[80px] self-start">
            {post.toc && post.toc.length > 0 && (
              <TableOfContents toc={post.toc} className="my-0" />
            )}
            <AdBannerSidebar className="w-full" />
          </aside>
        </div>

        <AdBannerCarousel />
      </div>
    </main>
  );
}
