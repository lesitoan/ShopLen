"use client";

import React from "react";
import TagFilterBar from "./components/TagFilterBar";
import ArticleList from "./components/ArticleList";
import FeaturedPostSection from "./components/FeaturedPostSection";
import AdBannerSidebar from "./components/AdBannerSidebar";
import AdBannerCarousel from "./components/AdBannerCarousel";
import { useBlogFilters } from "./hooks/useBlogFilters";
import { POSTS_PER_PAGE } from "./constants";

export default function BlogListingScreen() {
  const { activeTag, currentPage, handleTagChange, handlePageChange } =
    useBlogFilters();

  const articleListTitle =
    activeTag === "tat-ca" ? "Bài viết mới nhất" : "Danh sách bài viết";

  return (
    <main className="flex-1">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-6">
        <FeaturedPostSection />

        <TagFilterBar
          activeTag={activeTag}
          onTagChange={handleTagChange}
        />

        <div className="flex gap-6 items-start">
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            <ArticleList
              activeTag={activeTag}
              currentPage={currentPage}
              limit={POSTS_PER_PAGE}
              title={articleListTitle}
              onPageChange={handlePageChange}
            />
          </div>

          <AdBannerSidebar />
        </div>

        <AdBannerCarousel />
      </div>
    </main>
  );
}
