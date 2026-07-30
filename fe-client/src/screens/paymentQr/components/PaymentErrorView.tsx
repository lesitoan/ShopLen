import React from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

interface PaymentErrorViewProps {
  onRetry: () => void;
}

export default function PaymentErrorView({ onRetry }: PaymentErrorViewProps) {
  return (
    <main className="flex-1 py-16 text-center">
      <div className="max-w-md mx-auto px-4 flex flex-col items-center gap-4">
        <h2 className="text-lg font-bold text-text-primary">
          Không tìm thấy thông tin đơn hàng
        </h2>
        <p className="text-xs text-text-secondary">
          Đơn hàng không tồn tại hoặc đã hết hạn thanh toán.
        </p>
        <div className="flex gap-3 mt-2">
          <Button variant="outline" size="sm" onClick={onRetry}>
            Thử lại
          </Button>
          <Link href="/san-pham">
            <Button variant="primary" size="sm">
              Quay lại cửa hàng
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
