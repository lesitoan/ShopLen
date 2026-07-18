import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSlider from "./components/HeroSlider";
import ProductSection from "./components/ProductSection";
import CategoryGrid from "./components/CategoryGrid";
import BlogSection from "./components/BlogSection";

import { BEST_SELLERS_PRODUCTS, TODAY_OFFERS_PRODUCTS } from "./constants";

export default function HomeScreen() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-8 flex flex-col">
        <HeroSlider />

        <ProductSection
          title="SẢN PHẨM BÁN CHẠY"
          description="Những sản phẩm được yêu thích nhất tại Tiệm Len Nhà Kiều. Mỗi sản phẩm đều được làm thủ công tỉ mỉ, chất liệu mềm mịn và an toàn."
          ctaText="Xem tất cả"
          ctaLink="/san-pham?sort=best_seller"
          products={BEST_SELLERS_PRODUCTS}
          // promoBgImage="/images/products/binh-hoa-tulip.png"

        />

        <CategoryGrid />

        <ProductSection
          title="ƯU ĐÃI HÔM NAY"
          description="Sản phẩm giảm giá đặc biệt trong thời gian giới hạn. Số lượng có hạn - nhanh tay kẻo lỡ!"
          ctaText="Xem tất cả ưu đãi"
          ctaLink="/san-pham?sort=discount"
          products={TODAY_OFFERS_PRODUCTS}
          promoBgImage="/images/products/binh-hoa-tulip.png"
        />

        <BlogSection />
      </main>

      <Footer />
    </div>
  );
}
