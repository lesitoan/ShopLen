import React from "react";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: string;
  style?: React.CSSProperties;
}

export default function Skeleton({
  className = "",
  width,
  height,
  rounded = "rounded-md",
  style,
}: SkeletonProps) {
  const customStyle: React.CSSProperties = {
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
    ...style,
  };

  return (
    <div
      className={`animate-pulse bg-slate-200/80 dark:bg-slate-700/50 ${rounded} ${className}`}
      style={customStyle}
    />
  );
}
