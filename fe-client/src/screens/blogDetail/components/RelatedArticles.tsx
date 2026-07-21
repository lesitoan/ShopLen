import React from "react";
import type { BlogPost } from "@/types/blog.type";
import ArticleCard from "@/screens/blogListing/components/ArticleCard";

interface RelatedArticlesProps {
  posts: BlogPost[];
}

export default function RelatedArticles({ posts }: RelatedArticlesProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="mt-8 pt-6 border-t border-border flex flex-col gap-4">
      <h2 className="text-[15px] font-bold text-text-primary uppercase tracking-wider border-l-4 border-primary pl-3">
        Bài viết gợi ý
      </h2>

      <div className="flex flex-col divide-y divide-border">
        {posts.map((post) => (
          <ArticleCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
