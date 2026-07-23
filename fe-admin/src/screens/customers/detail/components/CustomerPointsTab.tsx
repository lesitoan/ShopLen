"use client";

import React from "react";
import { Clock } from "lucide-react";
import { CustomerPointHistoryItem } from "../constants";

interface CustomerPointsTabProps {
  pointsHistory: CustomerPointHistoryItem[];
}

export function CustomerPointsTab({ pointsHistory }: CustomerPointsTabProps) {
  return (
    <div className="bg-surface rounded-xl border border-border p-5 space-y-4">
      <div className="space-y-3">
        {pointsHistory.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3.5 rounded-lg bg-surface-muted/40 border border-border/60"
          >
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-text-primary" title={item.reason}>
                {item.reason}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-text-muted">
                <Clock className="w-3 h-3" />
                <span>{item.date}</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-bold text-primary">
                {item.change > 0 ? `+${item.change}` : item.change} điểm
              </div>
              <div className="text-[10px] text-text-muted">
                Dư: {item.balanceAfter} điểm
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
