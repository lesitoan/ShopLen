import React from "react";
import { SearchX, AlertCircle } from "lucide-react";
import BlogCard from "@/components/blog/BlogCard";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import { useGetBlogPostsQuery } from "@/services/api/blogApi";
import BlogGridSkeleton from "@/components/skeletons/blog/BlogGridSkeleton";

interface ArticleListProps {
  activeTag?: string;
  currentPage?: number;
  limit?: number;
  title?: string;
  onPageChange?: (page: number) => void;
}

export default function ArticleList({
  activeTag = "tat-ca",
  currentPage = 1,
  limit = 5,
  title = "Bài viết mới nhất",
  onPageChange,
}: ArticleListProps) {
  const queryTag = activeTag === "tat-ca" ? undefined : activeTag;
  const { data: apiData, isLoading, isError } = useGetBlogPostsQuery({
    page: currentPage,
    limit,
    tag: queryTag,
  });

  const posts = apiData?.items ?? [];
  const totalPages = apiData?.pagination?.totalPages ?? 0;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[15px] font-bold text-text-primary uppercase tracking-wider border-l-4 border-primary pl-3 mb-1">
        {title}
      </h2>

      {isLoading ? (
        <BlogGridSkeleton count={limit} variant="horizontal" />
      ) : isError ? (
        <div className="py-8">
          <EmptyState
            icon={<AlertCircle size={32} />}
            title="Không thể tải danh sách bài viết"
            description="Có lỗi xảy ra khi kết nối tới máy chủ. Vui lòng thử lại sau."
          />
        </div>
      ) : posts.length === 0 ? (
        <div className="py-8">
          <EmptyState
            icon={<SearchX size={32} />}
            title="Không tìm thấy bài viết"
            description="Không có bài viết nào thuộc danh mục này. Hãy thử chọn danh mục khác."
          />
        </div>
      ) : (
        <>
          <div className="flex flex-col divide-y divide-border">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} variant="horizontal" />
            ))}
          </div>

          {totalPages > 1 && onPageChange && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          )}
        </>
      )}
    </div>
  );
}
