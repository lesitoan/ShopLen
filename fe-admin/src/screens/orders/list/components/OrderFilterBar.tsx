"use client";

import React from "react";
import { Search, ArrowUpDown, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { DateRangePicker, DateRange } from "@/components/ui/DateRangePicker";

export type OrderSortOption = "NEWEST" | "OLDEST" | "PRICE_DESC" | "PRICE_ASC";

interface OrderFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  sortBy: OrderSortOption;
  onSortByChange: (sort: OrderSortOption) => void;
  onResetFilter?: () => void;
}

export function OrderFilterBar({
  searchQuery,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  sortBy,
  onSortByChange,
  onResetFilter,
}: OrderFilterBarProps) {
  const sortOptions: { key: OrderSortOption; label: string }[] = [
    { key: "NEWEST", label: "Mới nhất xếp trước" },
    { key: "OLDEST", label: "Cũ nhất xếp trước" },
    { key: "PRICE_DESC", label: "Giá trị cao nhất" },
    { key: "PRICE_ASC", label: "Giá trị thấp nhất" },
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
        value={dateRange}
        placeholder="Chọn khoảng ngày..."
        onChange={onDateRangeChange}
      />

      <DropdownMenu
        variant="surface"
        triggerIcon={<ArrowUpDown className="w-3.5 h-3.5 text-primary" />}
        label={selectedSortLabel}
        selectedKey={sortBy}
        onSelect={(key) => onSortByChange(key as OrderSortOption)}
        width="w-48"
        items={sortOptions}
      />

      {onResetFilter && (
        <button
          type="button"
          onClick={onResetFilter}
          className="h-[38px] px-3 rounded-md bg-surface-muted hover:bg-surface-hover text-text-secondary hover:text-text-primary border border-border transition-colors flex items-center gap-1.5 text-xs font-medium ml-auto"
          title="Đặt lại bộ lọc"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đặt lại</span>
        </button>
      )}
    </div>
  );
}
