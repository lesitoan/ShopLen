import React from "react";
import Skeleton from "../Skeleton";

export default function PersonalInfoSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-xl p-6 space-y-6">
      <Skeleton className="w-44 h-6 rounded-md" />

      <div className="flex items-center gap-4 pb-4 border-b border-border">
        <Skeleton className="w-16 h-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="w-28 h-8 rounded-md" />
          <Skeleton className="w-36 h-3 rounded" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="w-24 h-4 rounded" />
            <Skeleton className="w-full h-10 rounded-md" />
          </div>
        ))}
      </div>

      <Skeleton className="w-32 h-10 rounded-md mt-4" />
    </div>
  );
}
