"use client";

import React, { useState, useEffect, useMemo } from "react";
import debounce from "debounce";
import { Search, RotateCcw, Filter } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { BlogFilterState } from "../constants";
import { BLOG_SORT_OPTIONS, PRESET_BLOG_TAGS } from "../constants";
import type { BlogPostTag, BlogPostStatus } from "@/types/blog.type";

interface BlogFilterBarProps {
  filters: BlogFilterState;
  tags?: BlogPostTag[];
  onFilterChange: (updated: Partial<BlogFilterState>) => void;
  onResetFilter?: () => void;
}

export function BlogFilterBar({
  filters,
  tags = PRESET_BLOG_TAGS,
  onFilterChange,
  onResetFilter,
}: BlogFilterBarProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search);

  useEffect(() => {
    setSearchTerm(filters.search);
  }, [filters.search]);

  const debouncedSearch = useMemo(
    () => debounce((val: string) => onFilterChange({ search: val, page: 1 }), 600),
    [onFilterChange]
  );

  const tagOptions = useMemo(() => {
    const list = [
      { label: "Tất cả chủ đề", value: "" },
      ...tags.map((t) => ({ label: t.name, value: t.id })),
    ];
    return list;
  }, [tags]);

  const statusOptions = [
    { label: "Tất cả trạng thái", value: "" },
    { label: "Đã xuất bản", value: "PUBLISHED" },
    { label: "Bản nháp", value: "DRAFT" },
    { label: "Lưu trữ", value: "ARCHIVED" },
  ];

  const hasActiveFilters = Boolean(
    filters.search || filters.tagId || filters.status || filters.sort !== "NEWEST"
  );

  return (
    <div className="bg-surface p-3.5 rounded-lg border border-border shadow-xs space-y-3">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search */}
        <div className="flex-1 min-w-[260px]">
          <Input
            placeholder="Tìm kiếm bài viết theo tiêu đề, tóm tắt..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              debouncedSearch(e.target.value);
            }}
            onClear={
              searchTerm
                ? () => {
                    setSearchTerm("");
                    onFilterChange({ search: "", page: 1 });
                  }
                : undefined
            }
            leftIcon={<Search className="w-4 h-4 text-text-muted" />}
            className="h-[38px]"
          />
        </div>

        {/* Dropdowns Group */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          {/* Tag Select */}
          <div className="w-full sm:w-52">
            <Select
              options={tagOptions}
              value={filters.tagId}
              onChange={(e) =>
                onFilterChange({ tagId: e.target.value, page: 1 })
              }
              className="h-[38px]"
            />
          </div>

          {/* Status Select */}
          <div className="w-full sm:w-44">
            <Select
              options={statusOptions}
              value={filters.status}
              onChange={(e) =>
                onFilterChange({
                  status: (e.target.value as BlogPostStatus) || "",
                  page: 1,
                })
              }
              className="h-[38px]"
            />
          </div>

          {/* Sort Select */}
          <div className="w-full sm:w-48">
            <Select
              options={BLOG_SORT_OPTIONS}
              value={filters.sort}
              onChange={(e) =>
                onFilterChange({
                  sort: e.target.value as BlogFilterState["sort"],
                  page: 1,
                })
              }
              className="h-[38px]"
            />
          </div>

          {/* Reset button */}
          {onResetFilter && hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilter}
              className="h-[38px] px-3 rounded-md bg-surface-muted hover:bg-surface-hover text-text-secondary hover:text-text-primary border border-border transition-colors flex items-center gap-1.5 text-xs font-semibold shrink-0 cursor-pointer"
              title="Đặt lại tất cả bộ lọc"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt lại</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
