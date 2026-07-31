import React, { Suspense } from "react";
import type { Metadata } from "next";
import ProductsScreen from "@/screens/products";

export const metadata: Metadata = {
  title: "Tất Cả Móc Khóa Len Handmade Đẹp | Tiệm Len Nhà Kiều",
  description: "Khám phá các mẫu móc khóa len handmade của Tiệm Len Nhà Kiều, từ mẫu có sẵn đến mẫu đặt làm theo màu, chủ đề và ngân sách riêng.",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ProductsScreen />
    </Suspense>
  );
}
