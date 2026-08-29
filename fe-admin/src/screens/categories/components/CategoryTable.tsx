"use client";

import React from "react";
import Image from "next/image";
import { Edit, Trash2, FolderTree, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Loading } from "@/components/ui/Loading";
import type { AdminCategoryItem, AdminCategorySortOption } from "@/types/category.type";

interface CategoryTableProps {
  categories: AdminCategoryItem[];
  totalItems: number;
  page: number;
  pageSize: number;
  sort?: AdminCategorySortOption;
  onSortChange?: (sort: AdminCategorySortOption) => void;
  isLoading?: boolean;
  isFetching?: boolean;
  isError?: boolean;
  onPageChange: (page: number) => void;
  onEditCategory: (category: AdminCategoryItem) => void;
  onDeleteCategory: (category: AdminCategoryItem) => void;
}

export function CategoryTable({
  categories,
  totalItems,
  page,
  pageSize,
  sort = "NEWEST",
  onSortChange,
  isLoading,
  isFetching,
  isError,
  onPageChange,
  onEditCategory,
  onDeleteCategory,
}: CategoryTableProps) {
  const handleToggleNameSort = () => {
    if (!onSortChange) return;
    if (sort === "NAME_ASC") onSortChange("NAME_DESC");
    else if (sort === "NAME_DESC") onSortChange("NEWEST");
    else onSortChange("NAME_ASC");
  };

  const handleToggleDateSort = () => {
    if (!onSortChange) return;
    if (sort === "NEWEST") onSortChange("OLDEST");
    else onSortChange("NEWEST");
  };

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const columns: Column<AdminCategoryItem>[] = [
    {
      key: "categoryInfo",
      header: (
        <button
          type="button"
          onClick={handleToggleNameSort}
          className="inline-flex items-center gap-1.5 hover:text-text-primary transition-colors cursor-pointer select-none"
          title="Bấm để xếp theo tên danh mục"
        >
          <span>Danh mục</span>
          {sort === "NAME_ASC" ? (
            <ArrowUp className="w-3.5 h-3.5 text-primary" />
          ) : sort === "NAME_DESC" ? (
            <ArrowDown className="w-3.5 h-3.5 text-primary" />
          ) : (
            <ArrowUpDown className="w-3.5 h-3.5 text-text-muted hover:text-text-primary" />
          )}
        </button>
      ),
      align: "left",
      width: "40%",
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
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "slug",
      header: "Đường dẫn (Slug)",
      align: "left",
      width: "25%",
      render: (category) => (
        <span className="font-mono text-xs text-text-secondary bg-surface-muted/60 px-2 py-1 rounded border border-border/40">
          /{category.slug}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: (
        <button
          type="button"
          onClick={handleToggleDateSort}
          className="inline-flex items-center gap-1.5 hover:text-text-primary transition-colors cursor-pointer select-none"
          title="Bấm để xếp mới nhất / cũ nhất"
        >
          <span>Ngày tạo</span>
          {sort === "NEWEST" ? (
            <ArrowDown className="w-3.5 h-3.5 text-primary" />
          ) : sort === "OLDEST" ? (
            <ArrowUp className="w-3.5 h-3.5 text-primary" />
          ) : (
            <ArrowUpDown className="w-3.5 h-3.5 text-text-muted hover:text-text-primary" />
          )}
        </button>
      ),
      align: "center",
      width: "15%",
      render: (category) => (
        <span className="text-xs text-text-muted font-mono">
          {new Date(category.createdAt).toLocaleDateString("vi-VN")}
        </span>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      align: "center",
      width: "10%",
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
      width: "10%",
      render: (category) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onEditCategory(category)}
            title="Chỉnh sửa danh mục"
            className="p-1.5 rounded-lg text-text-muted hover:text-primary hover:bg-surface-muted transition-colors cursor-pointer"
          >
            <Edit className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDeleteCategory(category)}
            title="Xóa danh mục"
            className="p-1.5 rounded-lg text-text-muted hover:text-status-danger hover:bg-status-danger/10 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      {isLoading || isFetching ? (
        <div className="p-12 flex items-center justify-center">
          <Loading size="md" />
        </div>
      ) : isError ? (
        <div className="p-8">
          <EmptyState message="Không thể tải danh sách danh mục" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={categories}
          keyExtractor={(category) => category.id}
          pagination={{
            currentPage: page,
            totalPages,
            totalItems,
            pageSize,
            onPageChange,
          }}
          emptyMessage="Không tìm thấy danh mục nào phù hợp"
        />
      )}
    </div>
  );
}
