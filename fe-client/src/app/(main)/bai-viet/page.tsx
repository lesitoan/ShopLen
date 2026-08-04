import React, { Suspense } from "react";
import BlogListingScreen from "@/screens/blogListing";

export const metadata = {
  title: "Bài viết | Tiệm Len Nhà Kiều",
  description: "Khám phá các bài viết hướng dẫn móc len, ý tưởng quà tặng handmade và cảm hứng sáng tạo từ Tiệm Len Nhà Kiều.",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <BlogListingScreen />
    </Suspense>
  );
}
