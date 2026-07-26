import React from "react";
import Skeleton from "../Skeleton";
import ProductGridSkeleton from "../product/ProductGridSkeleton";

export default function ProductsScreenSkeleton() {
  return (
    <main className="flex-1 py-8 flex flex-col">
      <div className="max-w-6xl mx-auto px-4 md:px-6 w-full flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="w-16 h-3 rounded" />
          <Skeleton className="w-3 h-3 rounded" />
          <Skeleton className="w-24 h-3 rounded" />
        </div>

        <Skeleton className="w-80 h-7 rounded-md mb-2" />
        <Skeleton className="w-full max-w-3xl h-4 rounded-md mb-6" />

        <div className="flex items-center justify-between py-3 border-b border-border/60 mb-6">
          <Skeleton className="w-36 h-4 rounded" />
          <Skeleton className="w-44 h-9 rounded-md" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start w-full">
          <div className="hidden md:block md:col-span-3 bg-surface border border-border rounded-lg p-5 space-y-6">
            <Skeleton className="w-32 h-5 rounded" />

            <div className="space-y-3">
              <Skeleton className="w-24 h-4 rounded" />
              <Skeleton className="w-full h-8 rounded" />
            </div>

            <div className="space-y-2">
              <Skeleton className="w-24 h-4 rounded" />
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="w-full h-5 rounded" />
              ))}
            </div>

            <div className="space-y-2">
              <Skeleton className="w-20 h-4 rounded" />
              <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="w-6 h-6 rounded-full" />
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-9 w-full">
            <ProductGridSkeleton count={12} />
          </div>
        </div>
      </div>
    </main>
  );
}
