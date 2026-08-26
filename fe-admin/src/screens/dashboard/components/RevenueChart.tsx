"use client";

import React, { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Loading } from "@/components/ui/Loading";
import { useGetDashboardRevenueQuery } from "@/services/api/analyticsApi";

type PeriodType = "TODAY" | "LAST_7_DAYS" | "THIS_MONTH";

function formatDateString(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDateRange(period: PeriodType): { startDate: string; endDate: string } {
  const now = new Date();
  const endDate = formatDateString(now);

  if (period === "TODAY") {
    return { startDate: endDate, endDate };
  }

  if (period === "LAST_7_DAYS") {
    const start = new Date(now);
    start.setDate(start.getDate() - 6);
    return { startDate: formatDateString(start), endDate };
  }

  // THIS_MONTH
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  return { startDate: formatDateString(start), endDate };
}

export function RevenueChart() {
  const [period, setPeriod] = useState<PeriodType>("LAST_7_DAYS");

  const { startDate, endDate } = useMemo(() => getDateRange(period), [period]);

  const {
    data: revenueData,
    isLoading,
    isFetching,
    isError,
  } = useGetDashboardRevenueQuery({
    startDate,
    endDate,
  });

  const periodOptions: { label: string; value: PeriodType }[] = [
    { label: "Hôm nay", value: "TODAY" },
    { label: "7 ngày qua", value: "LAST_7_DAYS" },
    { label: "Tháng này", value: "THIS_MONTH" },
  ];

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
    return `${val}`;
  };

  const chartData = revenueData?.points || [];

  return (
    <Card>
      <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <CardTitle>Doanh thu & Số lượng đơn</CardTitle>
          <p className="text-xs text-text-secondary mt-0.5">
            Thống kê tăng trưởng kinh doanh theo thời gian
          </p>
        </div>

        <div className="flex items-center bg-bg-deep p-1 rounded-md border border-border-subtle">
          {periodOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPeriod(opt.value)}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                period === opt.value
                  ? "bg-primary text-bg-deep shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        {isLoading || isFetching ? (
          <div className="h-[280px] w-full flex items-center justify-center">
            <Loading size="md" />
          </div>
        ) : isError ? (
          <div className="h-[280px] w-full flex items-center justify-center">
            <EmptyState message="Không thể tải dữ liệu biểu đồ doanh thu" />
          </div>
        ) : (
          <div className="h-[280px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#2C3552"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={formatCurrency}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2438",
                    borderColor: "#2C3552",
                    borderRadius: "6px",
                    color: "#E2E8F0",
                    fontSize: "12px",
                  }}
                  formatter={(value: any, name: any) => {
                    if (name === "revenue")
                      return [
                        `${Number(value).toLocaleString("vi-VN")}đ`,
                        "Doanh thu",
                      ];
                    if (name === "orders") return [`${value} đơn`, "Số đơn"];
                    return [value, name];
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

