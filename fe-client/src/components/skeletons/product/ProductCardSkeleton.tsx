import React from "react";
import Skeleton from "../Skeleton";

export default function ProductCardSkeleton() {
  return (
    <div className="bg-surface rounded-lg border border-border overflow-hidden flex flex-col h-full shadow-sm">
      <div className="relative aspect-square w-full">
        <Skeleton className="w-full h-full rounded-none" />
        <Skeleton className="absolute left-2.5 top-2.5 w-16 h-5 rounded-md" />
        <Skeleton className="absolute right-2.5 top-2.5 w-8 h-8 rounded-full" />
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className="w-full h-4 rounded" />
          <Skeleton className="w-2/3 h-4 rounded" />
        </div>

        <Skeleton className="w-20 h-3 rounded" />

        <div className="pt-3 border-t border-border flex flex-col gap-1.5 mt-auto">
          <Skeleton className="w-16 h-3 rounded" />
          <Skeleton className="w-24 h-5 rounded" />
        </div>
      </div>
    </div>
  );
}
