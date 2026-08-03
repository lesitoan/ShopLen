"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import CategoryGridSkeleton from "@/components/skeletons/home/CategoryGridSkeleton";
import { useGetCategoriesQuery, Category } from "@/services/api/categoryApi";

const ITEMS_PER_PAGE = 6;

export default function CategoryGrid() {
  const { data: apiCategories = [], isLoading, isError, refetch } = useGetCategoriesQuery();
  const [currentPage, setCurrentPage] = useState(0);

  const activeSlideRef = useRef<HTMLDivElement | null>(null);
  const [containerHeight, setContainerHeight] = useState<number | undefined>(undefined);

  // Phân chia danh mục thành các trang (mỗi trang tối đa 6 item)
  const categoryPages: Category[][] = [];
  for (let i = 0; i < apiCategories.length; i += ITEMS_PER_PAGE) {
    categoryPages.push(apiCategories.slice(i, i + ITEMS_PER_PAGE));
  }

  const totalPages = categoryPages.length;

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  // Cập nhật chiều cao container co giãn linh hoạt theo số lượng item của trang hiện tại
  useEffect(() => {
    const updateHeight = () => {
      if (activeSlideRef.current) {
        setContainerHeight(activeSlideRef.current.offsetHeight);
      }
    };

    updateHeight();

    const timer = setTimeout(updateHeight, 50);
    window.addEventListener("resize", updateHeight);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateHeight);
    };
  }, [currentPage, apiCategories, isLoading]);

  return (
    <section className="w-full max-w-6xl mx-auto px-4 md:px-6 mb-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 flex flex-col justify-start items-start w-full">
          <div className="w-full">
            <div className="flex items-center justify-between gap-4 mb-2">
              <h2 className="text-[20px] md:text-[22px] font-bold text-text-primary leading-tight">
                DANH MỤC SẢN PHẨM
              </h2>

              {totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={currentPage === 0}
                    onClick={handlePrevPage}
                    className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-text-primary hover:bg-primary-light hover:text-secondary hover:border-primary/50 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-text-primary disabled:hover:border-border"
                    title="Trang trước"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    disabled={currentPage >= totalPages - 1}
                    onClick={handleNextPage}
                    className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-text-primary hover:bg-primary-light hover:text-secondary hover:border-primary/50 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-text-primary disabled:hover:border-border"
                    title="Trang tiếp theo"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>

            <p className="text-[12px] md:text-[13px] text-text-secondary leading-relaxed mb-6">
              Khám phá các danh mục sản phẩm len handmade được yêu thích tại Tiệm Len Nhà Kiều.
            </p>
          </div>

          <div
            className="w-full overflow-hidden p-1 -m-1 transition-[height] duration-500 ease-in-out"
            style={{ height: containerHeight ? `${containerHeight + 8}px` : "auto" }}
          >
            {isLoading ? (
              <CategoryGridSkeleton />
            ) : isError || apiCategories.length === 0 ? (
              <div className="min-h-[220px] border-0 bg-transparent flex items-center justify-center w-full">
                <EmptyState
                  title="Không có dữ liệu, thử lại sau"
                  actionLabel="Tải lại"
                  onAction={() => refetch()}
                />
              </div>
            ) : (
              <div
                className="flex items-start transition-transform duration-500 ease-in-out w-full"
                style={{ transform: `translateX(-${currentPage * 100}%)` }}
              >
                {categoryPages.map((pageItems, pageIdx) => (
                  <div
                    key={pageIdx}
                    ref={pageIdx === currentPage ? activeSlideRef : null}
                    className="w-full shrink-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-start content-start p-1"
                  >
                    {pageItems.map((category: Category) => (
                      <Link
                        key={category.id}
                        href={`/san-pham?category=${category.slug}`}
                        className="flex items-center gap-4 p-3 bg-surface border border-border rounded-lg hover:border-primary transition-all duration-300 cursor-pointer group h-auto"
                      >
                        <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-background border border-border transition-transform duration-300 group-hover:scale-105">
                          <Image
                            src={category.image || "/logo.png"}
                            alt={category.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>

                        <div className="flex flex-col min-w-0">
                          <span className="text-[12px] font-bold text-text-primary tracking-wide transition-colors group-hover:text-secondary line-clamp-1">
                            {category.name}
                          </span>
                          <span className="text-[10px] text-text-secondary group-hover:text-secondary font-medium transition-colors inline-flex items-center gap-1 mt-1">
                            <span>Xem ngay</span>
                            <ArrowRight
                              size={10}
                              className="transition-transform duration-300 group-hover:translate-x-1"
                            />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 h-full">
          <div className="relative overflow-hidden rounded-lg border border-border p-8 flex flex-col justify-between min-h-[300px] lg:h-full group/promo">
            <Image
              src="/images/products/gau-bong-tho.png"
              alt="Gấu len handmade"
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover z-0 transition-transform duration-700 group-hover/promo:scale-105"
            />

            <div className="absolute inset-0 bg-black/50 z-10" />

            <div className="z-20 flex flex-col items-start justify-between h-full">
              <div>
                <span className="text-primary italic text-sm font-semibold mb-1 block">
                  Quà tặng handmade
                </span>
                <h3 className="text-[20px] md:text-[22px] font-bold text-white leading-tight mb-2 max-w-[200px]">
                  Trao yêu thương – Gửi từ trái tim
                </h3>
                <p className="text-[11px] md:text-[12px] text-white/80 leading-relaxed mb-6 max-w-[220px]">
                  Những món len đan móc tỉ mỉ theo yêu cầu, gửi trọn ý tưởng của riêng bạn.
                </p>
              </div>
              <Link href="/lien-he">
                <Button variant="primary" className="rounded-md px-5 py-2.5 font-semibold text-[12px]">
                  Đặt hàng ngay
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
