import React from "react";
import Skeleton from "../Skeleton";
import ProductGridSkeleton from "../product/ProductGridSkeleton";

export default function ProductSectionSkeleton() {
  return (
    <section className="py-10">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="space-y-2">
            <Skeleton className="w-56 h-7 rounded-md" />
            <Skeleton className="w-72 h-4 rounded-md" />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <Skeleton className="w-24 h-8 rounded-full" />
            <Skeleton className="w-24 h-8 rounded-full" />
            <Skeleton className="w-24 h-8 rounded-full" />
          </div>
        </div>

        <ProductGridSkeleton count={8} />
      </div>
    </section>
  );
}
