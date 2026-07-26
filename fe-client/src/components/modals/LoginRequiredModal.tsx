"use client";

import React from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectTo?: string;
}

export default function LoginRequiredModal({
  isOpen,
  onClose,
  redirectTo = "/dang-nhap",
}: LoginRequiredModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end md:items-center justify-center bg-black/45 px-0 md:px-4">
      <button
        type="button"
        aria-label="Đóng"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />

      <div className="relative w-full md:max-w-md bg-surface border border-border shadow-2xl rounded-t-2xl md:rounded-xl p-5 md:p-6 animate-in fade-in slide-in-from-bottom-4 md:slide-in-from-bottom-0 md:zoom-in-95 duration-200 text-left">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border md:hidden" />

        <h2 className="text-[18px] font-bold text-text-primary">
          Đăng nhập để thanh toán
        </h2>
        <p className="mt-2 text-[13.5px] leading-6 text-text-secondary">
          Bạn cần đăng nhập tài khoản trước khi tạo đơn hàng và nhận mã QR thanh
          toán.
        </p>

        <div className="mt-5 flex flex-col md:flex-row gap-2.5">
          <Link href={redirectTo} className="w-full" onClick={onClose}>
            <Button
              variant="primary"
              size="md"
              className="w-full rounded-md justify-center"
            >
              Đăng nhập
            </Button>
          </Link>
          <Button
            type="button"
            variant="secondary"
            size="md"
            className="w-full rounded-md justify-center"
            onClick={onClose}
          >
            Để sau
          </Button>
        </div>
      </div>
    </div>
  );
}
