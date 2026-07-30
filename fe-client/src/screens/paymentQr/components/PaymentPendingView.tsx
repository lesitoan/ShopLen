import React, { useState } from "react";
import Link from "next/link";
import { Clock, QrCode, ShieldCheck, ArrowLeft, Check, Copy } from "lucide-react";
import Button from "@/components/ui/Button";
import type { PaymentQrResponseData } from "@/types/payment.type";

interface PaymentPendingViewProps {
  qrData: PaymentQrResponseData;
  timeLeft: number;
}

export default function PaymentPendingView({
  qrData,
  timeLeft,
}: PaymentPendingViewProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <main className="flex-1 py-8 md:py-10 text-left">
      <div className="max-w-3xl mx-auto px-0 md:px-6 w-full">
        <div className="bg-surface border-0 md:border border-border rounded-none md:rounded-xl px-4 py-8 md:p-8 my-6 md:my-0 flex flex-col items-center text-center shadow-none md:shadow-sm">
          {/* HEADER & ĐẾM NGƯỢC */}
          <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50 px-3.5 py-1.5 rounded-full text-[13px] font-bold mb-4">
            <Clock size={16} className="animate-pulse text-amber-600 dark:text-amber-400" />
            <span>Đang chờ thanh toán — Hết hạn sau: {formatTime(timeLeft)}</span>
          </div>

          <h1 className="text-[22px] md:text-[26px] font-bold text-text-primary mb-2">
            Quét mã QR để thanh toán đơn hàng
          </h1>

          <p className="text-[13.5px] text-text-secondary max-w-lg mb-6">
            Mở ứng dụng ngân hàng hoặc ví điện tử bất kỳ của bạn để quét mã QR VietQR tự động bên dưới. Hệ thống sẽ tự động xác nhận ngay sau khi nhận được tiền.
          </p>

          {/* MÃ QR VIETQR TỰ ĐỘNG TỪ API */}
          <div className="relative w-64 h-64 bg-surface border-2 border-primary/40 rounded-2xl p-4 flex items-center justify-center mb-6 shadow-sm">
            <img
              src={qrData.qrImageUrl}
              alt={`Mã QR VietQR cho đơn hàng ${qrData.orderCode}`}
              className="w-full h-full object-contain rounded-lg"
            />
          </div>

          {/* THÔNG TIN CHUYỂN KHOẢN THỦ CÔNG */}
          <div className="w-full bg-background border border-border rounded-xl p-4 md:p-6 flex flex-col gap-3 text-left mb-6">
            <h2 className="text-[14px] font-bold text-text-primary border-b border-border pb-2 flex items-center gap-2">
              <QrCode size={16} className="text-secondary" />
              <span>Thông tin chuyển khoản thủ công (nếu không quét QR)</span>
            </h2>

            <div className="flex items-center justify-between text-[13px] py-1 border-b border-border/40">
              <span className="text-text-secondary">Ngân hàng</span>
              <span className="font-bold text-text-primary">{qrData.bankCode}</span>
            </div>

            <div className="flex items-center justify-between text-[13px] py-1 border-b border-border/40">
              <span className="text-text-secondary">Số tài khoản</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-text-primary font-mono">{qrData.accountNo}</span>
                <button
                  onClick={() => handleCopy(qrData.accountNo, "acc")}
                  className="text-secondary hover:text-primary p-1 rounded hover:bg-primary-light transition-colors"
                  title="Sao chép số tài khoản"
                >
                  {copiedField === "acc" ? (
                    <Check size={14} className="text-emerald-600" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[13px] py-1 border-b border-border/40">
              <span className="text-text-secondary">Chủ tài khoản</span>
              <span className="font-bold text-text-primary">{qrData.accountName}</span>
            </div>

            <div className="flex items-center justify-between text-[13px] py-1 border-b border-border/40">
              <span className="text-text-secondary">Số tiền chuyển</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-secondary text-[15px]">
                  {qrData.amount.toLocaleString("vi-VN")}đ
                </span>
                <button
                  onClick={() => handleCopy(qrData.amount.toString(), "amt")}
                  className="text-secondary hover:text-primary p-1 rounded hover:bg-primary-light transition-colors"
                  title="Sao chép số tiền"
                >
                  {copiedField === "amt" ? (
                    <Check size={14} className="text-emerald-600" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[13px] py-1">
              <span className="text-text-secondary">Nội dung chuyển khoản</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-text-primary bg-primary-light text-secondary px-2 py-0.5 rounded font-mono">
                  {qrData.transferContent}
                </span>
                <button
                  onClick={() => handleCopy(qrData.transferContent, "memo")}
                  className="text-secondary hover:text-primary p-1 rounded hover:bg-primary-light transition-colors"
                  title="Sao chép nội dung chuyển khoản"
                >
                  {copiedField === "memo" ? (
                    <Check size={14} className="text-emerald-600" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-[12px] text-text-secondary mb-6">
            <ShieldCheck size={16} className="text-emerald-600 shrink-0 animate-pulse" />
            <span>Hệ thống tự động xác nhận chuyển khoản qua SePay ngay sau khi nhận tiền</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
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
