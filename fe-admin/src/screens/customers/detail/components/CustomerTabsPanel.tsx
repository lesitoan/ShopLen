"use client";

import React, { useState } from "react";
import { ShoppingBag, Award } from "lucide-react";
import type { AdminOrderListItem } from "@/types/order.type";
import type { CustomerPointHistoryItem } from "../constants";
import { CustomerOrdersTable } from "./CustomerOrdersTable";
import { CustomerPointsTab } from "./CustomerPointsTab";

interface CustomerTabsPanelProps {
  orders: AdminOrderListItem[];
  pointsHistory?: CustomerPointHistoryItem[];
}

export function CustomerTabsPanel({
  orders,
  pointsHistory = [],
}: CustomerTabsPanelProps) {
  const [activeTab, setActiveTab] = useState<"orders" | "points">("orders");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 bg-surface p-1.5 rounded-xl border border-border">
        <button
          type="button"
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === "orders"
              ? "bg-primary text-bg-deep shadow-md"
              : "text-text-muted hover:text-text-primary hover:bg-surface-hover"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Lịch sử đơn hàng ({orders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("points")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === "points"
              ? "bg-primary text-bg-deep shadow-md"
              : "text-text-muted hover:text-text-primary hover:bg-surface-hover"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Lịch sử tích/tiêu điểm</span>
        </button>
      </div>

      {activeTab === "orders" && <CustomerOrdersTable orders={orders} />}

      {activeTab === "points" && (
        <CustomerPointsTab pointsHistory={pointsHistory} />
      )}
    </div>
  );
}
