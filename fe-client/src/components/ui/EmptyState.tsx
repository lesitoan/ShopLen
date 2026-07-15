import React from "react";
import Button from "./Button";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 border border-dashed border-border rounded-2xl bg-white max-w-md mx-auto ${className}`}>
      {/* Icon Wrapper */}
      <div className="text-text-secondary/40 mb-4 p-4 rounded-full bg-background shrink-0">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-[18px] font-semibold text-text-primary mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-[13px] text-text-secondary mb-6 max-w-xs leading-relaxed">
        {description}
      </p>

      {/* CTA Button */}
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
