"use client";

import React, { useState } from "react";
import { RotateCw, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { QuickStatCards } from "./components/QuickStatCards";
import { RevenueChart } from "./components/RevenueChart";
import { RecentOrdersTable } from "./components/RecentOrdersTable";
import { TopSellingProducts } from "./components/TopSellingProducts";
import { LowStockWarning } from "./components/LowStockWarning";
import {
  MOCK_STAT_CARDS,
  MOCK_RECENT_ORDERS,
  MOCK_TOP_PRODUCTS,
  MOCK_LOW_STOCK_PRODUCTS,
} from "./constants";

export default function DashboardScreen() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-text-highlight tracking-tight">
              Dashboard Tổng Quan
            </h1>
            <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Realtime Live
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Chào mừng trở lại! Theo dõi chỉ số kinh doanh Tiệm Len Nhà Kiều hôm nay.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRefresh}
            leftIcon={<RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />}
          >
            Làm mới
          </Button>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Xuất báo cáo
          </Button>
        </div>
      </div>

      <QuickStatCards stats={MOCK_STAT_CARDS} />

      <RevenueChart />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 xl:col-span-8">
          <RecentOrdersTable orders={MOCK_RECENT_ORDERS} />
        </div>

        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          <TopSellingProducts products={MOCK_TOP_PRODUCTS} />
          <LowStockWarning products={MOCK_LOW_STOCK_PRODUCTS} />
        </div>
      </div>
    </div>
  );
}
