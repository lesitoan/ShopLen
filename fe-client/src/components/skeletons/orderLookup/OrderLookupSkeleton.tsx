import React from "react";
import Skeleton from "../Skeleton";

export default function OrderLookupSkeleton() {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="bg-surface border border-border rounded-xl p-6 space-y-4 shadow-sm text-center flex flex-col items-center">
        <Skeleton className="w-24 h-6 rounded-full" />
        <Skeleton className="w-48 h-7 rounded-md" />
        <Skeleton className="w-64 h-4 rounded" />
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 flex justify-between gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center space-y-2 flex-1">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="w-16 h-3 rounded" />
          </div>
        ))}
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 space-y-6">
        <Skeleton className="w-36 h-5 rounded-md" />

        <div className="space-y-4 pt-2 border-t border-border">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="w-16 h-16 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="w-3/4 h-4 rounded" />
                <Skeleton className="w-20 h-3 rounded" />
              </div>
              <Skeleton className="w-24 h-5 rounded" />
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-border space-y-2">
          <div className="flex justify-between">
            <Skeleton className="w-24 h-4 rounded" />
            <Skeleton className="w-20 h-4 rounded" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="w-24 h-4 rounded" />
            <Skeleton className="w-20 h-4 rounded" />
          </div>
          <div className="flex justify-between pt-2 border-t border-border">
            <Skeleton className="w-32 h-5 rounded" />
            <Skeleton className="w-28 h-6 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
