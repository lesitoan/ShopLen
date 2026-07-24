"use client";

import React, { useMemo } from "react";
import { Tabs, TabItem } from "@/components/ui/Tabs";
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
  const counts = useMemo(() => {
    const acc: Record<string, number> = { ALL: orders.length };
    orders.forEach((ord) => {
      acc[ord.status] = (acc[ord.status] || 0) + 1;
    });
    return acc;
  }, [orders]);

  const tabs: TabItem[] = useMemo(
    () => [
      { id: "ALL", label: "Tất cả", count: counts.ALL || 0 },
      {
        id: "PENDING_PAYMENT",
        label: ORDER_STATUS_MAP.PENDING_PAYMENT?.label || "Chờ thanh toán",
        count: counts.PENDING_PAYMENT || 0,
      },
      {
        id: "PAID",
        label: ORDER_STATUS_MAP.PAID?.label || "Đã thanh toán",
        count: counts.PAID || 0,
      },
      {
        id: "PACKING",
        label: ORDER_STATUS_MAP.PACKING?.label || "Đang đóng gói",
        count: counts.PACKING || 0,
      },
      {
        id: "SHIPPING",
        label: ORDER_STATUS_MAP.SHIPPING?.label || "Đang giao hàng",
        count: counts.SHIPPING || 0,
      },
      {
        id: "COMPLETED",
        label: ORDER_STATUS_MAP.COMPLETED?.label || "Hoàn tất",
        count: counts.COMPLETED || 0,
      },
      {
        id: "CANCELLED",
        label: ORDER_STATUS_MAP.CANCELLED?.label || "Đã hủy",
        count: counts.CANCELLED || 0,
      },
    ],
    [counts]
  );

  return (
    <Tabs
      tabs={tabs}
      activeTab={currentTab}
      onTabChange={(tabId) => onSelectTab(tabId as OrderStatusFilter)}
    />
  );
}
