import React from "react";
import Skeleton from "../Skeleton";

export default function BlogDetailSkeleton() {
  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-3">
        <Skeleton className="w-24 h-6 rounded-md" />
        <Skeleton className="w-full md:w-4/5 h-8 rounded" />
        <Skeleton className="w-3/4 h-5 rounded" />
        <div className="flex items-center gap-3 pt-2">
          <Skeleton className="w-8 h-8 rounded-full shrink-0" />
          <Skeleton className="w-24 h-4 rounded" />
          <Skeleton className="w-20 h-4 rounded" />
        </div>
      </div>

      {/* Main image skeleton */}
      <div className="w-full aspect-video rounded-xl overflow-hidden border border-border">
        <Skeleton className="w-full h-full rounded-none" />
      </div>

      {/* Content paragraph skeletons */}
      <div className="space-y-4 pt-4">
        <Skeleton className="w-full h-4 rounded" />
        <Skeleton className="w-full h-4 rounded" />
        <Skeleton className="w-5/6 h-4 rounded" />
        <Skeleton className="w-2/3 h-6 rounded mt-6" />
        <Skeleton className="w-full h-4 rounded" />
        <Skeleton className="w-4/5 h-4 rounded" />
      </div>
    </div>
  );
}
