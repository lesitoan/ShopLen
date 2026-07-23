"use client";

import React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DateRangePicker, DateRange } from "@/components/ui/DateRangePicker";

interface ReportsHeaderProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  onExport: () => void;
}

export function ReportsHeader({ dateRange, onDateRangeChange, onExport }: ReportsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-text-highlight tracking-tight">
          Báo Cáo &amp; Thống Kê
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Phân tích doanh thu, sản phẩm bán chạy và hiệu suất kinh doanh theo kỳ
        </p>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <DateRangePicker
          value={dateRange}
          onChange={onDateRangeChange}
          align="right"
          size="md"
        />

        <Button
          variant="primary"
          size="md"
          leftIcon={<Download className="w-4 h-4" />}
          onClick={onExport}
        >
          Xuất Excel
        </Button>
      </div>
    </div>
  );
}
