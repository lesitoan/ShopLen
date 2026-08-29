"use client";

import React, { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { useTableFilters } from "@/hooks/useTableFilters";
import {
  useListCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/services/api/categoryApi";
import type {
  AdminCategoryItem,
  AdminCategoryListQueryDto,
  CreateAdminCategoryDto,
} from "@/types/category.type";
import { DEFAULT_CATEGORY_FILTERS } from "./constants";
import { CategoryFilterBar } from "./components/CategoryFilterBar";
import { CategoryTable } from "./components/CategoryTable";
import { CategoryDrawerForm } from "./components/CategoryDrawerForm";
import { Modal } from "@/components/ui/Modal";
import { toast } from "react-toastify";

export function CategoriesListScreen() {
  const { filters, setFilter, setFilters, resetFilters } = useTableFilters(
    DEFAULT_CATEGORY_FILTERS
  );

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<AdminCategoryItem | null>(null);

  const [pendingDeleteCategory, setPendingDeleteCategory] =
    useState<AdminCategoryItem | null>(null);

  const queryDto: AdminCategoryListQueryDto = useMemo(() => {
    return {
      page: filters.page,
      limit: filters.limit,
      search: filters.search.trim() || undefined,
      sort: filters.sort,
    };
  }, [filters]);

  const { data, isLoading, isFetching, isError } =
    useListCategoriesQuery(queryDto);

  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  const categories = data?.items || [];
  const totalItems = data?.pagination.total || 0;

  const handleFilterChange = (
    updated: Partial<typeof DEFAULT_CATEGORY_FILTERS>
  ) => {
    setFilters(updated);
  };

  const handleSaveCategory = async (categoryData: CreateAdminCategoryDto) => {
    try {
      if (editingCategory) {
        await updateCategory({
          id: editingCategory.id,
          data: categoryData,
        }).unwrap();
        toast.success("Cập nhật danh mục thành công.");
        setEditingCategory(null);
      } else {
        await createCategory(categoryData).unwrap();
        toast.success("Tạo danh mục thành công.");
        setIsDrawerOpen(false);
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.message || "Có lỗi xảy ra khi lưu danh mục"
      );
    }
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteCategory) return;
    try {
      await deleteCategory(pendingDeleteCategory.id).unwrap();
      toast.success("Xóa danh mục thành công.");
      setPendingDeleteCategory(null);
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.message || "Không thể xóa danh mục này"
      );
    }
  };

  return (
    <div className="space-y-5">
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
          className="inline-flex items-center justify-center gap-2 px-4 h-[38px] bg-primary hover:bg-primary-hover text-bg-deep font-bold text-xs rounded-lg transition-all shadow-md shadow-primary/20 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm danh mục</span>
        </button>
      </div>

      <CategoryFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilter={resetFilters}
      />

      <CategoryTable
        categories={categories}
        totalItems={totalItems}
        page={filters.page}
        pageSize={filters.limit}
        sort={filters.sort}
        onSortChange={(s) => setFilter("sort", s)}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        onPageChange={(page) => setFilter("page", page)}
        onEditCategory={(category) => setEditingCategory(category)}
        onDeleteCategory={(category) => setPendingDeleteCategory(category)}
      />

      <CategoryDrawerForm
        isOpen={isDrawerOpen || Boolean(editingCategory)}
        initialData={editingCategory}
        isLoading={isCreating || isUpdating}
        onSave={handleSaveCategory}
        onClose={() => {
          setIsDrawerOpen(false);
          setEditingCategory(null);
        }}
      />

      <Modal
        isOpen={Boolean(pendingDeleteCategory)}
        onClose={() => setPendingDeleteCategory(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        type="DANGER"
        title="Xác nhận xóa danh mục"
        description={`Bạn có chắc chắn muốn xóa vĩnh viễn danh mục "${pendingDeleteCategory?.name}" không? Thao tác này không thể hoàn tác.`}
        confirmText="Xác nhận xóa"
        cancelText="Bỏ qua"
        size="sm"
      />
    </div>
  );
}
