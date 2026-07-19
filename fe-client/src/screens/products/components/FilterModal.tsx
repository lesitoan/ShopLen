"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import Button from "@/components/ui/Button";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClear?: () => void;
  children: React.ReactNode;
}

export default function FilterModal({
  isOpen,
  onClose,
  onClear,
  children,
}: FilterModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 md:hidden flex items-end justify-center">
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      <div className="relative bg-surface w-full rounded-t-2xl border-t border-border max-h-[85vh] overflow-hidden flex flex-col z-10 animate-in slide-in-from-bottom duration-300">
        <div className="w-12 h-1 bg-border/60 rounded-full mx-auto my-3 shrink-0" />

        <div className="flex items-center justify-between px-6 pb-3 border-b border-border/50 shrink-0 text-left">
          <span className="text-[16px] font-bold text-text-primary">Bộ lọc tìm kiếm</span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-background flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>

        <div className="p-4 border-t border-border bg-background/50 flex items-center justify-center gap-3 shrink-0">
          {onClear && (
            <Button
              variant="secondary"
              size="md"
              onClick={onClear}
              className="rounded-md py-2.5 px-4 font-semibold text-xs whitespace-nowrap"
            >
              Thiết lập lại
            </Button>
          )}
          <Button
            variant="primary"
            size="md"
            onClick={onClose}
            className="w-full rounded-md py-2.5 font-bold text-xs"
          >
            Áp dụng
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
