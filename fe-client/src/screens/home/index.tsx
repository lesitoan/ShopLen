import React from "react";
import HeroSlider from "./components/HeroSlider";
import ProductSection from "./components/ProductSection";
import CategoryGrid from "./components/CategoryGrid";
import BlogSection from "./components/BlogSection";

export default function HomeScreen() {
  return (
    <main className="flex-1 py-8 flex flex-col">
      <HeroSlider />

      <ProductSection
        type="BEST_SELLING"
        title="SẢN PHẨM BÁN CHẠY"
        description="Những sản phẩm được yêu thích nhất tại Tiệm Len Nhà Kiều. Mỗi sản phẩm đều được làm thủ công tỉ mỉ, chất liệu mềm mịn và an toàn."
        ctaText="Xem tất cả"
        ctaLink="/san-pham?sort=best_seller"
      />

      <CategoryGrid />

      <ProductSection
        type="TODAY_DEAL"
        title="ƯU ĐÃI HÔM NAY"
        description="Sản phẩm giảm giá đặc biệt trong thời gian giới hạn. Số lượng có hạn - nhanh tay kẻo lỡ!"
        ctaText="Xem tất cả ưu đãi"
        ctaLink="/san-pham?sort=discount"
        promoBgImage="/images/products/binh-hoa-tulip.png"
      />

      <BlogSection />
    </main>
  );
}
