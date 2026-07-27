import React from "react";
import Skeleton from "../Skeleton";

export default function CategoryGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 p-3 bg-surface border border-border rounded-lg"
        >
          <Skeleton className="w-16 h-16 rounded-full shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="w-24 h-4 rounded" />
            <Skeleton className="w-16 h-3 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
