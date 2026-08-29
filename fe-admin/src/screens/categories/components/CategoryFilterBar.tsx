"use client";

import React, { useState, useEffect } from "react";
import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/Input";
import type { CategoryFilterState } from "../constants";

interface CategoryFilterBarProps {
  filters: CategoryFilterState;
  onFilterChange: (updated: Partial<CategoryFilterState>) => void;
  onResetFilter?: () => void;
}

export function CategoryFilterBar({
  filters,
  onFilterChange,
  onResetFilter,
}: CategoryFilterBarProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search);

  // Sync local search state with filters.search when filters change (e.g. reset filter)
  useEffect(() => {
    setSearchTerm(filters.search);
  }, [filters.search]);

  // Debounce search by 1 second (1000ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.search) {
        onFilterChange({ search: searchTerm });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchTerm, filters.search, onFilterChange]);

  const handleClearSearch = () => {
    setSearchTerm("");
    onFilterChange({ search: "" });
  };

  return (
    <div className="bg-surface p-3 rounded-xl border border-border">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Tìm theo tên/mã danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClear={searchTerm ? handleClearSearch : undefined}
              leftIcon={<Search className="w-4 h-4 text-text-muted" />}
              className="h-[38px]"
            />
          </div>
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
