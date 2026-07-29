import React from "react";
import Skeleton from "../Skeleton";

export default function ProductInfoSkeleton() {
  return (
    <div className="flex flex-col text-left w-full">
      <Skeleton className="w-16 h-6 rounded mb-2" />
      <Skeleton className="w-3/4 h-7 rounded mb-2" />
      <Skeleton className="w-24 h-4 rounded mb-4" />
      <Skeleton className="w-full h-16 rounded-lg mb-6" />

      <div className="mb-6">
        <Skeleton className="w-20 h-4 rounded mb-2.5" />
        <div className="space-y-2">
          <Skeleton className="w-full h-4 rounded" />
          <Skeleton className="w-5/6 h-4 rounded" />
        </div>
      </div>

      <div className="mb-6">
        <Skeleton className="w-28 h-4 rounded mb-2.5" />
        <div className="flex items-center gap-3 py-1">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
      </div>

      <div className="mb-6">
        <Skeleton className="w-16 h-4 rounded mb-2.5" />
        <Skeleton className="w-32 h-9 rounded-md" />
      </div>

      <div className="flex items-center gap-3.5 mt-2">
        <Skeleton className="flex-1 h-10 rounded-md" />
        <Skeleton className="flex-1 h-10 rounded-md" />
      </div>

      <div className="mt-8 pt-6 border-t border-border/60 flex flex-col gap-2.5">
        <Skeleton className="w-3/4 h-4 rounded" />
        <Skeleton className="w-2/3 h-4 rounded" />
        <Skeleton className="w-4/5 h-4 rounded" />
      </div>
    </div>
  );
}
