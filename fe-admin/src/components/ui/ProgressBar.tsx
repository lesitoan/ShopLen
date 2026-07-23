"use client";

import React from "react";

export interface ProgressBarProps {
  /** Giá trị phần trăm từ 0 đến 100 */
  value: number;
  /** Màu của thanh tiến trình (Hex, RGB, HSL hoặc Tailwind class). Mặc định: "bg-primary" */
  color?: string;
  /** Màu nền track chứa (Tailwind class hoặc Hex). Mặc định: "bg-surface-muted" */
  trackColor?: string;
  /** Độ dày của thanh, ví dụ: "h-1.5", "h-2", "h-2.5", "h-3". Mặc định: "h-2" */
  height?: string;
  /** CSS Class bổ sung cho container ngoài */
  className?: string;
}

export function ProgressBar({
  value,
  color = "bg-primary",
  trackColor = "bg-surface-muted",
  height = "h-2",
  className = "",
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, value));

  const isCustomColor =
    color.startsWith("#") ||
    color.startsWith("rgb") ||
    color.startsWith("hsl") ||
    color.startsWith("var(");

  return (
    <div className={`w-full ${height} rounded-full ${trackColor} overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-300 ${
          !isCustomColor ? color : ""
        }`}
        style={{
          width: `${percentage}%`,
          ...(isCustomColor ? { backgroundColor: color } : {}),
        }}
      />
    </div>
  );
}
