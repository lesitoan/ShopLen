import React from "react";
import Link from "next/link";
import { AlertCircle, QrCode, ShoppingBag, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";
import type { PaymentQrResponseData } from "@/types/payment.type";

interface PaymentExpiredViewProps {
  qrData: PaymentQrResponseData;
}

export default function PaymentExpiredView({ qrData }: PaymentExpiredViewProps) {
  return (
    <main className="flex-1 py-8 md:py-10 text-left">
      <div className="max-w-3xl mx-auto px-0 md:px-6 w-full">
        <div className="bg-surface border-0 md:border border-border rounded-none md:rounded-xl px-4 py-8 md:p-8 my-6 md:my-0 flex flex-col items-center text-center shadow-none md:shadow-sm">
          {/* HEADER STATUS */}
          <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/50 px-4 py-1.5 rounded-full text-[13px] font-bold mb-4 select-none">
            <AlertCircle size={16} className="text-error shrink-0" />
            <span>Đơn hàng / Mã QR đã hết hạn thanh toán</span>
          </div>

          <h1 className="text-[22px] md:text-[26px] font-bold text-text-primary mb-2">
            Mã QR đã hết hạn thanh toán
          </h1>

          <p className="text-[13.5px] text-text-secondary max-w-lg mb-6">
            Thời gian giữ đơn hàng (15 phút) đã kết thúc hoặc đơn hàng đã bị hủy. Mã VietQR không còn hiệu lực. Vui lòng quay lại cửa hàng để tạo đơn mới.
          </p>

          {/* EXPIRED QR PLACEHOLDER (NO QR CODE IMAGE) */}
          <div className="w-64 h-64 bg-background border-2 border-dashed border-error/30 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 mb-6 text-text-secondary select-none">
            <div className="w-12 h-12 rounded-full bg-error/10 text-error flex items-center justify-center mb-1">
              <AlertCircle size={26} />
            </div>
            <span className="text-[14px] font-bold text-error">
              Mã QR đã hết hạn
            </span>
            <span className="text-[11.5px] text-text-secondary/70 max-w-[200px]">
              Không hiển thị mã QR và không thể chuyển tiền vào mã này
            </span>
          </div>

          {/* DISABLED MANUAL TRANSFER INFO */}
          <div className="w-full bg-background border border-border rounded-xl p-4 md:p-6 flex flex-col gap-3 text-left mb-6 opacity-60 pointer-events-none select-none">
            <h2 className="text-[14px] font-bold text-text-primary border-b border-border pb-2 flex items-center gap-2">
              <QrCode size={16} className="text-secondary" />
              <span>Thông tin chuyển khoản (Đã hết hạn)</span>
            </h2>

            <div className="flex items-center justify-between text-[13px] py-1 border-b border-border/40">
              <span className="text-text-secondary">Ngân hàng</span>
              <span className="font-bold text-text-primary">{qrData.bankCode}</span>
            </div>

            <div className="flex items-center justify-between text-[13px] py-1 border-b border-border/40">
              <span className="text-text-secondary">Số tài khoản</span>
              <span className="font-bold text-text-primary font-mono">{qrData.accountNo}</span>
            </div>

            <div className="flex items-center justify-between text-[13px] py-1 border-b border-border/40">
              <span className="text-text-secondary">Chủ tài khoản</span>
              <span className="font-bold text-text-primary">{qrData.accountName}</span>
            </div>

            <div className="flex items-center justify-between text-[13px] py-1 border-b border-border/40">
              <span className="text-text-secondary">Số tiền chuyển</span>
              <span className="font-bold text-secondary text-[15px]">
                {qrData.amount.toLocaleString("vi-VN")}đ
              </span>
            </div>

            <div className="flex items-center justify-between text-[13px] py-1">
              <span className="text-text-secondary">Nội dung chuyển khoản</span>
              <span className="font-bold text-text-primary bg-primary-light text-secondary px-2 py-0.5 rounded font-mono">
                {qrData.transferContent}
              </span>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
            <Link href="/san-pham" className="flex-1">
              <Button
                variant="primary"
                size="md"
                className="w-full py-2.5 text-[13px] font-bold rounded-md justify-center gap-2"
              >
                <ShoppingBag size={16} />
                <span>Mua sản phẩm khác</span>
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button
                variant="outline"
                size="md"
                className="w-full py-2.5 text-[13px] font-semibold rounded-md justify-center border-border text-text-primary"
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
