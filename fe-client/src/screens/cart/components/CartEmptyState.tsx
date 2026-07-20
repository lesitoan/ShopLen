import React from "react";
import Link from "next/link";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";

export default function CartEmptyState() {
  return (
    <div className="bg-surface border border-border rounded-xl p-8 md:p-16 flex flex-col items-center justify-center text-center my-6">
      <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center text-secondary mb-4">
        <ShoppingCart size={40} />
      </div>

      <h2 className="text-[18px] md:text-[20px] font-bold text-text-primary mb-2">
        Giỏ hàng của bạn đang trống
      </h2>

      <p className="text-[13.5px] text-text-secondary max-w-md mb-6">
        Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá bộ sưu tập móc khóa len thủ công xinh xắn của Tiệm Len Nhà Kiều nhé.
      </p>

      <Link href="/san-pham">
        <Button
          variant="primary"
          size="md"
          className="rounded-md px-6 py-3 font-bold text-[13px] flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          <span>Khám phá sản phẩm ngay</span>
        </Button>
      </Link>
    </div>
  );
}
