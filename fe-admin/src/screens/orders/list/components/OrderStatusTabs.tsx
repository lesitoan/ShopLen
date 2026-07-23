"use client";

import React from "react";
import { OrderStatusFilter, OrderListItem } from "../constants";
import { ORDER_STATUS_MAP } from "@/constants/orders";

interface OrderStatusTabsProps {
  currentTab: OrderStatusFilter;
  onSelectTab: (tab: OrderStatusFilter) => void;
  orders: OrderListItem[];
}

export function OrderStatusTabs({
  currentTab,
  onSelectTab,
  orders,
}: OrderStatusTabsProps) {
  // Count orders per status
  const counts = React.useMemo(() => {
    const acc: Record<string, number> = { ALL: orders.length };
    orders.forEach((ord) => {
      acc[ord.status] = (acc[ord.status] || 0) + 1;
    });
    return acc;
  }, [orders]);

  const tabs: { key: OrderStatusFilter; label: string }[] = [
    { key: "ALL", label: "Tất cả" },
    { key: "PENDING_PAYMENT", label: ORDER_STATUS_MAP.PENDING_PAYMENT?.label || "Chờ VietQR" },
    { key: "PAID", label: ORDER_STATUS_MAP.PAID?.label || "Đã thanh toán" },
    { key: "PACKING", label: ORDER_STATUS_MAP.PACKING?.label || "Đang đóng gói" },
    { key: "SHIPPING", label: ORDER_STATUS_MAP.SHIPPING?.label || "Đang giao hàng" },
    { key: "COMPLETED", label: ORDER_STATUS_MAP.COMPLETED?.label || "Hoàn tất" },
    { key: "CANCELLED", label: ORDER_STATUS_MAP.CANCELLED?.label || "Đã hủy" },
  ];

  return (
    <div className="border-b border-border">
      <div className="flex items-center gap-1 overflow-x-auto overflow-y-hidden text-xs scrollbar-none">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.key;
          const count = counts[tab.key] || 0;

          return (
            <button
              key={tab.key}
              onClick={() => onSelectTab(tab.key)}
              className={`flex items-center gap-2 px-3 py-2 font-medium rounded-t-lg transition-all shrink-0 border-b-2 ${
                isActive
                  ? "border-primary text-primary bg-surface-hover/80 font-semibold"
                  : "border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-hover/40"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
                  isActive
                    ? "bg-primary/20 text-primary"
                    : "bg-surface-muted text-text-muted"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
