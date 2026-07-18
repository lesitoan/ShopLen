"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { CATEGORIES } from "../constants";
import Button from "@/components/ui/Button";

export default function CategoryGrid() {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 md:px-6 mb-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col justify-between">
          <div>
            <h2 className="text-[20px] md:text-[22px] font-bold text-text-primary mb-2 leading-tight">
              DANH MỤC SẢN PHẨM
            </h2>
            <p className="text-[12px] md:text-[13px] text-text-secondary leading-relaxed mb-6">
              Khám phá các danh mục sản phẩm len handmade được yêu thích tại Tiệm Len Nhà Kiều.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {CATEGORIES.map((category) => (
              <a
                key={category.id}
                href={`/san-pham?category=${category.slug}`}
                className="flex items-center gap-4 p-3 bg-surface border border-border rounded-lg hover:border-primary transition-all duration-300 cursor-pointer group"
              >
                <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-background border border-border transition-transform duration-300 group-hover:scale-105">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-col">
                  <span className="text-[12px] font-bold text-text-primary tracking-wide transition-colors group-hover:text-secondary line-clamp-1">
                    {category.name}
                  </span>
                  <span className="text-[10px] text-text-secondary group-hover:text-secondary font-medium transition-colors inline-flex items-center gap-1 mt-1">
                    <span>Xem ngay</span>
                    <ArrowRight size={10} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 h-full">
          <div className="relative overflow-hidden rounded-lg border border-border p-8 flex flex-col justify-between min-h-[300px] lg:h-full group/promo">
            <img
              src="/images/products/gau-bong-tho.png"
              alt="Gấu len handmade"
              className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 group-hover/promo:scale-105"
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
              <a href="/lien-he">
                <Button variant="primary" className="rounded-md px-5 py-2.5 font-semibold text-[12px]">
                  Đặt hàng ngay
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
