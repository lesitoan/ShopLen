"use client";

import React, { useState } from "react";
import Pagination from "@/components/ui/Pagination";
import ArticleCard from "./components/ArticleCard";
import TagFilterBar from "./components/TagFilterBar";
import ArticleList from "./components/ArticleList";
import AdBannerSidebar from "./components/AdBannerSidebar";
import AdBannerCarousel from "./components/AdBannerCarousel";
import {
  BLOG_TAGS,
  FEATURED_POSTS,
  BLOG_POSTS,
  POSTS_PER_PAGE,
} from "./constants";

export default function BlogListingScreen() {
  const [activeTag, setActiveTag] = useState<string>("tat-ca");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const filteredPosts =
    activeTag === "tat-ca"
      ? BLOG_POSTS
      : BLOG_POSTS.filter((p) => p.tag === activeTag);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  const pagedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const handleTagChange = (key: string) => {
    setActiveTag(key);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const mainFeaturedPost = FEATURED_POSTS[0];
  const activeTagObj = BLOG_TAGS.find((t) => t.key === activeTag);
  const articleListTitle =
    activeTag === "tat-ca" ? "Bài viết mới nhất" : `Bài viết: ${activeTagObj?.label ?? ""}`;

  return (
    <main className="flex-1">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-6">
        {mainFeaturedPost && (
          <ArticleCard post={mainFeaturedPost} isFeatured={true} />
        )}

        <TagFilterBar
          tags={BLOG_TAGS}
          activeTag={activeTag}
          onTagChange={handleTagChange}
        />

        <div className="flex gap-6 items-start">
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            <ArticleList posts={pagedPosts} title={articleListTitle} />

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>

          <AdBannerSidebar />
        </div>

        <AdBannerCarousel />
      </div>
    </main>
  );
}
