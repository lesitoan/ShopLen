"use client";

import CategoryGrid from "./CategoryGrid";
import ProductSection from "./ProductSection";
import { useGetHomeProductsQuery } from "@/services/api/productApi";

export default function HomeProductBlocks() {
  const { data, isLoading, isError, refetch } = useGetHomeProductsQuery({
    types: ["BEST_SELLING", "TODAY_DEAL"],
    limit: 6,
  });

  return (
    <>
      <ProductSection
        type="BEST_SELLING"
        title="SẢN PHẨM BÁN CHẠY"
        description="Những sản phẩm được yêu thích nhất tại Tiệm Len Nhà Kiều. Mỗi sản phẩm đều được làm thủ công tỉ mỉ, chất liệu mềm mịn và an toàn."
        ctaText="Xem tất cả"
        ctaLink="/san-pham?sort=best_seller"
        products={data?.sections.BEST_SELLING?.items ?? []}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
      />

      <CategoryGrid />

      <ProductSection
        type="TODAY_DEAL"
        title="ƯU ĐÃI HÔM NAY"
        description="Sản phẩm giảm giá đặc biệt trong thời gian giới hạn. Số lượng có hạn - nhanh tay kẻo lỡ!"
        ctaText="Xem tất cả ưu đãi"
        ctaLink="/san-pham?sort=discount"
        promoBgImage="/images/products/binh-hoa-tulip.png"
        products={data?.sections.TODAY_DEAL?.items ?? []}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
      />
    </>
  );
}
