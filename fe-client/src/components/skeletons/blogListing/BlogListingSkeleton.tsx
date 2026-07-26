import React from "react";
import Skeleton from "../Skeleton";
import BlogGridSkeleton from "../blog/BlogGridSkeleton";

export default function BlogListingSkeleton() {
  return (
    <main className="flex-1 py-8 flex flex-col">
      <div className="max-w-6xl mx-auto px-4 md:px-6 w-full space-y-8">
        <div className="bg-surface border border-border rounded-2xl p-6 md:p-10 space-y-4 text-center flex flex-col items-center">
          <Skeleton className="w-28 h-5 rounded-full" />
          <Skeleton className="w-96 max-w-full h-8 rounded-md" />
          <Skeleton className="w-full max-w-xl h-4 rounded" />
        </div>

        <div className="flex items-center justify-center gap-2 overflow-x-auto py-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="w-24 h-9 rounded-full shrink-0" />
          ))}
        </div>

        <BlogGridSkeleton count={6} />
      </div>
    </main>
  );
}
