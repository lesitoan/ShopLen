import React from "react";
import BlogCardSkeleton from "./BlogCardSkeleton";

interface BlogGridSkeletonProps {
  count?: number;
  variant?: "vertical" | "horizontal" | "responsive";
  className?: string;
}

export default function BlogGridSkeleton({
  count = 3,
  variant = "vertical",
  className,
}: BlogGridSkeletonProps) {
  const defaultContainerClass =
    variant === "responsive"
      ? "flex flex-col md:grid md:grid-cols-2 lg:grid-cols-4 gap-0 md:gap-6"
      : variant === "horizontal"
      ? "flex flex-col divide-y divide-border"
      : count === 4
      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      : "grid grid-cols-1 md:grid-cols-3 gap-6";

  return (
    <div className={`w-full ${className ?? defaultContainerClass}`}>
      {Array.from({ length: count }).map((_, index) => (
        <BlogCardSkeleton key={index} variant={variant} />
      ))}
    </div>
  );
}
