"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Check, ChevronRight, Ban } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ORDER_STATUS_MAP, OrderStatus } from "@/constants/orders";
import { OrderDetail } from "../constants";

interface OrderHeaderBannerProps {
  order: OrderDetail;
  onStatusChange: (nextStatus: OrderStatus) => void;
  onOpenCancelModal: () => void;
}

export function OrderHeaderBanner({
  order,
  onStatusChange,
  onOpenCancelModal,
}: OrderHeaderBannerProps) {
  const [copied, setCopied] = useState(false);

  const statusConfig = ORDER_STATUS_MAP[order.status] || {
    label: order.status,
    variant: "neutral" as const,
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(order.orderCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    switch (current) {
      case "PENDING_PAYMENT":
        return "PAID";
      case "PAID":
        return "PACKING";
      case "PACKING":
        return "SHIPPING";
      case "SHIPPING":
        return "COMPLETED";
      default:
        return null;
    }
  };

  const nextStatus = getNextStatus(order.status);
  const nextStatusConfig = nextStatus ? ORDER_STATUS_MAP[nextStatus] : null;

  return (
    <div className="bg-surface p-4 rounded-xl border border-border space-y-3">
      <div className="flex items-center justify-between">
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-primary transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Danh sách Đơn hàng</span>
        </Link>

        <div className="flex items-center gap-2">
          {order.status !== "CANCELLED" && order.status !== "COMPLETED" && (
            <button
              onClick={onOpenCancelModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-status-danger bg-status-danger/10 hover:bg-status-danger/20 rounded-lg transition-colors border border-status-danger/20"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Hủy đơn hàng</span>
            </button>
          )}

          {nextStatusConfig && (
            <button
              onClick={() => nextStatus && onStatusChange(nextStatus)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-bg-deep bg-primary hover:bg-primary-hover rounded-lg transition-all shadow-md shadow-primary/20"
            >
              <span>Chuyển trạng thái: {nextStatusConfig.label}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-border/60">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-extrabold text-text-highlight flex items-center gap-2">
            <span>{order.orderCode}</span>
            <button
              onClick={handleCopyCode}
              title="Sao chép mã đơn"
              className="p-1 text-text-muted hover:text-text-primary transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-status-success" /> : <Copy className="w-4 h-4" />}
            </button>
          </h1>

          <Badge variant={statusConfig.variant} dot>
            {statusConfig.label}
          </Badge>
        </div>

        <div className="text-xs text-text-muted font-medium">
          Thời gian đặt: <span className="text-text-primary font-semibold">{order.createdAt}</span>
        </div>
      </div>
    </div>
  );
}
