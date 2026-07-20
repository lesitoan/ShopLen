import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function CartBreadcrumbs() {
  return (
    <nav className="flex items-center gap-2 text-[13px] text-text-secondary mb-6 select-none">
      <Link href="/" className="hover:text-secondary transition-colors">
        Trang chủ
      </Link>
      <ChevronRight size={14} className="text-text-secondary/60" />
      <span className="font-semibold text-text-primary">Giỏ hàng của bạn</span>
    </nav>
  );
}
