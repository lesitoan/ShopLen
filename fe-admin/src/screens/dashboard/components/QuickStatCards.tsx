"use client";

import React from "react";
import { DollarSign, ShoppingBag, QrCode, Users, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { StatCardItem } from "../constants";

interface QuickStatCardsProps {
  stats: StatCardItem[];
}

export function QuickStatCards({ stats }: QuickStatCardsProps) {
  const getCardStyle = (type: StatCardItem["type"]) => {
    switch (type) {
      case "REVENUE":
        return {
          icon: DollarSign,
          boxClass: "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30",
          cardClass: "bg-gradient-to-br from-surface via-surface to-emerald-950/25 border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-300",
        };
      case "NEW_ORDERS":
        return {
          icon: ShoppingBag,
          boxClass: "bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg shadow-blue-500/30",
          cardClass: "bg-gradient-to-br from-surface via-surface to-blue-950/25 border-blue-500/30 hover:border-blue-500/50 transition-all duration-300",
        };
      case "PENDING_PAYMENT":
        return {
          icon: QrCode,
          boxClass: "bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-500/30",
          cardClass: "bg-gradient-to-br from-surface via-surface to-amber-950/25 border-amber-500/30 hover:border-amber-500/50 transition-all duration-300",
        };
      case "NEW_CUSTOMERS":
        return {
          icon: Users,
          boxClass: "bg-gradient-to-br from-purple-400 to-purple-600 text-white shadow-lg shadow-purple-500/30",
          cardClass: "bg-gradient-to-br from-surface via-surface to-purple-950/25 border-purple-500/30 hover:border-purple-500/50 transition-all duration-300",
        };
      default:
        return {
          icon: DollarSign,
          boxClass: "bg-gradient-to-br from-primary to-emerald-600 text-white shadow-lg shadow-primary/30",
          cardClass: "bg-gradient-to-br from-surface via-surface to-emerald-950/25 border-border transition-all duration-300",
        };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((item) => {
        const { icon: Icon, boxClass, cardClass } = getCardStyle(item.type);
        const TrendingIcon = item.isPositive ? TrendingUp : TrendingDown;

        return (
          <Card key={item.id} className={`relative overflow-hidden ${cardClass}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-text-secondary mb-1">{item.title}</p>
                <h3 className="text-2xl font-bold text-text-highlight tracking-tight">
                  {item.value}
                </h3>
              </div>
              <div className={`p-2.5 rounded-md ${boxClass}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold">
              <span
                className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] ${
                  item.isPositive
                    ? "bg-status-success/15 text-status-success"
                    : "bg-status-danger/15 text-status-danger"
                }`}
              >
                <TrendingIcon className="w-3 h-3" />
                {item.change}
              </span>
              <span className="text-text-muted text-[11px]">so với hôm qua</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
