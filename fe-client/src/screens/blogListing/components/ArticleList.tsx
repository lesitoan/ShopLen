import React from "react";
import { SearchX } from "lucide-react";
import type { BlogPost } from "@/types/blog.type";
import ArticleCard from "./ArticleCard";
import EmptyState from "@/components/ui/EmptyState";

interface ArticleListProps {
  posts: BlogPost[];
  title?: string;
}

export default function ArticleList({ posts, title = "Bài viết mới nhất" }: ArticleListProps) {
  return (
    <div className="flex flex-col gap-0">
      <h2 className="text-[15px] font-bold text-text-primary uppercase tracking-wider border-l-4 border-primary pl-3 mb-1">
        {title}
      </h2>

      {posts.length === 0 ? (
        <div className="py-8">
          <EmptyState
            icon={<SearchX size={32} />}
            title="Không tìm thấy bài viết"
            description="Không có bài viết nào thuộc danh mục này. Hãy thử chọn danh mục khác."
          />
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-border">
          {posts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
