import React from "react";
import Image from "next/image";
import { BRAND_STORY } from "../constants";

export default function BrandStory() {
  return (
    <section aria-label="Câu chuyện thương hiệu" className="py-8 md:py-12 border-b border-border">
      <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-col md:flex-row gap-8 lg:gap-12 items-center">
        <div className="flex-1 flex flex-col gap-4 text-left">
          <span className="text-[12px] font-bold text-secondary uppercase tracking-widest bg-primary-light px-3 py-1 rounded w-fit">
            Về chúng tôi
          </span>

          <h2 className="text-[20px] md:text-[24px] font-bold text-text-primary leading-tight">
            {BRAND_STORY.title}
          </h2>

          <p className="text-[14px] font-medium text-secondary italic">
            "{BRAND_STORY.subtitle}"
          </p>

          <div className="flex flex-col gap-3 text-[14px] text-text-primary leading-relaxed">
            {BRAND_STORY.paragraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border mt-2">
            {BRAND_STORY.stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-2 bg-primary-light/30 rounded-lg border border-border">
                <span className="text-[18px] md:text-[22px] font-bold text-secondary">{stat.value}</span>
                <span className="text-[11px] md:text-[12px] text-text-secondary font-medium">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-[420px] shrink-0">
          <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-border bg-surface">
            <Image
              src={BRAND_STORY.image}
              alt="Sản phẩm len handmade Tiệm Len Nhà Kiều"
              fill
              sizes="(max-width: 768px) 100vw, 420px"
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
