import React from "react";
import Link from "next/link";

interface BreadcrumbsProps {
  productName: string;
}

export default function Breadcrumbs({ productName }: BreadcrumbsProps) {
  return (
    <div className="flex items-center gap-1.5 text-[12px] text-text-secondary mb-6 select-none">
      <Link href="/" className="hover:text-primary transition-colors">
        Trang chủ
      </Link>
      <span>&gt;</span>
      <Link href="/san-pham" className="hover:text-primary transition-colors">
        Sản phẩm
      </Link>
      <span>&gt;</span>
      <span className="font-medium text-text-primary truncate max-w-[200px] md:max-w-xs">
        {productName}
      </span>
    </div>
  );
}
