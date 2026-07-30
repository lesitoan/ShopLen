"use client";

import React from "react";
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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl bg-surface border border-border rounded-t-2xl sm:rounded-2xl shadow-xl z-10 flex flex-col max-h-[85vh] sm:max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom duration-300">
        <div className="flex sm:hidden justify-center pt-2.5 pb-1">
          <div className="w-10 h-1 bg-border/80 rounded-full" />
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <PackageCheck size={18} className="text-secondary" />
            <h3 className="text-[15px] font-bold text-text-primary">
              Chi tiết đơn hàng <span className="font-mono text-secondary">#{orderCode}</span>
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-text-secondary hover:text-text-primary rounded-lg hover:bg-background transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(85vh-60px)]">
          <OrderDetailContent orderId={orderId} />
        </div>
      </div>
    </div>
  );
}
