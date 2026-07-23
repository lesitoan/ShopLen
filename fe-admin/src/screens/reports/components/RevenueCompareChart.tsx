"use client";

import React from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { RevenuePoint } from "../constants";

const formatCurrency = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}tr`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
  return `${value}`;
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-surface border border-border rounded-lg p-3 text-xs shadow-2xl shadow-black/60 min-w-[180px]">
      <div className="font-bold text-text-highlight mb-2">{label}</div>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-4 py-0.5">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
            <span className="text-text-secondary">{entry.name}</span>
          </div>
          <span className="font-semibold text-text-primary">
            {entry.name.includes("Đơn") ? `${entry.value} đơn` : `${formatCurrency(entry.value)}đ`}
          </span>
        </div>
      ))}
    </div>
  );
}

interface RevenueCompareChartProps {
  data: RevenuePoint[];
}

export function RevenueCompareChart({ data }: RevenueCompareChartProps) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <div className="mb-4">
        <h2 className="text-sm font-bold text-text-highlight">Doanh thu so sánh kỳ trước</h2>
        <p className="text-[11px] text-text-muted mt-0.5">
          Cột xanh: kỳ hiện tại — cột mờ: kỳ trước — đường: số đơn hàng
        </p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2C3552" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "#64748B", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="revenue"
            tickFormatter={formatCurrency}
            tick={{ fill: "#64748B", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={45}
          />
          <YAxis
            yAxisId="orders"
            orientation="right"
            tick={{ fill: "#64748B", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={30}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: "11px", color: "#94A3B8", paddingTop: "12px" }}
          />
          <Bar
            yAxisId="revenue"
            dataKey="previous"
            name="Kỳ trước"
            fill="#2C3552"
            radius={[3, 3, 0, 0]}
            barSize={12}
          />
          <Bar
            yAxisId="revenue"
            dataKey="current"
            name="Kỳ này"
            fill="#10B981"
            radius={[3, 3, 0, 0]}
            barSize={12}
          />
          <Line
            yAxisId="orders"
            type="monotone"
            dataKey="orders"
            name="Số đơn"
            stroke="#FBBF24"
            strokeWidth={2}
            dot={{ fill: "#FBBF24", r: 3 }}
            activeDot={{ r: 5 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
