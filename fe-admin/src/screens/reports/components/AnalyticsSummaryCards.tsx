"use client";

import React from "react";
import { TrendingUp, TrendingDown, BarChart2, ShoppingCart, CreditCard, XCircle } from "lucide-react";
import { SummaryCard } from "../constants";

const CARD_ICONS: Record<string, { icon: React.ReactNode; bg: string; text: string }> = {
  card_revenue: {
    icon: <CreditCard className="w-5 h-5" />,
    bg: "bg-primary/10",
    text: "text-primary",
  },
  card_orders: {
    icon: <ShoppingCart className="w-5 h-5" />,
    bg: "bg-status-info/10",
    text: "text-status-info",
  },
  card_avg_order: {
    icon: <BarChart2 className="w-5 h-5" />,
    bg: "bg-status-warning/10",
    text: "text-status-warning",
  },
  card_cancel_rate: {
    icon: <XCircle className="w-5 h-5" />,
    bg: "bg-status-danger/10",
    text: "text-status-danger",
  },
};

interface AnalyticsSummaryCardsProps {
  cards: SummaryCard[];
}

export function AnalyticsSummaryCards({ cards }: AnalyticsSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const meta = CARD_ICONS[card.id];
        return (
          <div
            key={card.id}
            className="bg-surface border border-border rounded-xl p-4 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-text-secondary">{card.title}</span>
              <div className={`p-2 rounded-lg ${meta.bg} ${meta.text}`}>{meta.icon}</div>
            </div>

            <div>
              <div className="text-xl font-bold text-text-highlight tracking-tight">
                {card.value}
              </div>
              <div
                className={`flex items-center gap-1 mt-1 text-[11px] font-semibold ${
                  card.isPositive ? "text-status-success" : "text-status-danger"
                }`}
              >
                {card.isPositive ? (
                  <TrendingUp className="w-3 h-3 shrink-0" />
                ) : (
                  <TrendingDown className="w-3 h-3 shrink-0" />
                )}
                <span>{card.change}</span>
                <span className="text-text-muted font-normal">so với kỳ trước</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
