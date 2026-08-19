"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export type LoadingSize = "sm" | "md" | "lg" | "xl" | number;

export interface LoadingProps {
  size?: LoadingSize;
  className?: string;
}

const SIZE_MAP: Record<string, string> = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
};

export function Loading({ size = "md", className = "" }: LoadingProps) {
  const isPresetSize = typeof size === "string" && size in SIZE_MAP;
  const customSizeStyle = typeof size === "number" ? { width: size, height: size } : undefined;
  const sizeClass = isPresetSize ? SIZE_MAP[size] : "";

  return (
    <div className={`flex items-center justify-center p-2 ${className}`}>
      <Loader2
        style={customSizeStyle}
        className={`animate-spin text-primary shrink-0 ${sizeClass}`}
      />
    </div>
  );
}

export { Loading as Spinner, Loading as LoadingSpinner };
