import React from "react";
import Link from "next/link";

export default function OrderLookupHeader() {
  return (
    <div className="w-full bg-primary-light/50 border-b border-border py-6 md:py-8">
      <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-col items-start text-left gap-2">
        <nav aria-label="Breadcrumb" className="text-[12px] text-text-secondary flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-text-primary transition-colors">
            Trang chủ
          </Link>
          <span>›</span>
          <span className="text-text-primary font-medium">Tra cứu đơn hàng</span>
        </nav>

        <h1 className="text-[22px] md:text-[28px] font-bold text-text-primary uppercase tracking-wider">
          Tra Cứu Trạng Thái Đơn Hàng
        </h1>

        <p className="text-[13.5px] md:text-[14.5px] text-text-secondary max-w-2xl leading-relaxed">
          Nhập mã đơn hàng và số điện thoại mua hàng để theo dõi tiến độ đan móc thủ công và hành trình vận chuyển.
        </p>
      </div>
    </div>
  );
}
