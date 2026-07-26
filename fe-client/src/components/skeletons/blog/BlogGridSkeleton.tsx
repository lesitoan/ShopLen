import React from "react";
import BlogCardSkeleton from "./BlogCardSkeleton";

interface BlogGridSkeletonProps {
  count?: number;
  className?: string;
}

export default function BlogGridSkeleton({
  count = 3,
  className = "",
}: BlogGridSkeletonProps) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-3 gap-6 w-full ${className}`}
    >
      {Array.from({ length: count }).map((_, index) => (
        <BlogCardSkeleton key={index} />
      ))}
    </div>
  );
}
