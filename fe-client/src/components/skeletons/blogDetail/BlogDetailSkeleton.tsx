import React from "react";
import Skeleton from "../Skeleton";
import BlogGridSkeleton from "../blog/BlogGridSkeleton";

export default function BlogDetailSkeleton() {
  return (
    <main className="flex-1 py-8 flex flex-col">
      <article className="max-w-4xl mx-auto px-4 md:px-6 w-full space-y-6">
        <div className="flex items-center gap-2">
          <Skeleton className="w-16 h-3 rounded" />
          <Skeleton className="w-3 h-3 rounded" />
          <Skeleton className="w-16 h-3 rounded" />
          <Skeleton className="w-3 h-3 rounded" />
          <Skeleton className="w-32 h-3 rounded" />
        </div>

        <Skeleton className="w-24 h-5 rounded-md" />
        <Skeleton className="w-full h-8 rounded-md" />
        <Skeleton className="w-3/4 h-8 rounded-md" />

        <div className="flex items-center gap-4 py-2 border-y border-border">
          <Skeleton className="w-32 h-4 rounded" />
          <Skeleton className="w-24 h-4 rounded" />
        </div>

        <Skeleton className="w-full aspect-[16/9] rounded-xl" />

        <div className="space-y-4 pt-4">
          <Skeleton className="w-full h-4 rounded" />
          <Skeleton className="w-full h-4 rounded" />
          <Skeleton className="w-5/6 h-4 rounded" />
          <Skeleton className="w-full h-4 rounded" />
          <Skeleton className="w-4/5 h-4 rounded" />
        </div>

        <div className="pt-12 border-t border-border space-y-6">
          <Skeleton className="w-48 h-6 rounded-md" />
          <BlogGridSkeleton count={3} />
        </div>
      </article>
    </main>
  );
}
