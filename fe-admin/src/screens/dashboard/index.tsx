"use client";

import React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { QuickStatCards } from "./components/QuickStatCards";
import { RevenueChart } from "./components/RevenueChart";
import { RecentOrdersTable } from "./components/RecentOrdersTable";
import { TopSellingProducts } from "./components/TopSellingProducts";
import { LowStockWarning } from "./components/LowStockWarning";
import {
  MOCK_RECENT_ORDERS,
  MOCK_TOP_PRODUCTS,
  MOCK_LOW_STOCK_PRODUCTS,
} from "./constants";

export default function DashboardScreen() {
  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-text-highlight tracking-tight">
              Dashboard Tổng Quan
            </h1>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Chào mừng trở lại! Theo dõi chỉ số kinh doanh Tiệm Len Nhà Kiều hôm nay.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Xuất báo cáo
          </Button>
        </div>
      </div>

      <QuickStatCards />

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
