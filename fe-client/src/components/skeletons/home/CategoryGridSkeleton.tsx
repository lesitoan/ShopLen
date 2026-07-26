import React from "react";
import Skeleton from "../Skeleton";

export default function CategoryGridSkeleton() {
  return (
    <section className="py-8 bg-surface border-y border-border/50">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center mb-6 text-center space-y-2">
          <Skeleton className="w-48 h-6 rounded-md" />
          <Skeleton className="w-64 h-3.5 rounded-md" />
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-3 rounded-lg border border-border/60 bg-background space-y-2.5"
            >
              <Skeleton className="w-14 h-14 rounded-full" />
              <Skeleton className="w-20 h-3.5 rounded" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
