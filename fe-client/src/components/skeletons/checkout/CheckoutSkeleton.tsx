import React from "react";
import Skeleton from "../Skeleton";

export default function CheckoutSkeleton() {
  return (
    <main className="flex-1 py-8">
      <div className="max-w-6xl mx-auto px-4 md:px-6 w-full space-y-6">
        <Skeleton className="w-56 h-8 rounded-md" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-surface border border-border rounded-xl p-6 space-y-6">
            <Skeleton className="w-40 h-6 rounded-md" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="w-24 h-4 rounded" />
                  <Skeleton className="w-full h-10 rounded-md" />
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Skeleton className="w-24 h-4 rounded" />
              <Skeleton className="w-full h-20 rounded-md" />
            </div>

            <Skeleton className="w-44 h-6 rounded-md pt-4" />
            <div className="space-y-3">
              <Skeleton className="w-full h-14 rounded-lg" />
              <Skeleton className="w-full h-14 rounded-lg" />
            </div>
          </div>

          <div className="lg:col-span-5 bg-surface border border-border rounded-xl p-6 space-y-4">
            <Skeleton className="w-36 h-6 rounded-md" />

            <div className="space-y-3 py-2 border-y border-border">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-14 h-14 rounded-md shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="w-3/4 h-3.5 rounded" />
                    <Skeleton className="w-16 h-3 rounded" />
                  </div>
                  <Skeleton className="w-16 h-4 rounded" />
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <Skeleton className="w-20 h-4 rounded" />
                <Skeleton className="w-20 h-4 rounded" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="w-24 h-4 rounded" />
                <Skeleton className="w-16 h-4 rounded" />
              </div>
              <div className="flex justify-between pt-3 border-t border-border">
                <Skeleton className="w-28 h-5 rounded" />
                <Skeleton className="w-28 h-6 rounded-md" />
              </div>
            </div>

            <Skeleton className="w-full h-12 rounded-lg mt-4" />
          </div>
        </div>
      </div>
    </main>
  );
}
