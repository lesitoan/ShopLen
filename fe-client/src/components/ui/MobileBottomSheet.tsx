"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  showDragHandle?: boolean;
  showCloseButton?: boolean;
  maxHeightClass?: string;
  paddingClass?: string;
  headerPaddingClass?: string;
  children: React.ReactNode;
}

export default function MobileBottomSheet({
  isOpen,
  onClose,
  title,
  showDragHandle = true,
  showCloseButton = true,
  maxHeightClass = "max-h-[85vh]",
  paddingClass = "py-4 pb-6",
  headerPaddingClass = "px-5",
  children,
}: MobileBottomSheetProps) {
  const [mounted, setMounted] = useState(false);
  const [renderModal, setRenderModal] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let animFrame: number;
    let timer: NodeJS.Timeout;

    if (isOpen) {
      setRenderModal(true);
      document.body.style.overflow = "hidden";
      animFrame = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setActive(true);
        });
      });
    } else {
      setActive(false);
      document.body.style.overflow = "";
      timer = setTimeout(() => {
        setRenderModal(false);
      }, 500);
    }

    return () => {
      cancelAnimationFrame(animFrame);
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted || !renderModal || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className={`lg:hidden fixed inset-0 z-50 flex items-end justify-center transition-all duration-500 ease-out ${
        active
          ? "bg-black/60 backdrop-blur-sm opacity-100 pointer-events-auto"
          : "bg-black/0 backdrop-blur-none opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-surface w-full rounded-t-[28px] border-t-2 border-primary/30 ${maxHeightClass} overflow-y-auto ${paddingClass} flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] transform ${
          active ? "translate-y-0" : "translate-y-full"
        } select-none`}
        onClick={(e) => e.stopPropagation()}
      >
        {showDragHandle && (
          <div className="w-12 h-1 bg-border/80 rounded-full mx-auto my-1 mb-3 shrink-0" />
        )}

        {(title || showCloseButton) && (
          <div
            className={`flex items-center justify-between ${headerPaddingClass} pb-3 mb-3 border-b border-border/50 shrink-0 text-left`}
          >
            {title ? (
              <span className="text-[16px] font-bold text-text-primary">
                {title}
              </span>
            ) : (
              <div />
            )}

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-background flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
                aria-label="Đóng"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}

        {children}
      </div>
    </div>,
    document.body
  );
}
