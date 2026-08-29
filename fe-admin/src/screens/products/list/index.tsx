"use client";

import React, { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { useTableFilters } from "@/hooks/useTableFilters";
import {
  useListProductsQuery,
  useCreateProductMutation,
} from "@/services/api/productApi";
import type {
  AdminProductListItem,
  AdminProductListQueryDto,
  CreateAdminProductDto,
  ProductStatus,
} from "@/types/product.type";
import { DEFAULT_PRODUCT_FILTERS } from "./constants";
import { ProductFilterBar } from "./components/ProductFilterBar";
import { ProductTable } from "./components/ProductTable";
import { Modal } from "@/components/ui/Modal";
import { ProductDrawerForm } from "./components/ProductDrawerForm";
import { toast } from "react-toastify";

export function ProductsListScreen() {
  const { filters, setFilter, setFilters, resetFilters } = useTableFilters(
    DEFAULT_PRODUCT_FILTERS
  );

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();

  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<AdminProductListItem | null>(null);

  const [pendingToggleProduct, setPendingToggleProduct] = useState<{
    product: AdminProductListItem;
    nextStatus: ProductStatus;
  } | null>(null);

  const [pendingDeleteProduct, setPendingDeleteProduct] =
    useState<AdminProductListItem | null>(null);

  const queryDto: AdminProductListQueryDto = useMemo(() => {
    return {
      page: filters.page,
      limit: filters.limit,
      search: filters.search.trim() || undefined,
      categoryIds:
        filters.categoryIds.length > 0 ? filters.categoryIds : undefined,
      statuses: filters.statuses.length > 0 ? filters.statuses : undefined,
      sort: filters.sort,
    };
  }, [filters]);

  const { data, isLoading, isFetching, isError } = useListProductsQuery(queryDto);

  const products = data?.items || [];
  const totalItems = data?.pagination.total || 0;

  const handleFilterChange = (
    updated: Partial<typeof DEFAULT_PRODUCT_FILTERS>
  ) => {
    setFilters(updated);
  };

  const handleSaveProduct = async (productData: CreateAdminProductDto) => {
    try {
      if (editingProduct) {
        toast.info("Tính năng chỉnh sửa sản phẩm sẽ được cập nhật tiếp theo.", {
          position: "top-right",
          autoClose: 3000,
        });
        setIsAddDrawerOpen(false);
        setEditingProduct(null);
      } else {
        await createProduct(productData).unwrap();
        toast.success("Tạo sản phẩm mới thành công!");
        setIsAddDrawerOpen(false);
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Có lỗi xảy ra khi tạo sản phẩm."
      );
    }
  };

  const handleUpdateStock = (_productId: string, _newStock: number) => {
    toast.info("Tính năng cập nhật tồn kho nhanh đang kết nối API", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const handleRequestToggleStatus = (
    productId: string,
    currentStatus: ProductStatus
  ) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const nextStatus: ProductStatus =
      currentStatus === "ACTIVE" ? "HIDDEN" : "ACTIVE";
    setPendingToggleProduct({ product, nextStatus });
  };

  const handleConfirmToggleStatus = () => {
    if (pendingToggleProduct) {
      toast.info("Tính năng đổi trạng thái sản phẩm đang kết nối API", {
        position: "top-right",
        autoClose: 3000,
      });
      setPendingToggleProduct(null);
    }
  };

  const handleConfirmDelete = () => {
    if (pendingDeleteProduct) {
      toast.info("Tính năng xóa sản phẩm đang kết nối API", {
        position: "top-right",
        autoClose: 3000,
      });
      setPendingDeleteProduct(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-highlight tracking-tight">
            Danh sách sản phẩm
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Quản lý thông tin, giá bán, tồn kho và danh mục sản phẩm móc khóa len
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setIsAddDrawerOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 h-[38px] bg-primary hover:bg-primary-hover text-bg-deep font-bold text-xs rounded-lg transition-all shadow-md shadow-primary/20 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm sản phẩm</span>
        </button>
      </div>

      <ProductFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilter={resetFilters}
      />

      <ProductTable
        products={products}
        totalItems={totalItems}
        page={filters.page}
        pageSize={filters.limit}
        sort={filters.sort}
        onSortChange={(s) => setFilter("sort", s)}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        onPageChange={(page) => setFilter("page", page)}
        onUpdateStock={handleUpdateStock}
        onToggleStatus={handleRequestToggleStatus}
        onDeleteProduct={(product) => setPendingDeleteProduct(product)}
        onEditProduct={(product) => setEditingProduct(product)}
      />

      <ProductDrawerForm
        isOpen={isAddDrawerOpen || Boolean(editingProduct)}
        initialData={editingProduct ? (editingProduct as any) : null}
        onSave={handleSaveProduct}
        onClose={() => {
          setIsAddDrawerOpen(false);
          setEditingProduct(null);
        }}
        isLoading={isCreating}
      />

      {/* Confirm Modals */}
      <Modal
        isOpen={Boolean(pendingToggleProduct)}
        onClose={() => setPendingToggleProduct(null)}
        onConfirm={handleConfirmToggleStatus}
        type={
          pendingToggleProduct?.nextStatus === "HIDDEN" ? "WARNING" : "CONFIRM"
        }
        title={
          pendingToggleProduct?.nextStatus === "HIDDEN"
            ? "Ẩn sản phẩm khỏi cửa hàng"
            : "Hiện sản phẩm trên cửa hàng"
        }
        description={
          pendingToggleProduct?.nextStatus === "HIDDEN"
            ? `Bạn có chắc chắn muốn ẩn sản phẩm "${pendingToggleProduct?.product.name}" khỏi cửa hàng không? Khách hàng sẽ không thể nhìn thấy hoặc đặt mua sản phẩm này nữa.`
            : `Bạn có chắc chắn muốn cho phép hiển thị và bán lại sản phẩm "${pendingToggleProduct?.product.name}" trên cửa hàng không?`
        }
        confirmText={
          pendingToggleProduct?.nextStatus === "HIDDEN"
            ? "Ẩn sản phẩm"
            : "Hiện sản phẩm"
        }
        cancelText="Bỏ qua"
        size="sm"
      />

      <Modal
        isOpen={Boolean(pendingDeleteProduct)}
        onClose={() => setPendingDeleteProduct(null)}
        onConfirm={handleConfirmDelete}
        type="DANGER"
        title="Xác nhận xóa sản phẩm"
        description={`Bạn có chắc chắn muốn xóa vĩnh viễn sản phẩm "${pendingDeleteProduct?.name}" khỏi hệ thống không? Thao tác này không thể hoàn tác.`}
        confirmText="Xác nhận xóa"
        cancelText="Bỏ qua"
        size="sm"
      />
    </div>
  );
}
