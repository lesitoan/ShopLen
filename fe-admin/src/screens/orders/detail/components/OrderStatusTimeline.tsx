"use client";

import React from "react";
import { CheckCircle2, Clock, Bot, User, ShieldCheck, ShoppingBag } from "lucide-react";
import { OrderTimelineItem } from "../constants";

interface OrderStatusTimelineProps {
  timeline: OrderTimelineItem[];
}

export function OrderStatusTimeline({ timeline }: OrderStatusTimelineProps) {
  const getActorBadge = (actor: OrderTimelineItem["actor"]) => {
    switch (actor) {
      case "BOT":
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-status-info/10 text-status-info border border-status-info/20">Tự động</span>;
      case "ADMIN":
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-primary/10 text-primary border border-primary/20">Admin</span>;
      case "CUSTOMER":
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-surface-muted text-text-muted border border-border">Khách hàng</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-surface-muted text-text-muted">Hệ thống</span>;
    }
  };

  return (
    <div className="bg-surface rounded-xl border border-border p-4 space-y-4">
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <Clock className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-bold text-text-highlight">
          Lịch sử & Tiến trình Đơn hàng
        </h2>
      </div>

      <div className="relative pl-4 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60">
        {timeline.map((step) => (
          <div key={step.id} className="relative flex items-start gap-3 group">
            <div className="absolute -left-4 top-0.5 flex items-center justify-center">
              {step.isDone ? (
                <div className="w-4 h-4 rounded-full bg-status-success text-bg-deep flex items-center justify-center shadow-sm shadow-status-success/30">
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              ) : step.isCurrent ? (
                <div className="relative w-4 h-4 rounded-full bg-primary flex items-center justify-center animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-bg-deep" />
                </div>
              ) : (
                <div className="w-4 h-4 rounded-full bg-surface-muted border-2 border-border" />
              )}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${step.isDone ? "text-text-highlight" : step.isCurrent ? "text-primary" : "text-text-muted"}`}>
                    {step.title}
                  </span>
                  {getActorBadge(step.actor)}
                </div>

                <span className="text-[11px] text-text-muted font-medium">
                  {step.timestamp}
                </span>
              </div>

              <p className="text-xs text-text-secondary">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
