import React from "react";
import Link from "next/link";
import { ShoppingBag, BookOpen } from "lucide-react";

export default function AboutCta() {
  return (
    <section aria-label="Kêu gọi hành động" className="py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="border border-border rounded-xl bg-primary-light/40 p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex flex-col gap-2 max-w-xl">
            <h2 className="text-[18px] md:text-[22px] font-bold text-text-primary">
              Tìm Kiếm Món Quà Len Handmade Độc Đáo?
            </h2>
            <p className="text-[13.5px] text-text-secondary leading-relaxed">
              Khám phá ngay bộ sưu tập móc khóa, thú bông và hoa len handmade xinh xắn hoặc đọc các bài viết hướng dẫn móc len miễn phí.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center shrink-0">
            <Link
              href="/san-pham"
              className="bg-primary hover:bg-primary-hover active:bg-primary-active text-white px-5 py-2.5 rounded-lg text-[13.5px] font-semibold flex items-center gap-2 transition-colors"
            >
              <ShoppingBag size={16} />
              <span>Xem sản phẩm</span>
            </Link>
            <Link
              href="/bai-viet"
              className="bg-surface border border-border hover:border-secondary text-text-primary hover:text-secondary px-5 py-2.5 rounded-lg text-[13.5px] font-semibold flex items-center gap-2 transition-colors"
            >
              <BookOpen size={16} />
              <span>Đọc bài viết</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
