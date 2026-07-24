"use client";

import React from "react";
import { Search, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/Input";
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
  onResetFilter?: () => void;
  totalFilteredCount?: number;
}

export function OrderFilterBar({
  searchQuery,
  onSearchChange,
  dateFilter,
  onDateFilterChange,
  sortBy,
  onSortByChange,
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
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start flex-wrap gap-3 bg-surface p-3 rounded-lg border border-border">
      <div className="w-full sm:w-72 sm:max-w-xs">
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm mã đơn, tên khách, SĐT..."
          leftIcon={<Search className="w-4 h-4" />}
          onClear={searchQuery ? () => onSearchChange("") : undefined}
        />
      </div>

      <DateRangePicker
        // placeholder="Chọn khoảng ngày..."
        onChange={(range) => {
          if (!range.startDate && !range.endDate) {
            onDateFilterChange("ALL");
          }
        }}
      />

      <DropdownMenu
        variant="surface"
        triggerIcon={<ArrowUpDown className="w-3.5 h-3.5 text-primary" />}
        label={selectedSortLabel}
        selectedKey={sortBy}
        onSelect={(key) => onSortByChange(key as SortOption)}
        width="w-48"
        items={sortOptions}
      />
    </div>
  );
}
