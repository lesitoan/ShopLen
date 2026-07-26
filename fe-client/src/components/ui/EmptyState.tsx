import React from "react";
import { AlertCircle } from "lucide-react";
import Button from "./Button";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  icon = <AlertCircle size={32} />,
  title = "Không có dữ liệu, thử lại sau",
  description,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 border-0 rounded-2xl bg-surface max-w-md mx-auto w-full min-h-[220px] ${className}`}
    >
      <div className="text-text-secondary/40 mb-3 p-3.5 rounded-full bg-background shrink-0">
        {icon}
      </div>

      <h3 className="text-[15.5px] font-bold text-text-primary mb-1">
        {title}
      </h3>

      {description && (
        <p className="text-[12.5px] text-text-secondary mb-4 max-w-xs leading-relaxed">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction} className="mt-2 text-[13px] font-bold">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
