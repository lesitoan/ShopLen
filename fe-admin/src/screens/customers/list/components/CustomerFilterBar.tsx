"use client";

import React, { useState, useEffect, useMemo } from "react";
import debounce from "debounce";
import { Search, Filter, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/DropdownMenu";
import type { CustomerFilterState } from "../constants";

interface CustomerFilterBarProps {
  filters: CustomerFilterState;
  onFilterChange: (updated: Partial<CustomerFilterState>) => void;
  onResetFilter?: () => void;
}

export function CustomerFilterBar({
  filters,
  onFilterChange,
  onResetFilter,
}: CustomerFilterBarProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search);

  useEffect(() => {
    setSearchTerm(filters.search);
  }, [filters.search]);

  const debouncedSearch = useMemo(
    () => debounce((val: string) => onFilterChange({ search: val }), 500),
    [onFilterChange]
  );

  const statusMenuItems: DropdownMenuItem[] = [
    {
      key: "ALL",
      label: "Tất cả trạng thái",
      onClick: () => onFilterChange({ status: "ALL" }),
    },
    {
      key: "ACTIVE",
      label: "Hoạt động",
      onClick: () => onFilterChange({ status: "ACTIVE" }),
    },
    {
      key: "LOCKED",
      label: "Tạm khóa",
      onClick: () => onFilterChange({ status: "LOCKED" }),
    },
  ];

  const selectedStatusLabel =
    filters.status === "ACTIVE"
      ? "Hoạt động"
      : filters.status === "LOCKED"
      ? "Tạm khóa"
      : "Tất cả trạng thái";

  return (
    <div className="bg-surface p-4 rounded-xl border border-border space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Tìm theo tên, email, sđt..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                debouncedSearch(e.target.value);
              }}
              onClear={() => {
                setSearchTerm("");
                onFilterChange({ search: "" });
              }}
              leftIcon={<Search className="w-4 h-4 text-text-muted" />}
              className="h-[38px]"
            />
          </div>

          <DropdownMenu
            label={selectedStatusLabel}
            triggerIcon={<Filter className="w-3.5 h-3.5 text-primary" />}
            variant="surface"
            items={statusMenuItems}
            selectedKey={filters.status}
            width="w-48"
          />
        </div>

        {onResetFilter && (
          <button
            type="button"
            onClick={onResetFilter}
            className="h-[38px] px-3 rounded-md bg-surface-muted hover:bg-surface-hover text-text-secondary hover:text-text-primary border border-border transition-colors flex items-center gap-1.5 text-xs font-medium shrink-0 ml-auto cursor-pointer"
            title="Đặt lại bộ lọc"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại</span>
          </button>
        )}
      </div>
    </div>
  );
}
