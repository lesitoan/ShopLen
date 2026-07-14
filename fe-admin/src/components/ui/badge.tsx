import React from "react";

type BadgeVariant =
  | "new"
  | "bestSeller"
  | "hotTiktok"
  | "sale"
  | "limited"
  | "soldOut"
  | "pending"
  | "paid"
  | "processing"
  | "shipping"
  | "completed"
  | "cancelled";

interface BadgeProps {
  variant?: BadgeVariant;
  children?: React.ReactNode;
  className?: string;
}

export default function Badge({ variant, children, className = "" }: BadgeProps) {
  const badgeStyles: Record<BadgeVariant, string> = {
    new: "bg-success/10 text-success border border-success/20",
    bestSeller: "bg-[#D81B60]/10 text-[#D81B60] border border-[#D81B60]/20 font-semibold",
    hotTiktok: "bg-orange-500/10 text-orange-600 border border-orange-500/20 flex items-center gap-1",
    sale: "bg-primary/20 text-secondary border border-primary/40",
    limited: "bg-purple-600/10 text-purple-700 border border-purple-600/20",
    soldOut: "bg-text-secondary/15 text-text-secondary border border-text-secondary/20",

    pending: "bg-warning/15 text-warning border border-warning/30",
    paid: "bg-info/15 text-info border border-info/30",
    processing: "bg-purple-500/15 text-purple-600 border border-purple-500/30",
    shipping: "bg-primary/20 text-secondary border border-primary/30",
    completed: "bg-success/15 text-success border border-success/30",
    cancelled: "bg-error/15 text-error border border-error/30",
  };

  const styleClasses = variant ? badgeStyles[variant] : "bg-background border border-border text-text-primary";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium rounded-sm select-none ${styleClasses} ${className}`}
    >
      {variant === "hotTiktok" && <span>🔥</span>}
      {children}
    </span>
  );
}
