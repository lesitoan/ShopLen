import React from "react";
import LoadingDots from "@/components/ui/LoadingDots";

export default function PaymentLoadingView() {
  return (
    <main className="flex-1 py-16 text-center">
      <div className="max-w-md mx-auto px-4 flex flex-col items-center gap-4">
        <LoadingDots size="lg" color="bg-primary" />
        <p className="text-sm font-medium text-text-secondary">
          Đang tải thông tin mã QR thanh toán...
        </p>
      </div>
    </main>
  );
}
