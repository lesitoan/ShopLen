"use client";

import React, { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { MOCK_PRODUCTS, ProductListItem, ProductStatus, ProductFilterState } from "./constants";
import { ProductFilterBar } from "./components/ProductFilterBar";
import { ProductTable } from "./components/ProductTable";
import { Modal } from "@/components/ui/Modal";
import { ProductDrawerForm } from "./components/ProductDrawerForm";

export function ProductsListScreen() {
  const [products, setProducts] = useState<ProductListItem[]>(MOCK_PRODUCTS);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductListItem | null>(null);

  const [pendingToggleProduct, setPendingToggleProduct] = useState<{
    product: ProductListItem;
    nextStatus: ProductStatus;
  } | null>(null);

  const [pendingDeleteProduct, setPendingDeleteProduct] = useState<ProductListItem | null>(null);

  const [filters, setFilters] = useState<ProductFilterState>({
    searchQuery: "",
    categoryIds: [],
    statusFilters: [],
    page: 1,
    pageSize: 5,
  });

  const handleFilterChange = (updated: Partial<ProductFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleSaveProduct = (productData: Omit<ProductListItem, "id" | "updatedAt">) => {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                ...productData,
                updatedAt: "Vừa xong",
              }
            : p
        )
      );
      setEditingProduct(null);
    } else {
      const createdProduct: ProductListItem = {
        ...productData,
        id: `prod_${Date.now()}`,
        updatedAt: "Vừa xong",
      };
      setProducts((prev) => [createdProduct, ...prev]);
      setIsAddDrawerOpen(false);
    }
  };

  const handleUpdateStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updatedStatus =
            newStock === 0 ? "OUT_OF_STOCK" : p.status === "OUT_OF_STOCK" ? "ACTIVE" : p.status;
          return {
            ...p,
            stockQuantity: newStock,
            status: updatedStatus,
            updatedAt: "Vừa xong",
          };
        }
        return p;
      })
    );
  };

  const handleRequestToggleStatus = (productId: string, currentStatus: ProductStatus) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const nextStatus: ProductStatus = currentStatus === "ACTIVE" ? "HIDDEN" : "ACTIVE";
    setPendingToggleProduct({ product, nextStatus });
  };

  const handleConfirmToggleStatus = () => {
    if (pendingToggleProduct) {
      const { product, nextStatus } = pendingToggleProduct;
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === product.id) {
            return {
              ...p,
              status: nextStatus,
              updatedAt: "Vừa xong",
            };
          }
          return p;
        })
      );
      setPendingToggleProduct(null);
    }
  };

  const handleConfirmDelete = () => {
    if (pendingDeleteProduct) {
      setProducts((prev) => prev.filter((p) => p.id !== pendingDeleteProduct.id));
      setPendingDeleteProduct(null);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesCode = product.code.toLowerCase().includes(query);
        if (!matchesName && !matchesCode) return false;
      }

      if (filters.categoryIds.length > 0 && !filters.categoryIds.includes(product.categoryId)) {
        return false;
      }

      if (filters.statusFilters.length > 0 && !filters.statusFilters.includes(product.status)) {
        return false;
      }

      return true;
    });
  }, [products, filters]);

  const totalCount = filteredProducts.length;

  const paginatedProducts = useMemo(() => {
    const start = (filters.page - 1) * filters.pageSize;
    return filteredProducts.slice(start, start + filters.pageSize);
  }, [filteredProducts, filters.page, filters.pageSize]);

  return (
    <div className="space-y-5">
      {/* Header Bar */}
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
          className="inline-flex items-center justify-center gap-2 px-4 h-[38px] bg-primary hover:bg-primary-hover text-bg-deep font-bold text-xs rounded-lg transition-all shadow-md shadow-primary/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm sản phẩm</span>
        </button>
      </div>

      {/* Filter Bar */}
      <ProductFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onAddProduct={() => {
          setEditingProduct(null);
          setIsAddDrawerOpen(true);
        }}
      />

      {/* Product Table */}
      <ProductTable
        products={paginatedProducts}
        totalItems={totalCount}
        page={filters.page}
        pageSize={filters.pageSize}
        onPageChange={(page) => handleFilterChange({ page })}
        onUpdateStock={handleUpdateStock}
        onToggleStatus={handleRequestToggleStatus}
        onDeleteProduct={(product) => setPendingDeleteProduct(product)}
        onEditProduct={(product) => setEditingProduct(product)}
      />

      {/* Shared Product Drawer Form for Add & Edit */}
      <ProductDrawerForm
        isOpen={isAddDrawerOpen || Boolean(editingProduct)}
        initialData={editingProduct}
        onSave={handleSaveProduct}
        onClose={() => {
          setIsAddDrawerOpen(false);
          setEditingProduct(null);
        }}
      />

      {/* Confirm Modals */}
      <Modal
        isOpen={Boolean(pendingToggleProduct)}
        onClose={() => setPendingToggleProduct(null)}
        onConfirm={handleConfirmToggleStatus}
        type={pendingToggleProduct?.nextStatus === "HIDDEN" ? "WARNING" : "CONFIRM"}
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
          pendingToggleProduct?.nextStatus === "HIDDEN" ? "Ẩn sản phẩm" : "Hiện sản phẩm"
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
