"use client";

import React from "react";
import ArticleHeader from "./components/ArticleHeader";
import TableOfContents from "./components/TableOfContents";
import ArticleBody from "./components/ArticleBody";
import RelatedArticles from "./components/RelatedArticles";
import AdBannerSidebar from "@/screens/blogListing/components/AdBannerSidebar";
import AdBannerCarousel from "@/screens/blogListing/components/AdBannerCarousel";
import BlogDetailSkeleton from "@/components/skeletons/blog/BlogDetailSkeleton";
import { useGetBlogDetailQuery } from "@/services/api/blogApi";
import type { BlogDetailApiItem } from "@/types/blog.type";

interface BlogDetailScreenProps {
  slug: string;
  initialPost?: BlogDetailApiItem | null;
}

export default function BlogDetailScreen({ slug, initialPost }: BlogDetailScreenProps) {
  const { data: apiPost, isLoading } = useGetBlogDetailQuery(slug, {
    skip: Boolean(initialPost),
  });

  const post = initialPost ?? apiPost;

  const contentHtml = post?.contentHtml || post?.content || "";
  const tocList = Array.isArray(post?.toc) ? post.toc : [];

  const tagSlug =
    typeof post?.tag === "object" && post?.tag !== null
      ? post.tag.slug
      : typeof post?.tag === "string"
        ? post.tag
        : undefined;

  return (
    <main className="flex-1">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-6">
        <div className="flex gap-6 items-start">
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            {isLoading && !post ? (
              <BlogDetailSkeleton />
            ) : post ? (
              <>
                <ArticleHeader post={post} />

                {tocList.length > 0 && (
                  <div className="md:hidden">
                    <TableOfContents toc={tocList} className="my-3" />
                  </div>
                )}

                <ArticleBody content={contentHtml} />

                <RelatedArticles currentSlug={slug} tagSlug={tagSlug} />
              </>
            ) : (
              <div className="py-12 text-center">
                <h1 className="text-[20px] font-bold text-text-primary mb-2">Bài viết không tồn tại</h1>
                <p className="text-[14px] text-text-secondary">
                  Bài viết bạn tìm kiếm có thể đã bị xóa hoặc thay đổi đường dẫn.
                </p>
              </div>
            )}
          </div>

          <aside className="hidden md:flex w-[270px] shrink-0 flex-col gap-4 sticky top-[80px] self-start">
            {tocList.length > 0 && (
              <TableOfContents toc={tocList} className="my-0" />
            )}
            <AdBannerSidebar className="w-full" />
          </aside>
        </div>

        <AdBannerCarousel />
      </div>
    </main>
  );
}
