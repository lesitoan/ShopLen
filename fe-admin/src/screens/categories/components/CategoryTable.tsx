"use client";

import React from "react";
import Image from "next/image";
import { Edit, Trash2, FolderTree, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Switch } from "@/components/ui/Switch";
import { CategoryListItem, CategoryStatus, CategorySortKey, SortOrder } from "../constants";

interface CategoryTableProps {
  categories: CategoryListItem[];
  totalItems: number;
  page: number;
  pageSize: number;
  sortBy: CategorySortKey;
  sortOrder: SortOrder;
  onSortChange: (key: CategorySortKey) => void;
  onPageChange: (page: number) => void;
  onToggleStatus: (categoryId: string, currentStatus: CategoryStatus) => void;
  onEditCategory: (category: CategoryListItem) => void;
  onDeleteCategory: (category: CategoryListItem) => void;
}

export function CategoryTable({
  categories,
  totalItems,
  page,
  pageSize,
  sortBy,
  sortOrder,
  onSortChange,
  onPageChange,
  onToggleStatus,
  onEditCategory,
  onDeleteCategory,
}: CategoryTableProps) {
  const columns: Column<CategoryListItem>[] = [
    {
      key: "categoryInfo",
      header: "Danh mục",
      align: "left",
      width: "35%",
      render: (category) => (
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-lg bg-surface-muted border border-border overflow-hidden shrink-0 flex items-center justify-center">
            {category.image ? (
              <Image
                src={category.image}
                alt={category.name}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <FolderTree className="w-5 h-5 text-primary" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-bold text-text-primary text-xs tracking-tight">
              {category.name}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-text-muted mt-0.5">
              <span className="font-mono text-text-secondary">{category.code}</span>
              {category.description && (
                <span className="truncate max-w-[220px] text-text-muted hidden sm:inline" title={category.description}>
                  • {category.description}
                </span>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "slug",
      header: "Đường dẫn (Slug)",
      align: "left",
      width: "20%",
      render: (category) => (
        <span className="font-mono text-xs text-text-secondary bg-surface-muted/60 px-2 py-1 rounded border border-border/40">
          /{category.slug}
        </span>
      ),
    },
    {
      key: "displayOrder",
      header: (
        <button
          type="button"
          onClick={() => onSortChange("displayOrder")}
          className="inline-flex items-center justify-center gap-1 hover:text-text-primary transition-colors cursor-pointer group"
        >
          <span>Thứ tự</span>
          {sortBy === "displayOrder" ? (
            sortOrder === "asc" ? (
              <ArrowUp className="w-3.5 h-3.5 text-primary" />
            ) : (
              <ArrowDown className="w-3.5 h-3.5 text-primary" />
            )
          ) : (
            <ArrowUpDown className="w-3.5 h-3.5 text-text-muted opacity-60 group-hover:opacity-100" />
          )}
        </button>
      ),
      align: "center",
      width: "10%",
      render: (category) => (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-surface-muted text-xs font-bold text-text-primary border border-border">
          {category.displayOrder}
        </span>
      ),
    },
    {
      key: "productCount",
      header: (
        <button
          type="button"
          onClick={() => onSortChange("productCount")}
          className="inline-flex items-center justify-center gap-1 hover:text-text-primary transition-colors cursor-pointer group"
        >
          <span>Số sản phẩm</span>
          {sortBy === "productCount" ? (
            sortOrder === "asc" ? (
              <ArrowUp className="w-3.5 h-3.5 text-primary" />
            ) : (
              <ArrowDown className="w-3.5 h-3.5 text-primary" />
            )
          ) : (
            <ArrowUpDown className="w-3.5 h-3.5 text-text-muted opacity-60 group-hover:opacity-100" />
          )}
        </button>
      ),
      align: "center",
      width: "15%",
      render: (category) => (
        <span className="text-xs font-semibold text-text-primary">
          {category.productCount} sản phẩm
        </span>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      align: "center",
      width: "12%",
      render: (category) =>
        category.status === "ACTIVE" ? (
          <Badge variant="success" dot>
            Đang bán
          </Badge>
        ) : (
          <Badge variant="neutral" dot>
            Đang ẩn
          </Badge>
        ),
    },
    {
      key: "actions",
      header: "Hành động",
      align: "right",
      width: "13%",
      render: (category) => (
        <div className="flex items-center justify-end gap-2.5">
          <Switch
            checked={category.status === "ACTIVE"}
            onChange={() => onToggleStatus(category.id, category.status)}
            size="sm"
          />

          <button
            onClick={() => onEditCategory(category)}
            title="Chỉnh sửa danh mục"
            className="p-1.5 rounded-lg text-text-muted hover:text-primary hover:bg-surface-muted transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDeleteCategory(category)}
            title="Xóa danh mục"
            className="p-1.5 rounded-lg text-text-muted hover:text-status-danger hover:bg-status-danger/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      <DataTable
        columns={columns}
        data={categories}
        keyExtractor={(category) => category.id}
        pagination={{
          currentPage: page,
          totalPages: Math.ceil(totalItems / pageSize) || 1,
          totalItems,
          pageSize,
          onPageChange,
        }}
        emptyMessage="Không tìm thấy danh mục nào phù hợp"
      />
    </div>
  );
}
