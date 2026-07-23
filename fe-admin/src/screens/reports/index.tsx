"use client";

import React, { useState } from "react";
import { DateRange } from "@/components/ui/DateRangePicker";
import {
  MOCK_SUMMARY_CARDS,
  MOCK_REVENUE_DATA,
  MOCK_TOP_PRODUCTS,
  MOCK_TOP_CATEGORIES,
  MOCK_ORDER_STATUS,
} from "./constants";
import { ReportsHeader } from "./components/ReportsHeader";
import { AnalyticsSummaryCards } from "./components/AnalyticsSummaryCards";
import { RevenueCompareChart } from "./components/RevenueCompareChart";
import { TopRankingCard } from "./components/TopRankingCard";
import { OrderStatusDonut } from "./components/OrderStatusDonut";

const formatCurrency = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}tr`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
  return `${value}`;
};

const getDefaultDateRange = (): DateRange => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 29);
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return { startDate: fmt(start), endDate: fmt(end) };
};

export function ReportsScreen() {
  const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange);

  const revenueData = MOCK_REVENUE_DATA["LAST_30_DAYS"];
  const totalOrders = MOCK_ORDER_STATUS.reduce((acc, s) => acc + s.count, 0);

  const handleExport = () => {
    alert("Tính năng xuất Excel sẽ được tích hợp khi kết nối API thật.");
  };

  return (
    <div className="space-y-4">
      <ReportsHeader
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onExport={handleExport}
      />

      <AnalyticsSummaryCards cards={MOCK_SUMMARY_CARDS} />

      <RevenueCompareChart data={revenueData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TopRankingCard
          title="Top sản phẩm bán chạy"
          description="Theo số lượng đã bán trong kỳ"
          showBadge
          items={MOCK_TOP_PRODUCTS.map((p) => ({
            id: p.id,
            title: p.name,
            subtitle: p.category,
            metricValue: p.soldCount,
            primaryLabel: `${p.soldCount}`,
            secondaryLabel: `${formatCurrency(p.revenue)}đ`,
          }))}
        />

        <TopRankingCard
          title="Doanh thu theo danh mục"
          description="Phân bổ doanh thu theo nhóm sản phẩm"
          items={MOCK_TOP_CATEGORIES.map((c) => ({
            id: c.id,
            title: c.name,
            metricValue: c.revenue,
            primaryLabel: `${formatCurrency(c.revenue)}đ`,
            secondaryLabel: `${c.percentage}%`,
            color: c.color,
          }))}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <OrderStatusDonut data={MOCK_ORDER_STATUS} total={totalOrders} />
      </div>
    </div>
  );
}
