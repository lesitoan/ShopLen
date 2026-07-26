import React from "react";
import CategoryGridSkeleton from "./CategoryGridSkeleton";
import ProductSectionSkeleton from "./ProductSectionSkeleton";
import BlogSectionSkeleton from "./BlogSectionSkeleton";

export default function HomeScreenSkeleton() {
  return (
    <div className="w-full space-y-4">
      <CategoryGridSkeleton />
      <ProductSectionSkeleton />
      <BlogSectionSkeleton />
    </div>
  );
}
