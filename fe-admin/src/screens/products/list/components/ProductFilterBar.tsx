"use client";

import React from "react";
import Link from "next/link";
import { Search, Plus, Filter, Layers } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { MultiSelectDropdown, MultiSelectOption } from "@/components/ui/MultiSelectDropdown";
import {
  ProductFilterState,
  MOCK_CATEGORIES,
  ProductStatus,
} from "../constants";

interface ProductFilterBarProps {
  filters: ProductFilterState;
  onFilterChange: (updated: Partial<ProductFilterState>) => void;
  onAddProduct?: () => void;
}

export function ProductFilterBar({
  filters,
  onFilterChange,
  onAddProduct,
}: ProductFilterBarProps) {
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
    <div className="bg-surface p-4 rounded-xl border border-border">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
          <div className="w-full sm:w-72">
            <Input
              type="text"
              placeholder="Tìm theo tên/mã sản phẩm..."
              value={filters.searchQuery}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value, page: 1 })}
              leftIcon={<Search className="w-4 h-4 text-text-muted" />}
              className="h-[38px]"
            />
          </div>

          <MultiSelectDropdown
            label="Danh mục"
            triggerIcon={<Layers className="w-3.5 h-3.5 text-primary" />}
            variant="surface"
            options={categoryOptions}
            selectedKeys={filters.categoryIds}
            onChange={(keys) => onFilterChange({ categoryIds: keys, page: 1 })}
            width="w-56"
          />

          <MultiSelectDropdown
            label="Trạng thái"
            triggerIcon={<Filter className="w-3.5 h-3.5 text-primary" />}
            variant="surface"
            options={statusOptions}
            selectedKeys={filters.statusFilters}
            onChange={(keys) =>
              onFilterChange({ statusFilters: keys as ProductStatus[], page: 1 })
            }
            width="w-52"
          />
        </div>
      </div>
    </div>
  );
}
