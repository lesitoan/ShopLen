import React from "react";
import Skeleton from "../Skeleton";

export interface BlogCardSkeletonProps {
  variant?: "vertical" | "horizontal" | "responsive";
  isFeatured?: boolean;
  className?: string;
}

export default function BlogCardSkeleton({
  variant = "vertical",
  isFeatured = false,
  className = "",
}: BlogCardSkeletonProps) {
  if (isFeatured) {
    return (
      <div className={`flex flex-col md:flex-row gap-4 md:gap-6 w-full ${className}`}>
        <div className="relative w-full md:w-[48%] shrink-0 rounded-md overflow-hidden border border-border aspect-video">
          <Skeleton className="w-full h-full rounded-none" />
        </div>
        <div className="flex flex-col gap-3 min-w-0 flex-1 justify-center">
          <Skeleton className="w-24 h-5 rounded-md" />
          <Skeleton className="w-full h-6 rounded" />
          <Skeleton className="w-4/5 h-6 rounded" />
          <Skeleton className="w-full h-4 rounded hidden md:block" />
          <Skeleton className="w-2/3 h-4 rounded hidden md:block" />
          <div className="mt-auto pt-2 flex items-center gap-2">
            <Skeleton className="w-20 h-3 rounded" />
            <Skeleton className="w-16 h-3 rounded" />
          </div>
        </div>
      </div>
    );
  }
  if (variant === "horizontal") {
    return (
      <div className={`flex gap-3 py-4 rounded-md px-2 ${className}`}>
        <div className="relative w-28 md:w-36 shrink-0 rounded-md overflow-hidden border border-border aspect-[4/3]">
          <Skeleton className="w-full h-full rounded-none" />
        </div>
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <Skeleton className="w-20 h-4 rounded-md" />
          <Skeleton className="w-full h-4 rounded" />
          <Skeleton className="w-3/4 h-3 rounded hidden md:block" />
          <div className="mt-auto pt-1 flex items-center gap-2">
            <Skeleton className="w-16 h-3 rounded" />
            <Skeleton className="w-12 h-3 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "responsive") {
    return (
      <>
        <div className={`flex md:hidden gap-3 py-3 border-b border-border/60 last:border-b-0 ${className}`}>
          <div className="relative w-28 shrink-0 rounded-md overflow-hidden border border-border aspect-[4/3]">
            <Skeleton className="w-full h-full rounded-none" />
          </div>
          <div className="flex flex-col gap-2 min-w-0 flex-1 justify-between">
            <div className="space-y-1.5">
              <Skeleton className="w-16 h-3.5 rounded-md" />
              <Skeleton className="w-full h-3.5 rounded" />
              <Skeleton className="w-4/5 h-3.5 rounded" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-14 h-3 rounded" />
              <Skeleton className="w-10 h-3 rounded" />
            </div>
          </div>
        </div>

        {/* Desktop Vertical Skeleton */}
        <div className={`hidden md:flex flex-col h-full bg-surface border border-border rounded-lg overflow-hidden shadow-sm ${className}`}>
          <div className="relative aspect-[16/10] w-full">
            <Skeleton className="w-full h-full rounded-none" />
            <Skeleton className="absolute left-3 bottom-3 w-16 h-5 rounded-md" />
          </div>
          <div className="p-4 flex flex-col flex-1 justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="w-full h-4 rounded" />
              <Skeleton className="w-4/5 h-4 rounded" />
              <Skeleton className="w-full h-3 rounded mt-2" />
              <Skeleton className="w-3/4 h-3 rounded" />
            </div>
            <div className="pt-3 border-t border-border flex items-center justify-between">
              <Skeleton className="w-20 h-3 rounded" />
              <Skeleton className="w-16 h-3 rounded" />
            </div>
          </div>
        </div>
      </>
    );
  }

  // 3. Default Vertical Skeleton
  return (
    <div className={`flex flex-col h-full bg-surface border border-border rounded-lg overflow-hidden shadow-sm ${className}`}>
      <div className="relative aspect-[16/10] w-full">
        <Skeleton className="w-full h-full rounded-none" />
        <Skeleton className="absolute left-3 bottom-3 w-16 h-5 rounded-md" />
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="w-full h-4 rounded" />
          <Skeleton className="w-4/5 h-4 rounded" />
          <Skeleton className="w-full h-3 rounded mt-2" />
          <Skeleton className="w-3/4 h-3 rounded" />
        </div>

        <div className="pt-3 border-t border-border flex items-center justify-between">
          <Skeleton className="w-20 h-3 rounded" />
          <Skeleton className="w-16 h-3 rounded" />
        </div>
      </div>
    </div>
  );
}
