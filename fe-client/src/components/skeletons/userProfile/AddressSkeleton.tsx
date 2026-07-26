import React from "react";
import Skeleton from "../Skeleton";

export default function AddressSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-xl p-6 space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="w-40 h-6 rounded-md" />
        <Skeleton className="w-36 h-9 rounded-md" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="border border-border rounded-lg p-4 space-y-3 relative"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="w-28 h-5 rounded" />
              <Skeleton className="w-20 h-5 rounded-full" />
            </div>
            <Skeleton className="w-36 h-4 rounded" />
            <Skeleton className="w-full h-4 rounded" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="w-16 h-8 rounded-md" />
              <Skeleton className="w-16 h-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
