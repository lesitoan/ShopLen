"use client";

import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "info" | "neutral" | "primary";
  size?: "sm" | "md";
  dot?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = "neutral",
  size = "md",
  dot = false,
  className = "",
}: BadgeProps) {
  const variantStyles = {
    success:
      "bg-status-success/20 text-status-success border-status-success/30 font-semibold",
    warning:
      "bg-status-warning/20 text-status-warning border-status-warning/30 font-semibold",
    danger:
      "bg-status-danger/20 text-status-danger border-status-danger/30 font-semibold",
    info:
      "bg-status-info/20 text-status-info border-status-info/30 font-semibold",
    primary:
      "bg-primary/20 text-primary border-primary/30 font-semibold",
    neutral:
      "bg-surface-hover text-text-secondary border-border-light font-medium",
  };

  const dotColors = {
    success: "bg-status-success",
    warning: "bg-status-warning",
    danger: "bg-status-danger",
    info: "bg-status-info",
    primary: "bg-primary",
    neutral: "bg-text-muted",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant]}`}
        />
      )}
      {children}
    </span>
  );
}
