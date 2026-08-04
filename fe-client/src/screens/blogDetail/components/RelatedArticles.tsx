import React from "react";
import BlogCard from "@/components/blog/BlogCard";
import { useGetBlogPostsQuery } from "@/services/api/blogApi";

interface RelatedArticlesProps {
  currentSlug?: string;
  tagSlug?: string;
  limit?: number;
}

export default function RelatedArticles({
  currentSlug,
  tagSlug,
  limit = 3,
}: RelatedArticlesProps) {
  const { data, isLoading } = useGetBlogPostsQuery({
    limit: limit + 1,
    tag: tagSlug,
  });

  const posts = (data?.items ?? [])
    .filter((post) => post.slug !== currentSlug)
    .slice(0, limit);

  if (isLoading || posts.length === 0) return null;

  return (
    <div className="mt-8 pt-6 border-t border-border flex flex-col gap-4">
      <h2 className="text-[15px] font-bold text-text-primary uppercase tracking-wider border-l-4 border-primary pl-3">
        Bài viết gợi ý
      </h2>

      <div className="flex flex-col divide-y divide-border">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} variant="horizontal" />
        ))}
      </div>
    </div>
  );
}
