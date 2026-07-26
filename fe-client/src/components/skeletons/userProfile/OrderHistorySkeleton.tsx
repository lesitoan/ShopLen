import React from "react";
import Skeleton from "../Skeleton";

export default function OrderHistorySkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="w-24 h-8 rounded-full shrink-0" />
        ))}
      </div>

      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="bg-surface border border-border rounded-xl p-5 space-y-4 shadow-sm"
        >
          <div className="flex justify-between items-center pb-3 border-b border-border">
            <Skeleton className="w-32 h-4 rounded" />
            <Skeleton className="w-24 h-6 rounded-full" />
          </div>

          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="w-3/4 h-4 rounded" />
              <Skeleton className="w-20 h-3 rounded" />
            </div>
            <Skeleton className="w-24 h-5 rounded" />
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-border">
            <Skeleton className="w-36 h-4 rounded" />
            <Skeleton className="w-28 h-9 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
