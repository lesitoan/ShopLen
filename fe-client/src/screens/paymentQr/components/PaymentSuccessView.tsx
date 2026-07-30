import React from "react";
import Link from "next/link";
import { CheckCircle2, ShoppingBag, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";

interface PaymentSuccessViewProps {
  orderCode: string;
  amount: number;
}

export default function PaymentSuccessView({
  orderCode,
  amount,
}: PaymentSuccessViewProps) {
  return (
    <main className="flex-1 py-8 md:py-12 text-left">
      <div className="max-w-xl mx-auto px-0 md:px-6 w-full">
        <div className="bg-gradient-to-b from-emerald-50/80 via-emerald-50/20 to-surface dark:from-emerald-950/40 dark:via-emerald-950/10 dark:to-surface border-0 md:border border-emerald-200/80 dark:border-emerald-800/50 rounded-none md:rounded-2xl px-4 py-8 md:p-8 my-6 md:my-0 flex flex-col items-center text-center shadow-none md:shadow-sm">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 ring-8 ring-emerald-50 dark:bg-emerald-900/60 dark:text-emerald-400 dark:ring-emerald-950/60 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 size={36} />
          </div>

          <h1 className="text-[22px] md:text-[26px] font-bold text-text-primary mb-2">
            Thanh toán thành công!
          </h1>

          <p className="text-[13.5px] text-text-secondary max-w-md mb-6">
            Cảm ơn bạn đã đặt hàng tại Tiệm Len Nhà Kiều. Hệ thống đã ghi nhận khoản thanh toán tự động qua SePay cho đơn hàng{" "}
            <span className="font-bold text-text-primary">#{orderCode}</span>.
          </p>

          <div className="w-full bg-surface/90 dark:bg-surface/50 backdrop-blur-sm border border-emerald-100/80 dark:border-emerald-800/40 rounded-xl p-4 flex flex-col gap-2.5 text-left text-[13px] mb-6 shadow-sm">
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-text-secondary">Mã đơn hàng</span>
              <span className="font-bold text-text-primary">#{orderCode}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-text-secondary">Số tiền đã thanh toán</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {amount.toLocaleString("vi-VN")}đ
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-text-secondary">Trạng thái</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                Đã thanh toán (SePay Verified)
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Link href="/tai-khoan" className="flex-1">
              <Button
                variant="primary"
                size="md"
                className="w-full py-2.5 text-[13px] font-semibold rounded-lg justify-center"
              >
                <ShoppingBag size={16} />
                <span>Xem đơn hàng của tôi</span>
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button
                variant="outline"
                size="md"
                className="w-full py-2.5 text-[13px] font-semibold rounded-lg justify-center border-border text-text-primary"
              >
                <ArrowLeft size={16} />
                <span>Trở về trang chủ</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
