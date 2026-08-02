"use client";

import React, { useState, useEffect } from "react";
import { X, PackageCheck } from "lucide-react";
import OrderDetailContent from "@/screens/userProfile/components/OrderDetailContent";

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderCode: string;
}

export default function OrderDetailModal({
  isOpen,
  onClose,
  orderId,
  orderCode,
}: OrderDetailModalProps) {
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
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 transition-opacity duration-200 ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal Dialog Window */}
      <div
        className={`relative w-full md:max-w-2xl bg-surface border-t md:border border-border rounded-t-2xl md:rounded-2xl shadow-2xl z-10 flex flex-col max-h-[90vh] md:max-h-[85vh] overflow-hidden transition-all duration-300 md:duration-200 ease-out ${
          isVisible
            ? "translate-y-0 opacity-100 scale-100 md:scale-100 md:translate-y-0"
            : "translate-y-full opacity-100 scale-100 md:opacity-0 md:scale-75 md:translate-y-2"
        }`}
      >
        {/* Mobile Handle Indicator */}
        <div className="flex md:hidden justify-center pt-2.5 pb-1">
          <div className="w-10 h-1.5 bg-border/80 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-5 py-3 md:py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <PackageCheck size={18} className="text-secondary" />
            <h3 className="text-[14.5px] md:text-[16px] font-bold text-text-primary">
              Chi tiết đơn hàng <span className="font-mono text-secondary">#{orderCode}</span>
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 md:p-1.5 text-text-secondary hover:text-text-primary rounded-lg hover:bg-background transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 md:p-5 overflow-y-auto max-h-[calc(90vh-60px)] md:max-h-[80vh] pb-8 md:pb-5">
          <OrderDetailContent orderId={orderId} />
        </div>
      </div>
    </div>
  );
}
