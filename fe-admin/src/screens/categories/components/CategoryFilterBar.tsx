"use client";

import React from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/DropdownMenu";
import { CategoryFilterState, CategoryStatusFilter } from "../constants";

interface CategoryFilterBarProps {
  filters: CategoryFilterState;
  onFilterChange: (updated: Partial<CategoryFilterState>) => void;
}

export function CategoryFilterBar({
  filters,
  onFilterChange,
}: CategoryFilterBarProps) {
  const statusMenuItems: DropdownMenuItem[] = [
    {
      key: "ALL",
      label: "Tất cả trạng thái",
      onClick: () => onFilterChange({ statusFilter: "ALL", page: 1 }),
    },
    {
      key: "ACTIVE",
      label: "Đang bán",
      onClick: () => onFilterChange({ statusFilter: "ACTIVE", page: 1 }),
    },
    {
      key: "HIDDEN",
      label: "Đang ẩn",
      onClick: () => onFilterChange({ statusFilter: "HIDDEN", page: 1 }),
    },
  ];

  const selectedStatusLabel =
    filters.statusFilter === "ACTIVE"
      ? "Đang bán"
      : filters.statusFilter === "HIDDEN"
      ? "Đang ẩn"
      : "Tất cả trạng thái";

  return (
    <div className="bg-surface p-4 rounded-xl border border-border space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="w-full sm:w-72">
            <Input
              placeholder="Tìm theo tên/mã danh mục..."
              value={filters.searchQuery}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value, page: 1 })}
              onClear={() => onFilterChange({ searchQuery: "", page: 1 })}
              leftIcon={<Search className="w-4 h-4 text-text-muted" />}
              className="h-[38px]"
            />
          </div>

          <DropdownMenu
            label={selectedStatusLabel}
            triggerIcon={<Filter className="w-3.5 h-3.5 text-primary" />}
            variant="surface"
            items={statusMenuItems}
            selectedKey={filters.statusFilter}
            width="w-48"
          />
        </div>
      </div>
    </div>
  );
}
