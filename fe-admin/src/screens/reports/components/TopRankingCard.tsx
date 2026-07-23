"use client";

import React, { useRef, useMemo } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";

export interface RankedBarItem {
  id: string;
  title: string;
  subtitle?: string;
  metricValue: number;
  primaryLabel: string;
  secondaryLabel?: string;
  color?: string;
}

interface TopRankingCardProps {
  title: string;
  description: string;
  items: RankedBarItem[];
  showBadge?: boolean;
}

export function TopRankingCard({
  title,
  description,
  items,
  showBadge = false,
}: TopRankingCardProps) {
  const listRef = useRef<HTMLDivElement>(null);

  // Sắp xếp các mục từ cao xuống thấp theo metricValue
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => b.metricValue - a.metricValue);
  }, [items]);

  // Giá trị cao nhất làm mốc 100%
  const maxMetricValue = useMemo(() => {
    return sortedItems[0]?.metricValue || 1;
  }, [sortedItems]);

  const handleScrollUp = () => {
    if (listRef.current) {
      listRef.current.scrollBy({ top: -120, behavior: "smooth" });
    }
  };

  const handleScrollDown = () => {
    if (listRef.current) {
      listRef.current.scrollBy({ top: 120, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold text-text-highlight">{title}</h2>
          <p className="text-[11px] text-text-muted mt-0.5">{description}</p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleScrollUp}
            className="p-1 rounded-md bg-surface-muted hover:bg-surface-hover text-text-secondary hover:text-text-primary transition-colors border border-border/60"
            title="Cuộn lên"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleScrollDown}
            className="p-1 rounded-md bg-surface-muted hover:bg-surface-hover text-text-secondary hover:text-text-primary transition-colors border border-border/60"
            title="Cuộn xuống"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div
        ref={listRef}
        className="max-h-[280px] overflow-y-auto [::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col gap-3"
      >
        {sortedItems.map((item, index) => {
          const itemPercentage = (item.metricValue / maxMetricValue) * 100;

          return (
            <div key={item.id} className="flex items-center gap-3">
              {showBadge && (
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    index === 0
                      ? "bg-status-warning/20 text-status-warning"
                      : index === 1
                      ? "bg-text-secondary/20 text-text-secondary"
                      : index === 2
                      ? "bg-status-danger/20 text-status-danger"
                      : "bg-surface-muted text-text-muted"
                  }`}
                >
                  {index + 1}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div
                  className="text-xs font-semibold text-text-primary truncate"
                  title={item.title}
                >
                  {item.title}
                </div>
                {item.subtitle && (
                  <div className="text-[10px] text-text-muted">{item.subtitle}</div>
                )}
                <ProgressBar
                  value={itemPercentage}
                  color={item.color || "bg-primary"}
                  height="h-1.5"
                  className="mt-1.5"
                />
              </div>

              <div className="text-right shrink-0">
                <div className="text-xs font-bold text-text-highlight">
                  {item.primaryLabel}
                </div>
                {item.secondaryLabel && (
                  <div className="text-[10px] text-text-muted">{item.secondaryLabel}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
