import React from "react";
import Skeleton from "../Skeleton";
import BlogGridSkeleton from "../blog/BlogGridSkeleton";

export default function BlogSectionSkeleton() {
  return (
    <section className="py-10 bg-background/50">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="space-y-2">
            <Skeleton className="w-48 h-6 rounded-md" />
            <Skeleton className="w-64 h-3.5 rounded-md" />
          </div>

          <Skeleton className="w-24 h-8 rounded-md" />
        </div>

        <BlogGridSkeleton count={3} />
      </div>
    </section>
  );
}
