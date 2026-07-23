"use client";

import React from "react";
import { Search, RefreshCw, Download, ArrowUpDown } from "lucide-react";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { DateRangeFilter, SortOption } from "../constants";

interface OrderFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  dateFilter: DateRangeFilter;
  onDateFilterChange: (filter: DateRangeFilter) => void;
  sortBy: SortOption;
  onSortByChange: (sort: SortOption) => void;
  onResetFilter: () => void;
  totalFilteredCount: number;
}

export function OrderFilterBar({
  searchQuery,
  onSearchChange,
  dateFilter,
  onDateFilterChange,
  sortBy,
  onSortByChange,
  onResetFilter,
  totalFilteredCount,
}: OrderFilterBarProps) {
  const sortOptions: { key: SortOption; label: string }[] = [
    { key: "NEWEST", label: "Mới nhất xếp trước" },
    { key: "OLDEST", label: "Cũ nhất xếp trước" },
    { key: "TOTAL_HIGH", label: "Tổng tiền cao nhất" },
    { key: "TOTAL_LOW", label: "Tổng tiền thấp nhất" },
  ];

  const selectedSortLabel =
    sortOptions.find((opt) => opt.key === sortBy)?.label || "Mới nhất xếp trước";

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface p-3 rounded-lg border border-border">
      <div className="relative flex-1 min-w-[240px]">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm mã đơn (TLK-...), tên khách, SĐT..."
          className="w-full bg-surface-muted text-text-primary text-xs pl-9 pr-3 py-2 rounded-md border border-border focus:outline-none focus:border-primary placeholder:text-text-muted transition-colors"
        />
      </div>

      <div className="flex items-center flex-wrap gap-2">
        <DateRangePicker
          placeholder="Chọn khoảng ngày..."
          onChange={(range) => {
            if (!range.startDate && !range.endDate) {
              onDateFilterChange("ALL");
            }
          }}
        />

        <DropdownMenu
          variant="surface"
          triggerIcon={<ArrowUpDown className="w-3.5 h-3.5 text-text-muted" />}
          label={selectedSortLabel}
          selectedKey={sortBy}
          onSelect={(key) => onSortByChange(key as SortOption)}
          width="w-48"
          items={sortOptions}
        />

        <button
          onClick={onResetFilter}
          title="Làm mới bộ lọc"
          className="p-2 rounded-md bg-surface-muted hover:bg-surface-hover text-text-secondary hover:text-text-primary border border-border transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => alert(`Xuất file danh sách ${totalFilteredCount} đơn hàng thành công!`)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-primary hover:bg-primary-hover text-white rounded-md transition-colors shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Xuất Excel</span>
        </button>
      </div>
    </div>
  );
}
