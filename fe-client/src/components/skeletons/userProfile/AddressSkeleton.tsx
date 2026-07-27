import React from "react";
import Skeleton from "../Skeleton";

export default function AddressSkeleton() {
  return (
    <div className="bg-transparent border-0 p-0 sm:bg-surface sm:border sm:border-border sm:rounded-xl sm:p-6 space-y-6 text-left">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <Skeleton className="w-40 h-6 rounded-md" />
          <Skeleton className="w-64 h-4 rounded-md" />
        </div>
        <Skeleton className="w-36 h-9 rounded-md shrink-0" />
      </div>

      <div className="flex flex-col gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="border border-border rounded-lg p-4 space-y-3 relative"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="w-28 h-5 rounded" />
              <Skeleton className="w-16 h-5 rounded-md" />
            </div>
            <Skeleton className="w-36 h-4 rounded" />
            <Skeleton className="w-full h-4 rounded" />
            <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
              <Skeleton className="w-28 h-7 rounded-md" />
              <Skeleton className="w-8 h-7 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
