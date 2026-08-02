"use client";

import React, { useState, useEffect } from "react";
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
  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      setShouldRender(true);
      timer = setTimeout(() => {
        setIsVisible(true);
      }, 15);
    } else {
      setIsVisible(false);
      timer = setTimeout(() => {
        setShouldRender(false);
      }, 200);
    }
    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen && !shouldRender) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end md:items-center justify-center p-0 md:p-4">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 transition-opacity duration-200 ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal Dialog Window */}
      <div
        className={`relative w-full md:max-w-md bg-surface border border-border shadow-2xl rounded-t-2xl md:rounded-xl p-5 md:p-6 text-left transition-all duration-300 md:duration-200 ease-out ${
          isVisible
            ? "translate-y-0 opacity-100 scale-100 md:scale-100 md:translate-y-0"
            : "translate-y-full opacity-100 scale-100 md:opacity-0 md:scale-75 md:translate-y-2"
        }`}
      >
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
