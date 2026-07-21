import React from "react";

export interface LoadingDotsProps {
  /**
   * Kích thước của loading dots.
   * Có thể là preset: "xs" (4px), "sm" (6px), "md" (8px), "lg" (10px) hoặc số px cụ thể.
   */
  size?: "xs" | "sm" | "md" | "lg" | number;
  /**
   * Class màu Tailwind cho chấm tròn, mặc định là "bg-current" (ăn theo màu chữ cha).
   * Ví dụ: "bg-white", "bg-primary", "bg-text-secondary".
   */
  color?: string;
  className?: string;
}

export default function LoadingDots({
  size = "md",
  color = "bg-current",
  className = "",
}: LoadingDotsProps) {
  let dotSize = 8;
  let gapSize = 6;

  if (typeof size === "number") {
    dotSize = size;
    gapSize = Math.max(3, Math.round(size * 0.75));
  } else {
    switch (size) {
      case "xs":
        dotSize = 4;
        gapSize = 3;
        break;
      case "sm":
        dotSize = 6;
        gapSize = 4;
        break;
      case "md":
        dotSize = 8;
        gapSize = 6;
        break;
      case "lg":
        dotSize = 10;
        gapSize = 8;
        break;
    }
  }

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ gap: `${gapSize}px` }}
      aria-label="Đang tải..."
    >
      {[0, 1, 2].map((idx) => (
        <span
          key={idx}
          className={`rounded-full ${color} animate-pulse-dot inline-block`}
          style={{
            width: `${dotSize}px`,
            height: `${dotSize}px`,
            animationDelay: `${idx * 0.16}s`,
          }}
        />
      ))}
    </span>
  );
}
