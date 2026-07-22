import React from "react";
import Link from "next/link";

export default function ContactHeader() {
  return (
    <div className="w-full bg-primary-light/50 border-b border-border py-6 md:py-8">
      <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-col items-start text-left gap-2">
        <nav aria-label="Breadcrumb" className="text-[12px] text-text-secondary flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-text-primary transition-colors">
            Trang chủ
          </Link>
          <span>›</span>
          <span className="text-text-primary font-medium">Liên hệ</span>
        </nav>

        <h1 className="text-[22px] md:text-[28px] font-bold text-text-primary uppercase tracking-wider">
          Thông Tin Liên Hệ
        </h1>

        <p className="text-[13.5px] md:text-[14.5px] text-text-secondary max-w-2xl leading-relaxed">
          Tiệm Len Nhà Kiều luôn sẵn sàng lắng nghe, tư vấn báo giá quà tặng len handmade và giải đáp mọi thắc mắc của bạn.
        </p>
      </div>
    </div>
  );
}
