"use client";

import React from "react";

export interface EmptyStateProps {
  message?: string;
  className?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  message = "Không có dữ liệu",
  className = "",
  action,
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-8 px-4 ${className}`}
    >
      <p className="text-sm font-medium text-text-muted leading-relaxed">
        {message}
      </p>
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
