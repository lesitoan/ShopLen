import React from "react";
import Skeleton from "../Skeleton";

export default function CartSkeleton() {
  return (
    <main className="flex-1 py-8">
      <div className="max-w-6xl mx-auto px-4 md:px-6 w-full space-y-6">
        <Skeleton className="w-48 h-8 rounded-md" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-surface border border-border rounded-xl p-5 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 py-3 border-b border-border last:border-0"
              >
                <Skeleton className="w-20 h-20 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="w-3/4 h-4 rounded" />
                  <Skeleton className="w-24 h-3.5 rounded" />
                  <Skeleton className="w-20 h-5 rounded" />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="w-24 h-8 rounded-md" />
                  <Skeleton className="w-6 h-6 rounded" />
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4 bg-surface border border-border rounded-xl p-5 space-y-4">
            <Skeleton className="w-36 h-6 rounded-md" />

            <div className="space-y-3 pt-2">
              <div className="flex justify-between">
                <Skeleton className="w-24 h-4 rounded" />
                <Skeleton className="w-20 h-4 rounded" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="w-24 h-4 rounded" />
                <Skeleton className="w-20 h-4 rounded" />
              </div>
              <div className="flex justify-between pt-3 border-t border-border">
                <Skeleton className="w-28 h-5 rounded" />
                <Skeleton className="w-28 h-6 rounded-md" />
              </div>
            </div>

            <Skeleton className="w-full h-11 rounded-lg mt-4" />
          </div>
        </div>
      </div>
    </main>
  );
}
