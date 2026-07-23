"use client";

import React, { useState } from "react";
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
import { MOCK_REVENUE_BY_PERIOD } from "../constants";

type PeriodType = "TODAY" | "LAST_7_DAYS" | "THIS_MONTH" | "THIS_YEAR";

export function RevenueChart() {
  const [period, setPeriod] = useState<PeriodType>("LAST_7_DAYS");
  const data = MOCK_REVENUE_BY_PERIOD[period] || [];

  const periodOptions: { label: string; value: PeriodType }[] = [
    { label: "Hôm nay", value: "TODAY" },
    { label: "7 ngày qua", value: "LAST_7_DAYS" },
    { label: "Tháng này", value: "THIS_MONTH" },
    { label: "Năm nay", value: "THIS_YEAR" },
  ];

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
    return `${val}`;
  };

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
        <div className="h-[280px] w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2C3552" vertical={false} />
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
                formatter={(value: any) => [
                  `${Number(value).toLocaleString("vi-VN")}đ`,
                  "Doanh thu",
                ]}
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
      </CardContent>
    </Card>
  );
}
