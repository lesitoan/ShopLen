"use client";

import React, { useState, useEffect, useMemo } from "react";
import debounce from "debounce";
import { Search, Filter, Layers, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/Input";
import {
  MultiSelectDropdown,
  MultiSelectOption,
} from "@/components/ui/MultiSelectDropdown";
import type { ProductStatus } from "@/types/product.type";
import { ProductFilterState, MOCK_CATEGORIES } from "../constants";

interface ProductFilterBarProps {
  filters: ProductFilterState;
  onFilterChange: (updated: Partial<ProductFilterState>) => void;
  onResetFilter?: () => void;
}

export function ProductFilterBar({
  filters,
  onFilterChange,
  onResetFilter,
}: ProductFilterBarProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search);

  useEffect(() => {
    setSearchTerm(filters.search);
  }, [filters.search]);

  const debouncedSearch = useMemo(
    () => debounce((val: string) => onFilterChange({ search: val }), 1000),
    [onFilterChange]
  );

  const categoryOptions: MultiSelectOption[] = MOCK_CATEGORIES.map((cat) => ({
    key: cat.id,
    label: cat.name,
  }));

  const statusOptions: MultiSelectOption[] = [
    { key: "ACTIVE", label: "Đang bán" },
    { key: "HIDDEN", label: "Đang ẩn" },
    { key: "OUT_OF_STOCK", label: "Hết hàng" },
  ];

  return (
    <div className="bg-surface p-3 rounded-xl border border-border">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
          <div className="w-full sm:w-72">
            <Input
              type="text"
              placeholder="Tìm theo tên/mã sản phẩm..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                debouncedSearch(e.target.value);
              }}
              leftIcon={<Search className="w-4 h-4 text-text-muted" />}
              onClear={
                searchTerm
                  ? () => {
                      setSearchTerm("");
                      onFilterChange({ search: "" });
                    }
                  : undefined
              }
              className="h-[38px]"
            />
          </div>

          <MultiSelectDropdown
            label="Danh mục"
            triggerIcon={<Layers className="w-3.5 h-3.5 text-primary" />}
            variant="surface"
            options={categoryOptions}
            selectedKeys={filters.categoryIds}
            onChange={(keys) => onFilterChange({ categoryIds: keys })}
            width="w-56"
          />

          <MultiSelectDropdown
            label="Trạng thái"
            triggerIcon={<Filter className="w-3.5 h-3.5 text-primary" />}
            variant="surface"
            options={statusOptions}
            selectedKeys={filters.statuses}
            onChange={(keys) =>
              onFilterChange({ statuses: keys as ProductStatus[] })
            }
            width="w-52"
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
