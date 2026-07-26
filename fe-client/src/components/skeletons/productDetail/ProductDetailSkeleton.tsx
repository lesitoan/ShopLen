import React from "react";
import Skeleton from "../Skeleton";
import ProductGridSkeleton from "../product/ProductGridSkeleton";

export default function ProductDetailSkeleton() {
  return (
    <main className="flex-1 py-8 flex flex-col">
      <div className="max-w-6xl mx-auto px-4 md:px-6 w-full space-y-8">
        <div className="flex items-center gap-2">
          <Skeleton className="w-16 h-3 rounded" />
          <Skeleton className="w-3 h-3 rounded" />
          <Skeleton className="w-20 h-3 rounded" />
          <Skeleton className="w-3 h-3 rounded" />
          <Skeleton className="w-32 h-3 rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-6 space-y-4">
            <Skeleton className="w-full aspect-square rounded-xl" />
            <div className="flex gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="w-20 aspect-square rounded-lg" />
              ))}
            </div>
          </div>

          <div className="md:col-span-6 space-y-5">
            <Skeleton className="w-24 h-5 rounded-md" />
            <Skeleton className="w-4/5 h-7 rounded-md" />
            <div className="flex items-center gap-3">
              <Skeleton className="w-28 h-4 rounded" />
              <Skeleton className="w-20 h-4 rounded" />
            </div>

            <div className="p-4 bg-surface rounded-lg border border-border space-y-2">
              <Skeleton className="w-32 h-7 rounded-md" />
              <Skeleton className="w-24 h-3.5 rounded" />
            </div>

            <div className="space-y-3 pt-2">
              <Skeleton className="w-20 h-4 rounded" />
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="w-16 h-9 rounded-md" />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Skeleton className="w-32 h-11 rounded-md" />
              <Skeleton className="flex-1 h-11 rounded-md" />
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border space-y-4">
          <div className="flex gap-4 border-b border-border pb-3">
            <Skeleton className="w-32 h-6 rounded-md" />
            <Skeleton className="w-32 h-6 rounded-md" />
          </div>
          <div className="space-y-3 max-w-3xl">
            <Skeleton className="w-full h-4 rounded" />
            <Skeleton className="w-full h-4 rounded" />
            <Skeleton className="w-3/4 h-4 rounded" />
          </div>
        </div>

        <div className="pt-8 border-t border-border space-y-6">
          <Skeleton className="w-48 h-6 rounded-md" />
          <ProductGridSkeleton count={4} />
        </div>
      </div>
    </main>
  );
}
