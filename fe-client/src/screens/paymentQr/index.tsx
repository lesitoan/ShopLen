"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Copy, Clock, QrCode, ShieldCheck, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";

interface PaymentQrScreenProps {
  orderId: string;
}

export default function PaymentQrScreen({ orderId }: PaymentQrScreenProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

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

  const bankInfo = {
    bankName: "MBBank (Ngân hàng Quân Đội)",
    accountNumber: "0388123456",
    accountHolder: "NHO THI KIEU",
    amount: 155000,
    memo: orderId,
  };

  return (
    <main className="flex-1 py-8 text-left">
      <div className="max-w-3xl mx-auto px-4 md:px-6 w-full">
        <div className="bg-surface border border-border rounded-xl p-6 md:p-8 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-800 border border-amber-200 px-3.5 py-1.5 rounded-full text-[13px] font-bold mb-4">
            <Clock size={16} className="animate-pulse text-amber-600" />
            <span>Đang chờ thanh toán — Hết hạn sau: {formatTime(timeLeft)}</span>
          </div>

          <h1 className="text-[22px] md:text-[26px] font-bold text-text-primary mb-2">
            Quét mã QR để thanh toán đơn hàng
          </h1>

          <p className="text-[13.5px] text-text-secondary max-w-lg mb-6">
            Mở ứng dụng ngân hàng hoặc ví điện tử bất kỳ của bạn để quét mã QR bên dưới. Hệ thống sẽ tự động xác nhận sau khi nhận được tiền.
          </p>

          <div className="relative w-64 h-64 bg-surface border-2 border-primary/40 rounded-2xl p-4 flex items-center justify-center mb-6">
            <Image
              src="/images/icons/vietqr-demo.png"
              alt="Mã QR thanh toán VietQR"
              width={220}
              height={220}
              className="object-contain rounded-lg"
              priority
            />
          </div>

          <div className="w-full bg-background border border-border rounded-xl p-4 md:p-6 flex flex-col gap-3 text-left mb-6">
            <h2 className="text-[14px] font-bold text-text-primary border-b border-border pb-2 flex items-center gap-2">
              <QrCode size={16} className="text-secondary" />
              <span>Thông tin chuyển khoản thủ công (nếu không quét QR)</span>
            </h2>

            <div className="flex items-center justify-between text-[13px] py-1 border-b border-border/40">
              <span className="text-text-secondary">Ngân hàng</span>
              <span className="font-bold text-text-primary">{bankInfo.bankName}</span>
            </div>

            <div className="flex items-center justify-between text-[13px] py-1 border-b border-border/40">
              <span className="text-text-secondary">Số tài khoản</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-text-primary font-mono">{bankInfo.accountNumber}</span>
                <button
                  onClick={() => handleCopy(bankInfo.accountNumber, "acc")}
                  className="text-secondary hover:text-primary p-1 rounded hover:bg-primary-light transition-colors"
                >
                  {copiedField === "acc" ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[13px] py-1 border-b border-border/40">
              <span className="text-text-secondary">Chủ tài khoản</span>
              <span className="font-bold text-text-primary">{bankInfo.accountHolder}</span>
            </div>

            <div className="flex items-center justify-between text-[13px] py-1 border-b border-border/40">
              <span className="text-text-secondary">Số tiền chuyển</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-secondary text-[15px]">
                  {bankInfo.amount.toLocaleString("vi-VN")}đ
                </span>
                <button
                  onClick={() => handleCopy(bankInfo.amount.toString(), "amt")}
                  className="text-secondary hover:text-primary p-1 rounded hover:bg-primary-light transition-colors"
                >
                  {copiedField === "amt" ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[13px] py-1">
              <span className="text-text-secondary">Nội dung chuyển khoản</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-text-primary bg-primary-light text-secondary px-2 py-0.5 rounded font-mono">
                  {bankInfo.memo}
                </span>
                <button
                  onClick={() => handleCopy(bankInfo.memo, "memo")}
                  className="text-secondary hover:text-primary p-1 rounded hover:bg-primary-light transition-colors"
                >
                  {copiedField === "memo" ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-[12px] text-text-secondary mb-6">
            <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
            <span>Hệ thống đang tự động lắng nghe giao dịch qua Socket.IO</span>
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
