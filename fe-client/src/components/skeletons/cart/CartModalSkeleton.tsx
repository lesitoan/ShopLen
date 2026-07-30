import React from "react";
import Skeleton from "../Skeleton";

export default function CartModalSkeleton() {
  return (
    <div className="py-2 divide-y divide-border/60">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="py-3 flex items-center gap-3">
          <Skeleton className="w-14 h-14 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2 min-w-0">
            <Skeleton className="w-3/4 h-3.5 rounded" />
            <Skeleton className="w-1/2 h-3 rounded" />
            <Skeleton className="w-16 h-3.5 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-16 h-6 rounded-md" />
            <Skeleton className="w-4 h-4 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
