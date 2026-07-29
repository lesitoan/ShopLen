"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import Select from "@/components/ui/Select";
import Pagination from "@/components/ui/Pagination";
import EmptyState from "@/components/ui/EmptyState";
import ProductGridSkeleton from "@/components/skeletons/product/ProductGridSkeleton";

import FilterContent from "./components/FilterContent";
import FilterModal from "./components/FilterModal";
import useStickySidebar from "./hooks/useStickySidebar";
import { useProductFilters } from "./hooks/useProductFilters";
import { useGetProductsQuery, ProductItem } from "@/services/api/productApi";

const SORT_OPTIONS = [
  { value: "BEST_SELLING", label: "Bán chạy nhất" },
  { value: "NEWEST", label: "Mới nhất" },
  { value: "PRICE_ASC", label: "Giá: Thấp đến Cao" },
  { value: "PRICE_DESC", label: "Giá: Cao đến Thấp" },
  { value: "discount", label: "Khuyến mãi tốt nhất" },
];

export default function ProductsScreen() {
  const { sidebarRef, style: sidebarStyle } = useStickySidebar();
  const { filters, queryParams, hasActiveFilters, actions } = useProductFilters();

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const { data: apiResponse, isLoading, isFetching, isError, refetch } = useGetProductsQuery(queryParams);

  const products = apiResponse?.items || [];
  const pagination = apiResponse?.pagination;
  const totalItems = pagination?.totalItems ?? 0;
  const totalPages = pagination?.totalPages ?? 1;

  const handleClearAll = () => {
    actions.clearAllFilters();
  };

  const handlePageChange = (newPage: number) => {
    actions.setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <main className="flex-1 py-8 flex flex-col">
        <div className="max-w-6xl mx-auto px-4 md:px-6 w-full flex-1 flex flex-col">
          <div className="flex items-center gap-1.5 text-[12px] text-text-secondary mb-4 select-none">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
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
              Tìm thấy <span className="text-secondary font-bold">{totalItems}</span> sản phẩm
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
                  value={filters.sort}
                  onChange={actions.setSort}
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
                      onClick={handleClearAll}
                      className="text-[11px] font-bold text-secondary hover:text-primary transition-colors underline"
                    >
                      Xóa bộ lọc
                    </button>
                  )}
                </div>

                <div className="p-5 pt-4 overflow-y-auto no-scrollbar flex-1">
                  <FilterContent filters={filters} actions={actions} />
                </div>
              </div>
            </div>

            <div className="md:col-span-9 flex flex-col w-full h-full justify-between">
              {isLoading || isFetching ? (
                <ProductGridSkeleton count={12} className="!grid-cols-2 sm:!grid-cols-3 lg:!grid-cols-4" />
              ) : isError || products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center bg-surface border border-border rounded-lg p-8 w-full shadow-sm">
                  <EmptyState
                    title="Không tìm thấy sản phẩm nào khớp với bộ lọc của bạn."
                    actionLabel="Thiết lập lại bộ lọc"
                    onAction={handleClearAll}
                  />
                </div>
              ) : (
                <div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full py-1">
                    {products.map((product: ProductItem) => (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        slug={product.slug}
                        name={product.name}
                        price={product.price ?? product.salePrice ?? product.originalPrice ?? 0}
                        originalPrice={
                          product.salePrice && product.originalPrice ? product.originalPrice : undefined
                        }
                        rating={product.rating}
                        reviews={product.reviews}
                        soldCount={product.soldCount}
                        image={product.thumbnail?.url || product.image || "/logo.png"}
                        badge={
                          product.highlightType === "TODAY_DEAL"
                            ? "sale"
                            : product.highlightType === "HOT_TIKTOK"
                            ? "hotTiktok"
                            : "bestSeller"
                        }
                        badgeLabel={product.highlightLabel || undefined}
                      />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <Pagination
                      currentPage={filters.page}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      className="mt-10 mb-4"
                    />
                  )}
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

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onClear={handleClearAll}
      >
        <FilterContent filters={filters} actions={actions} />
      </FilterModal>
    </>
  );
}
