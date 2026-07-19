"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Pagination from "@/components/ui/Pagination";

import { CATALOG_PRODUCTS } from "./constants";
import FilterContent from "./components/FilterContent";
import FilterModal from "./components/FilterModal";
import useStickySidebar from "./hooks/useStickySidebar";

const SORT_OPTIONS = [
  { value: "best_seller", label: "Bán chạy nhất" },
  { value: "newest", label: "Mới nhất" },
  { value: "price_asc", label: "Giá: Thấp đến Cao" },
  { value: "price_desc", label: "Giá: Cao đến Thấp" },
  { value: "discount", label: "Khuyến mãi tốt nhất" },
];

export default function ProductsScreen() {
  const searchParams = useSearchParams();
  const { sidebarRef, style: sidebarStyle } = useStickySidebar();

  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(300000);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("best_seller");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  useEffect(() => {
    const searchParam = searchParams.get("search") || "";
    const categoryParam = searchParams.get("category") || "";
    const sortParam = searchParams.get("sort") || "";

    if (searchParam) {
      setSearch(searchParam);
    }
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    }
    if (sortParam) {
      setSortOption(sortParam);
    }
  }, [searchParams]);

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    );
    setCurrentPage(1);
  };

  const toggleColor = (name: string) => {
    setSelectedColors((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
    setCurrentPage(1);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSearch("");
    setMinPrice(0);
    setMaxPrice(300000);
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedTags([]);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    search !== "" ||
    minPrice !== 0 ||
    maxPrice !== 300000 ||
    selectedCategories.length > 0 ||
    selectedColors.length > 0 ||
    selectedTags.length > 0;

  const filteredProducts = CATALOG_PRODUCTS.filter((product) => {
    if (search && !product.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (product.price < minPrice || product.price > maxPrice) {
      return false;
    }
    if (
      selectedCategories.length > 0 &&
      !selectedCategories.includes(product.category)
    ) {
      return false;
    }
    if (selectedColors.length > 0 && !selectedColors.includes(product.color)) {
      return false;
    }
    if (selectedTags.length > 0) {
      const hasMatchingTag = product.tags.some((t) =>
        selectedTags.includes(t)
      );
      if (!hasMatchingTag) return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "price_asc") {
      return a.price - b.price;
    }
    if (sortOption === "price_desc") {
      return b.price - a.price;
    }
    if (sortOption === "best_seller") {
      return b.reviews - a.reviews;
    }
    if (sortOption === "newest") {
      return b.id - a.id;
    }
    if (sortOption === "discount") {
      const discountA = a.originalPrice ? a.originalPrice - a.price : 0;
      const discountB = b.originalPrice ? b.originalPrice - b.price : 0;
      return discountB - discountA;
    }
    return 0;
  });

  const itemsPerPage = 12;
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const displayedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-8 flex flex-col">
        <div className="max-w-6xl mx-auto px-4 md:px-6 w-full flex-1 flex flex-col">
          <div className="flex items-center gap-1.5 text-[12px] text-text-secondary mb-4 select-none">
            <a href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </a>
            <span>&gt;</span>
            <span className="font-medium text-text-primary">Sản phẩm</span>
          </div>

          <h1 className="text-[20px] md:text-[24px] font-bold text-text-primary mb-2 leading-tight text-left">
            TẤT CẢ MÓC KHÓA LEN HANDMADE ĐẸP
          </h1>
          <p className="text-[12px] md:text-[13px] text-text-secondary leading-relaxed mb-6 text-left max-w-4xl">
            Khám phá các mẫu móc khóa len handmade của Tiệm Len Nhà Kiều, từ mẫu có sẵn đến các mẫu đan móc tỉ mỉ theo màu sắc, chủ đề và ngân sách riêng của riêng bạn.
          </p>

          <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-border/60 gap-3 shrink-0 text-left">
            <div className="text-[13px] font-medium text-text-secondary select-none order-2 md:order-1 mt-1 md:mt-0">
              Tìm thấy <span className="text-secondary font-bold">{sortedProducts.length}</span> sản phẩm
            </div>

            <div className="flex items-center justify-end md:justify-start gap-3 w-full md:w-auto order-1 md:order-2">
              <button
                onClick={() => setIsFilterModalOpen(true)}
                className="md:hidden flex items-center gap-1.5 px-4 py-2 bg-surface border border-border text-[12.5px] font-semibold text-text-primary rounded-md active:scale-95 transition-all select-none"
              >
                <SlidersHorizontal size={14} className="text-secondary" />
                <span>Bộ lọc</span>
              </button>

              <div className="w-44 select-none">
                <Select
                  options={SORT_OPTIONS}
                  value={sortOption}
                  onChange={(val) => {
                    setSortOption(val);
                    setCurrentPage(1);
                  }}
                  placeholder="Sắp xếp theo"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mt-6 w-full flex-1 relative">
            <div className="hidden md:block md:col-span-3 h-full relative min-h-[500px]">
              <div
                ref={sidebarRef}
                style={sidebarStyle}
                className="bg-surface border border-border rounded-lg shadow-sm flex flex-col max-h-[80vh] overflow-hidden"
              >
                <div className="flex items-center justify-between border-b border-border p-5 pb-3 shrink-0">
                  <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider select-none">
                    Bộ lọc sản phẩm
                  </h3>
                  {hasActiveFilters && (
                    <button
                      onClick={clearAllFilters}
                      className="text-[11px] font-bold text-secondary hover:text-primary transition-colors underline"
                    >
                      Xóa bộ lọc
                    </button>
                  )}
                </div>

                <div className="p-5 pt-4 overflow-y-auto no-scrollbar flex-1">
                  <FilterContent
                    search={search}
                    setSearch={setSearch}
                    minPrice={minPrice}
                    setMinPrice={setMinPrice}
                    maxPrice={maxPrice}
                    setMaxPrice={setMaxPrice}
                    selectedCategories={selectedCategories}
                    toggleCategory={toggleCategory}
                    selectedColors={selectedColors}
                    toggleColor={toggleColor}
                    selectedTags={selectedTags}
                    toggleTag={toggleTag}
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-9 flex flex-col w-full h-full justify-between">
              {displayedProducts.length > 0 ? (
                <div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full py-1">
                    {displayedProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        name={product.name}
                        price={product.price}
                        originalPrice={product.originalPrice}
                        rating={product.rating}
                        reviews={product.reviews}
                        image={product.image}
                        badge={product.badge}
                        badgeLabel={product.badgeLabel}
                        onAddToCart={() =>
                          console.log("Added to cart:", product.name)
                        }
                      />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      className="mt-10 mb-4"
                    />
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center bg-surface border border-border rounded-lg p-8 w-full shadow-sm">
                  <p className="text-[13px] text-text-secondary font-medium mb-4 select-none">
                    Không tìm thấy sản phẩm nào khớp với bộ lọc của bạn.
                  </p>
                  <Button
                    variant="primary"
                    onClick={clearAllFilters}
                    className="rounded-md px-5 py-2 text-xs font-bold"
                  >
                    Thiết lập lại bộ lọc
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-16 pt-10 border-t border-border/80 text-left">
            <h2 className="text-[16px] md:text-[18px] font-bold text-text-primary mb-3">
              MUA MÓC KHÓA LEN HANDMADE TẠI TIỆM LEN NHÀ KIỀU
            </h2>
            <div className="text-[13px] text-text-secondary leading-relaxed space-y-4 max-w-4xl">
              <p>
                Chào mừng bạn đến với Tiệm Len Nhà Kiều - nơi gói trọn tình yêu qua từng mũi móc len đan tay tỉ mỉ. Các sản phẩm móc khóa len của chúng tôi không đơn thuần là món phụ kiện trang trí mà còn là món quà tặng ý nghĩa gửi gắm trọn vẹn tình cảm đến người nhận.
              </p>
              <p>
                Tất cả sản phẩm đều được làm từ dòng len sợi cotton cao cấp, mềm mịn, không bị xơ xù và tuyệt đối an toàn cho làn da nhạy cảm. Chúng tôi nhận đan móc theo yêu cầu riêng về màu sắc, thiết kế riêng, hỗ trợ gói quà viết thiệp miễn phí giúp bạn có được món quà độc nhất vô nhị.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onClear={clearAllFilters}
      >
        <FilterContent
          search={search}
          setSearch={setSearch}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          selectedCategories={selectedCategories}
          toggleCategory={toggleCategory}
          selectedColors={selectedColors}
          toggleColor={toggleColor}
          selectedTags={selectedTags}
          toggleTag={toggleTag}
        />
      </FilterModal>
    </div>
  );
}
