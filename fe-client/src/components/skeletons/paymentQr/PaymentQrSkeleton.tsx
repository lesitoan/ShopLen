import React from "react";
import Skeleton from "../Skeleton";

export default function PaymentQrSkeleton() {
  return (
    <main className="flex-1 py-8">
      <div className="max-w-2xl mx-auto px-4 md:px-6 w-full space-y-6">
        <div className="bg-surface border border-border rounded-xl p-6 space-y-3 text-center flex flex-col items-center shadow-sm">
          <Skeleton className="w-28 h-6 rounded-full" />
          <Skeleton className="w-64 h-7 rounded-md" />
          <Skeleton className="w-48 h-4 rounded" />
        </div>

        <div className="bg-surface border border-border rounded-xl p-6 md:p-8 space-y-6 flex flex-col items-center text-center shadow-sm">
          <Skeleton className="w-64 aspect-square rounded-2xl" />
          <Skeleton className="w-36 h-4 rounded" />

          <div className="w-full space-y-3 pt-4 border-t border-border">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center py-1">
                <Skeleton className="w-28 h-4 rounded" />
                <Skeleton className="w-36 h-5 rounded" />
              </div>
            ))}
          </div>

          <Skeleton className="w-full h-11 rounded-lg mt-2" />
        </div>
      </div>
    </main>
  );
}
