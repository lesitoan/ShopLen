import React from "react";
import Skeleton from "../Skeleton";

export default function BlogCardSkeleton() {
  return (
    <div className="flex flex-col h-full bg-surface border border-border rounded-lg overflow-hidden shadow-sm">
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
