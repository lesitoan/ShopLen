"use client";

import React, { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import {
  MOCK_CATEGORIES_DATA,
  CategoryListItem,
  CategoryStatus,
  CategoryFilterState,
  CategorySortKey,
} from "./constants";
import { CategoryFilterBar } from "./components/CategoryFilterBar";
import { CategoryTable } from "./components/CategoryTable";
import { CategoryDrawerForm } from "./components/CategoryDrawerForm";
import { Modal } from "@/components/ui/Modal";

export function CategoriesListScreen() {
  const [categories, setCategories] = useState<CategoryListItem[]>(MOCK_CATEGORIES_DATA);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryListItem | null>(null);

  const [pendingToggleCategory, setPendingToggleCategory] = useState<{
    category: CategoryListItem;
    nextStatus: CategoryStatus;
  } | null>(null);

  const [pendingDeleteCategory, setPendingDeleteCategory] = useState<CategoryListItem | null>(null);

  const [filters, setFilters] = useState<CategoryFilterState>({
    searchQuery: "",
    statusFilter: "ALL",
    sortBy: "displayOrder",
    sortOrder: "asc",
    page: 1,
    pageSize: 10,
  });

  const handleFilterChange = (updated: Partial<CategoryFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleSortChange = (sortKey: CategorySortKey) => {
    setFilters((prev) => {
      if (prev.sortBy === sortKey) {
        return {
          ...prev,
          sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
        };
      }
      return {
        ...prev,
        sortBy: sortKey,
        sortOrder: sortKey === "productCount" ? "desc" : "asc",
      };
    });
  };

  const handleSaveCategory = (
    categoryData: Omit<CategoryListItem, "id" | "createdAt" | "updatedAt" | "productCount">
  ) => {
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? {
                ...c,
                ...categoryData,
                updatedAt: "Vừa xong",
              }
            : c
        )
      );
      setEditingCategory(null);
    } else {
      const createdCategory: CategoryListItem = {
        ...categoryData,
        id: `cat_${Date.now()}`,
        productCount: 0,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: "Vừa xong",
      };
      setCategories((prev) => [createdCategory, ...prev]);
      setIsDrawerOpen(false);
    }
  };

  const handleRequestToggleStatus = (categoryId: string, currentStatus: CategoryStatus) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return;
    const nextStatus: CategoryStatus = currentStatus === "ACTIVE" ? "HIDDEN" : "ACTIVE";
    setPendingToggleCategory({ category, nextStatus });
  };

  const handleConfirmToggleStatus = () => {
    if (pendingToggleCategory) {
      const { category, nextStatus } = pendingToggleCategory;
      setCategories((prev) =>
        prev.map((c) => {
          if (c.id === category.id) {
            return {
              ...c,
              status: nextStatus,
              updatedAt: "Vừa xong",
            };
          }
          return c;
        })
      );
      setPendingToggleCategory(null);
    }
  };

  const handleConfirmDelete = () => {
    if (pendingDeleteCategory) {
      setCategories((prev) => prev.filter((c) => c.id !== pendingDeleteCategory.id));
      setPendingDeleteCategory(null);
    }
  };

  const filteredCategories = useMemo(() => {
    return categories
      .filter((cat) => {
        if (filters.searchQuery.trim()) {
          const query = filters.searchQuery.toLowerCase();
          const matchesName = cat.name.toLowerCase().includes(query);
          const matchesCode = cat.code.toLowerCase().includes(query);
          const matchesSlug = cat.slug.toLowerCase().includes(query);
          if (!matchesName && !matchesCode && !matchesSlug) return false;
        }

        if (filters.statusFilter !== "ALL" && cat.status !== filters.statusFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        let diff = 0;
        if (filters.sortBy === "displayOrder") {
          diff = a.displayOrder - b.displayOrder;
        } else if (filters.sortBy === "productCount") {
          diff = a.productCount - b.productCount;
        }
        return filters.sortOrder === "asc" ? diff : -diff;
      });
  }, [categories, filters]);

  const totalCount = filteredCategories.length;

  const paginatedCategories = useMemo(() => {
    const start = (filters.page - 1) * filters.pageSize;
    return filteredCategories.slice(start, start + filters.pageSize);
  }, [filteredCategories, filters.page, filters.pageSize]);

  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-highlight tracking-tight">
            Quản lý Danh Mục
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Quản lý danh sách các danh mục phân loại sản phẩm móc khóa len và quà tặng
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCategory(null);
            setIsDrawerOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 h-[38px] bg-primary hover:bg-primary-hover text-bg-deep font-bold text-xs rounded-lg transition-all shadow-md shadow-primary/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm danh mục</span>
        </button>
      </div>

      {/* Filter Bar */}
      <CategoryFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {/* Category Table */}
      <CategoryTable
        categories={paginatedCategories}
        totalItems={totalCount}
        page={filters.page}
        pageSize={filters.pageSize}
        sortBy={filters.sortBy}
        sortOrder={filters.sortOrder}
        onSortChange={handleSortChange}
        onPageChange={(page) => handleFilterChange({ page })}
        onToggleStatus={handleRequestToggleStatus}
        onEditCategory={(category) => setEditingCategory(category)}
        onDeleteCategory={(category) => setPendingDeleteCategory(category)}
      />

      {/* Shared Drawer Form */}
      <CategoryDrawerForm
        isOpen={isDrawerOpen || Boolean(editingCategory)}
        initialData={editingCategory}
        onSave={handleSaveCategory}
        onClose={() => {
          setIsDrawerOpen(false);
          setEditingCategory(null);
        }}
      />

      {/* Confirm Modals */}
      <Modal
        isOpen={Boolean(pendingToggleCategory)}
        onClose={() => setPendingToggleCategory(null)}
        onConfirm={handleConfirmToggleStatus}
        type={pendingToggleCategory?.nextStatus === "HIDDEN" ? "WARNING" : "CONFIRM"}
        title={
          pendingToggleCategory?.nextStatus === "HIDDEN"
            ? "Ẩn danh mục khỏi website"
            : "Hiện danh mục trên website"
        }
        description={
          pendingToggleCategory?.nextStatus === "HIDDEN"
            ? `Bạn có chắc chắn muốn ẩn danh mục "${pendingToggleCategory?.category.name}" khỏi cửa hàng không?`
            : `Bạn có chắc chắn muốn cho phép hiển thị lại danh mục "${pendingToggleCategory?.category.name}" trên cửa hàng không?`
        }
        confirmText={
          pendingToggleCategory?.nextStatus === "HIDDEN" ? "Ẩn danh mục" : "Hiện danh mục"
        }
        cancelText="Bỏ qua"
        size="sm"
      />

      <Modal
        isOpen={Boolean(pendingDeleteCategory)}
        onClose={() => setPendingDeleteCategory(null)}
        onConfirm={handleConfirmDelete}
        type="DANGER"
        title="Xác nhận xóa danh mục"
        description={`Bạn có chắc chắn muốn xóa vĩnh viễn danh mục "${pendingDeleteCategory?.name}" (${pendingDeleteCategory?.productCount} sản phẩm) không? Thao tác này không thể hoàn tác.`}
        confirmText="Xác nhận xóa"
        cancelText="Bỏ qua"
        size="sm"
      />
    </div>
  );
}
