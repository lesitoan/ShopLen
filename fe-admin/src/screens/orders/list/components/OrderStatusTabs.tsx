"use client";

import React from "react";
import { Tabs, TabItem } from "@/components/ui/Tabs";
import { OrderStatusFilter } from "../constants";
import { ORDER_STATUS_MAP } from "@/constants/orders";

interface OrderStatusTabsProps {
  currentTab: OrderStatusFilter;
  onSelectTab: (tab: OrderStatusFilter) => void;
}

export function OrderStatusTabs({
  currentTab,
  onSelectTab,
}: OrderStatusTabsProps) {
  const tabs: TabItem[] = [
    { id: "ALL", label: "Tất cả" },
    {
      id: "PENDING_PAYMENT",
      label: ORDER_STATUS_MAP.PENDING_PAYMENT?.label || "Chờ thanh toán",
    },
    {
      id: "PAID",
      label: ORDER_STATUS_MAP.PAID?.label || "Đã thanh toán",
    },
    {
      id: "PACKING",
      label: ORDER_STATUS_MAP.PACKING?.label || "Đang đóng gói",
    },
    {
      id: "SHIPPING",
      label: ORDER_STATUS_MAP.SHIPPING?.label || "Đang giao hàng",
    },
    {
      id: "COMPLETED",
      label: ORDER_STATUS_MAP.COMPLETED?.label || "Hoàn tất",
    },
    {
      id: "CANCELLATION_REQUESTED",
      label: ORDER_STATUS_MAP.CANCELLATION_REQUESTED?.label || "Yêu cầu hủy",
    },
    {
      id: "CANCELLED",
      label: ORDER_STATUS_MAP.CANCELLED?.label || "Đã hủy",
    },
  ];

  return (
    <Tabs
      tabs={tabs}
      activeTab={currentTab}
      onTabChange={(tabId) => onSelectTab(tabId as OrderStatusFilter)}
    />
  );
}
