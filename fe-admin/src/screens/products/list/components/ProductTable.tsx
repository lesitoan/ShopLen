"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Edit, Trash2, Check, X, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Switch } from "@/components/ui/Switch";
import { ProductListItem, ProductStatus } from "../constants";

type SortField = "price" | "stock";
type SortOrder = "ASC" | "DESC";

interface ProductTableProps {
  products: ProductListItem[];
  totalItems: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onUpdateStock: (productId: string, newStock: number) => void;
  onToggleStatus: (productId: string, currentStatus: ProductStatus) => void;
  onDeleteProduct: (product: ProductListItem) => void;
  onEditProduct?: (product: ProductListItem) => void;
}

export function ProductTable({
  products,
  totalItems,
  page,
  pageSize,
  onPageChange,
  onUpdateStock,
  onToggleStatus,
  onDeleteProduct,
  onEditProduct,
}: ProductTableProps) {
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [editingStockVal, setEditingStockVal] = useState<number>(0);
  const [sortConfig, setSortConfig] = useState<{ field: SortField | null; order: SortOrder }>({
    field: null,
    order: "ASC",
  });

  const formatMoney = (amount: number) => {
    return amount.toLocaleString("vi-VN") + "đ";
  };

  const handleStartEditStock = (product: ProductListItem) => {
    setEditingStockId(product.id);
    setEditingStockVal(product.stockQuantity);
  };

  const handleSaveStock = (productId: string) => {
    onUpdateStock(productId, Math.max(0, editingStockVal));
    setEditingStockId(null);
  };

  const handleCancelEditStock = () => {
    setEditingStockId(null);
  };

  const handleToggleSort = (field: SortField) => {
    setSortConfig((prev) => {
      if (prev.field !== field) {
        return { field, order: "ASC" };
      }
      if (prev.order === "ASC") {
        return { field, order: "DESC" };
      }
      return { field: null, order: "ASC" };
    });
  };

  const sortedProducts = useMemo(() => {
    if (!sortConfig.field) return products;
    return [...products].sort((a, b) => {
      if (sortConfig.field === "price") {
        const priceA = a.salePrice ?? a.originalPrice;
        const priceB = b.salePrice ?? b.originalPrice;
        return sortConfig.order === "ASC" ? priceA - priceB : priceB - priceA;
      }
      if (sortConfig.field === "stock") {
        return sortConfig.order === "ASC"
          ? a.stockQuantity - b.stockQuantity
          : b.stockQuantity - a.stockQuantity;
      }
      return 0;
    });
  }, [products, sortConfig]);

  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const renderSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-text-muted hover:text-text-primary" />;
    }
    return sortConfig.order === "ASC" ? (
      <ArrowUp className="w-3.5 h-3.5 text-primary" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-primary" />
    );
  };

  const columns: Column<ProductListItem>[] = [
    {
      key: "productInfo",
      header: "Sản phẩm",
      align: "left",
      width: "35%",
      render: (product) => (
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-lg bg-surface-muted border border-border overflow-hidden shrink-0">
            <Image
              src={product.image}
              alt={product.name}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <Link
              href={`/products/${product.id}`}
              title={product.name}
              className="font-bold text-text-primary text-xs hover:text-primary transition-colors line-clamp-1 block"
            >
              {product.name}
            </Link>
            <div className="flex items-center gap-2 text-[11px] text-text-muted mt-0.5">
              <span className="font-mono text-text-secondary">{product.code}</span>
              {product.isFeatured && (
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-primary/10 text-primary border border-primary/20">
                  Nổi bật
                </span>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Danh mục",
      align: "left",
      render: (product) => (
        <span className="inline-block px-2.5 py-1 rounded-md bg-surface-muted text-text-secondary font-medium text-xs border border-border/60">
          {product.categoryName}
        </span>
      ),
    },
    {
      key: "price",
      header: (
        <button
          type="button"
          onClick={() => handleToggleSort("price")}
          className="inline-flex items-center gap-1.5 hover:text-text-primary transition-colors cursor-pointer select-none"
          title="Bấm để sắp xếp theo giá"
        >
          <span>Giá bán</span>
          {renderSortIcon("price")}
        </button>
      ),
      align: "right",
      render: (product) => (
        <div className="text-right">
          <div className="font-bold text-text-highlight text-xs">
            {formatMoney(product.salePrice ?? product.originalPrice)}
          </div>
          {product.salePrice && (
            <div className="text-[11px] text-text-muted line-through">
              {formatMoney(product.originalPrice)}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "stock",
      header: (
        <button
          type="button"
          onClick={() => handleToggleSort("stock")}
          className="inline-flex items-center gap-1.5 hover:text-text-primary transition-colors cursor-pointer select-none"
          title="Bấm để sắp xếp theo tồn kho"
        >
          <span>Tồn kho</span>
          {renderSortIcon("stock")}
        </button>
      ),
      align: "center",
      render: (product) => {
        const isEditing = editingStockId === product.id;

        if (isEditing) {
          return (
            <div className="flex items-center justify-center gap-1">
              <input
                type="number"
                min={0}
                value={editingStockVal}
                onChange={(e) => setEditingStockVal(parseInt(e.target.value) || 0)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveStock(product.id);
                  if (e.key === "Escape") handleCancelEditStock();
                }}
                className="w-16 px-1.5 py-1 text-xs font-bold text-center bg-surface-muted text-text-primary rounded border border-primary focus:outline-none"
                autoFocus
              />
              <button
                onClick={() => handleSaveStock(product.id)}
                title="Lưu số lượng"
                className="p-1 rounded bg-status-success/20 text-status-success hover:bg-status-success/30 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleCancelEditStock}
                title="Hủy"
                className="p-1 rounded bg-surface-muted text-text-muted hover:text-text-primary transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        }

        const isLowStock = product.stockQuantity > 0 && product.stockQuantity < 5;
        const isOutOfStock = product.stockQuantity === 0;

        return (
          <button
            onClick={() => handleStartEditStock(product)}
            title="Bấm để sửa nhanh tồn kho"
            className={`group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
              isOutOfStock
                ? "bg-status-danger/10 text-status-danger border border-status-danger/20"
                : isLowStock
                ? "bg-status-warning/10 text-status-warning border border-status-warning/20 animate-pulse"
                : "bg-surface-muted text-text-primary border border-border/60 hover:border-primary/50 hover:text-primary"
            }`}
          >
            <span>{product.stockQuantity}</span>
          </button>
        );
      },
    },
    {
      key: "status",
      header: "Trạng thái",
      align: "center",
      render: (product) => {
        if (product.status === "OUT_OF_STOCK" || product.stockQuantity === 0) {
          return (
            <Badge variant="danger" dot>
              Hết hàng
            </Badge>
          );
        }
        if (product.status === "ACTIVE") {
          return (
            <Badge variant="success" dot>
              Đang bán
            </Badge>
          );
        }
        return (
          <Badge variant="neutral" dot>
            Đang ẩn
          </Badge>
        );
      },
    },
    {
      key: "actions",
      header: "Hành động",
      align: "right",
      render: (product) => (
        <div className="flex items-center justify-end gap-2.5">
          <Switch
            checked={product.status === "ACTIVE"}
            onChange={() => onToggleStatus(product.id, product.status)}
            size="sm"
          />

          <button
            onClick={() => (onEditProduct ? onEditProduct(product) : undefined)}
            title="Chỉnh sửa sản phẩm"
            className="p-1.5 rounded-lg text-text-muted hover:text-primary hover:bg-surface-muted transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDeleteProduct(product)}
            title="Xóa sản phẩm"
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
        data={sortedProducts}
        keyExtractor={(product) => product.id}
        className="!border-0 !rounded-none !shadow-none"
        emptyMessage="Không tìm thấy sản phẩm nào phù hợp"
        pagination={{
          currentPage: page,
          totalPages,
          totalItems,
          pageSize,
          onPageChange,
        }}
      />
    </div>
  );
}
