"use client";

import React, { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { useTableFilters } from "@/hooks/useTableFilters";
import {
  useListProductsQuery,
  useGetProductDetailQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
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
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const { data: editingProductDetail, isFetching: isFetchingDetail } =
    useGetProductDetailQuery(editingProductId!, {
      skip: !editingProductId,
    });

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
      if (editingProductId) {
        await updateProduct({
          id: editingProductId,
          body: productData,
        }).unwrap();
        toast.success("Cập nhật thông tin sản phẩm thành công!");
        setIsAddDrawerOpen(false);
        setEditingProductId(null);
      } else {
        await createProduct(productData).unwrap();
        toast.success("Tạo sản phẩm mới thành công!");
        setIsAddDrawerOpen(false);
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Có lỗi xảy ra khi lưu sản phẩm."
      );
    }
  };

  const handleUpdateStock = async (productId: string, newStock: number) => {
    try {
      await updateProduct({
        id: productId,
        body: { stockQuantity: newStock },
      }).unwrap();
      toast.success("Cập nhật số lượng tồn kho thành công!");
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Cập nhật tồn kho thất bại."
      );
    }
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

  const handleConfirmToggleStatus = async () => {
    if (!pendingToggleProduct) return;
    try {
      await updateProduct({
        id: pendingToggleProduct.product.id,
        body: { status: pendingToggleProduct.nextStatus },
      }).unwrap();
      toast.success(
        pendingToggleProduct.nextStatus === "ACTIVE"
          ? "Đã cho phép hiển thị sản phẩm trên cửa hàng!"
          : "Đã ẩn sản phẩm khỏi cửa hàng!"
      );
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Thay đổi trạng thái sản phẩm thất bại."
      );
    } finally {
      setPendingToggleProduct(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteProduct) return;
    try {
      await deleteProduct(pendingDeleteProduct.id).unwrap();
      toast.success(`Đã xóa sản phẩm "${pendingDeleteProduct.name}" thành công!`);
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Xóa sản phẩm thất bại."
      );
    } finally {
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
            setEditingProductId(null);
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
        onEditProduct={(product) => setEditingProductId(product.id)}
      />

      <ProductDrawerForm
        isOpen={isAddDrawerOpen || Boolean(editingProductId)}
        initialData={editingProductId ? editingProductDetail : null}
        onSave={handleSaveProduct}
        onClose={() => {
          setIsAddDrawerOpen(false);
          setEditingProductId(null);
        }}
        isLoading={isCreating || isUpdating || isFetchingDetail}
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
