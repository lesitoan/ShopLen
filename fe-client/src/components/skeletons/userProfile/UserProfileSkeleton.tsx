import React from "react";
import Skeleton from "../Skeleton";
import PersonalInfoSkeleton from "./PersonalInfoSkeleton";

export default function UserProfileSkeleton() {
  return (
    <main className="flex-1 py-8">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-3 bg-surface border border-border rounded-xl p-5 space-y-6">
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="w-24 h-4 rounded" />
                <Skeleton className="w-32 h-3 rounded" />
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-border">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="w-full h-10 rounded-lg" />
              ))}
            </div>
          </div>

          <div className="md:col-span-9 w-full">
            <PersonalInfoSkeleton />
          </div>
        </div>
      </div>
    </main>
  );
}
