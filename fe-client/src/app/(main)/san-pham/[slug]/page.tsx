import type { Metadata } from "next";
import { Suspense } from "react";
import ProductDetailScreen from "@/screens/productDetail";
import { CATALOG_PRODUCTS } from "@/screens/products/constants";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const numericId = Number(slug.replace("sp-", ""));
  const product = CATALOG_PRODUCTS.find((p) => p.id === numericId);

  if (!product) {
    return {
      title: "Sản phẩm không tồn tại | Tiệm Len Nhà Kiều",
      description: "Sản phẩm không tìm thấy hoặc đã ngừng kinh doanh tại Tiệm Len Nhà Kiều.",
    };
  }

  return {
    title: `${product.name} - Đồ len đan tay | Tiệm Len Nhà Kiều`,
    description: `${product.name} handmade đan tay tỉ mỉ từ sợi cotton chất lượng cao. Thích hợp làm móc khóa trang trí, treo balo, hoặc quà tặng ý nghĩa.`,
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-text-secondary text-sm">Đang tải chi tiết sản phẩm...</div>}>
      <ProductDetailScreen slug={slug} />
    </Suspense>
  );
}
