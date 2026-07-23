"use client";

import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { OrderStatusStat } from "../constants";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: OrderStatusStat }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const item = payload[0].payload;
  return (
    <div className="bg-surface border border-border rounded-lg p-3 text-xs shadow-2xl shadow-black/60">
      <div className="font-bold text-text-highlight mb-1">{item.label}</div>
      <div className="text-text-secondary">
        <span className="font-semibold text-text-primary">{item.count}</span> đơn
        {" — "}
        <span className="font-semibold text-text-primary">{item.percentage}%</span>
      </div>
    </div>
  );
}

interface OrderStatusDonutProps {
  data: OrderStatusStat[];
  total: number;
}

export function OrderStatusDonut({ data, total }: OrderStatusDonutProps) {
  const [hoveredItem, setHoveredItem] = useState<OrderStatusStat | null>(null);

  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <div className="mb-4">
        <h2 className="text-sm font-bold text-text-highlight">Phân bổ trạng thái đơn hàng</h2>
        <p className="text-[11px] text-text-muted mt-0.5">Tổng {total} đơn trong kỳ</p>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="relative w-full max-w-[200px] shrink-0">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="count"
                onMouseEnter={(_, index) => setHoveredItem(data[index])}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.status}
                    fill={entry.color}
                    stroke={hoveredItem?.status === entry.status ? "#F8FAFC" : "transparent"}
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} offset={35} wrapperStyle={{ zIndex: 50 }} />
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-2">
            {hoveredItem ? (
              <>
                <div className="text-lg font-bold" style={{ color: hoveredItem.color }}>
                  {hoveredItem.count} đơn
                </div>
                <div className="text-[10px] text-text-secondary font-medium">
                  {hoveredItem.label} ({hoveredItem.percentage}%)
                </div>
              </>
            ) : (
              <>
                <div className="text-xl font-bold text-text-highlight">{total}</div>
                <div className="text-[10px] text-text-muted">tổng đơn</div>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full">
          {data.map((item) => (
            <div
              key={item.status}
              onMouseEnter={() => setHoveredItem(item)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`flex items-center justify-between gap-3 p-1 rounded-md transition-colors ${
                hoveredItem?.status === item.status ? "bg-surface-hover" : ""
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-text-secondary truncate">{item.label}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <ProgressBar
                  value={item.percentage}
                  color={item.color}
                  height="h-2"
                  className="w-20"
                />
                <span className="text-xs font-semibold text-text-primary w-10 text-right">
                  {item.percentage}%
                </span>
                <span className="text-xs text-text-muted w-12 text-right">{item.count} đơn</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
