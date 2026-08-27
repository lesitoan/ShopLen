"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Edit,
  Trash2,
  Check,
  X,
  Package,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Switch } from "@/components/ui/Switch";
import { EmptyState } from "@/components/ui/EmptyState";
import { Loading } from "@/components/ui/Loading";
import type {
  AdminProductListItem,
  AdminProductSortOption,
  ProductStatus,
} from "@/types/product.type";

interface ProductTableProps {
  products: AdminProductListItem[];
  totalItems: number;
  page: number;
  pageSize: number;
  sort?: AdminProductSortOption;
  onSortChange?: (sort: AdminProductSortOption) => void;
  isLoading?: boolean;
  isFetching?: boolean;
  isError?: boolean;
  onPageChange: (page: number) => void;
  onUpdateStock?: (productId: string, newStock: number) => void;
  onToggleStatus?: (productId: string, currentStatus: ProductStatus) => void;
  onDeleteProduct?: (product: AdminProductListItem) => void;
  onEditProduct?: (product: AdminProductListItem) => void;
}

export function ProductTable({
  products,
  totalItems,
  page,
  pageSize,
  sort = "NEWEST",
  onSortChange,
  isLoading,
  isFetching,
  isError,
  onPageChange,
  onUpdateStock,
  onToggleStatus,
  onDeleteProduct,
  onEditProduct,
}: ProductTableProps) {
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [editingStockVal, setEditingStockVal] = useState<number>(0);

  const formatMoney = (amount: number) => {
    return amount.toLocaleString("vi-VN") + "đ";
  };

  const handleStartEditStock = (product: AdminProductListItem) => {
    setEditingStockId(product.id);
    setEditingStockVal(product.stockQuantity);
  };

  const handleSaveStock = (productId: string) => {
    if (onUpdateStock) {
      onUpdateStock(productId, Math.max(0, editingStockVal));
    }
    setEditingStockId(null);
  };

  const handleCancelEditStock = () => {
    setEditingStockId(null);
  };

  const handleToggleProductSort = () => {
    if (!onSortChange) return;
    if (sort === "NEWEST") onSortChange("OLDEST");
    else onSortChange("NEWEST");
  };

  const handleTogglePriceSort = () => {
    if (!onSortChange) return;
    if (sort === "PRICE_ASC") onSortChange("PRICE_DESC");
    else if (sort === "PRICE_DESC") onSortChange("NEWEST");
    else onSortChange("PRICE_ASC");
  };

  const handleToggleStockSort = () => {
    if (!onSortChange) return;
    if (sort === "STOCK_ASC") onSortChange("STOCK_DESC");
    else if (sort === "STOCK_DESC") onSortChange("NEWEST");
    else onSortChange("STOCK_ASC");
  };

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const columns: Column<AdminProductListItem>[] = [
    {
      key: "productInfo",
      header: (
        <button
          type="button"
          onClick={handleToggleProductSort}
          className="inline-flex items-center gap-1.5 hover:text-text-primary transition-colors cursor-pointer select-none"
          title="Bấm để đổi xếp mới nhất / cũ nhất"
        >
          <span>Sản phẩm</span>
          {sort === "NEWEST" ? (
            <ArrowDown className="w-3.5 h-3.5 text-primary" />
          ) : sort === "OLDEST" ? (
            <ArrowUp className="w-3.5 h-3.5 text-primary" />
          ) : (
            <ArrowUpDown className="w-3.5 h-3.5 text-text-muted hover:text-text-primary" />
          )}
        </button>
      ),
      align: "left",
      width: "35%",
      render: (product) => (
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-lg bg-surface-muted border border-border overflow-hidden shrink-0 flex items-center justify-center">
            {product.thumbnail?.url ? (
              <Image
                src={product.thumbnail.url}
                alt={product.thumbnail.altText || product.name}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <Package className="w-5 h-5 text-text-muted" />
            )}
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
          {product.category?.name || "Chưa phân loại"}
        </span>
      ),
    },
    {
      key: "price",
      header: (
        <button
          type="button"
          onClick={handleTogglePriceSort}
          className="inline-flex items-center gap-1.5 hover:text-text-primary transition-colors cursor-pointer select-none"
          title="Bấm để xếp theo giá bán"
        >
          <span>Giá bán</span>
          {sort === "PRICE_ASC" ? (
            <ArrowUp className="w-3.5 h-3.5 text-primary" />
          ) : sort === "PRICE_DESC" ? (
            <ArrowDown className="w-3.5 h-3.5 text-primary" />
          ) : (
            <ArrowUpDown className="w-3.5 h-3.5 text-text-muted hover:text-text-primary" />
          )}
        </button>
      ),
      align: "right",
      render: (product) => (
        <div className="text-right">
          <div className="font-bold text-text-highlight text-xs">
            {formatMoney(product.price)}
          </div>
          {product.salePrice && product.salePrice < product.originalPrice && (
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
          onClick={handleToggleStockSort}
          className="inline-flex items-center gap-1.5 hover:text-text-primary transition-colors cursor-pointer select-none"
          title="Bấm để xếp theo tồn kho"
        >
          <span>Tồn kho</span>
          {sort === "STOCK_ASC" ? (
            <ArrowUp className="w-3.5 h-3.5 text-primary" />
          ) : sort === "STOCK_DESC" ? (
            <ArrowDown className="w-3.5 h-3.5 text-primary" />
          ) : (
            <ArrowUpDown className="w-3.5 h-3.5 text-text-muted hover:text-text-primary" />
          )}
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
            onChange={() =>
              onToggleStatus ? onToggleStatus(product.id, product.status) : undefined
            }
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
            onClick={() => (onDeleteProduct ? onDeleteProduct(product) : undefined)}
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
      {isLoading || isFetching ? (
        <div className="p-12 flex items-center justify-center">
          <Loading size="md" />
        </div>
      ) : isError ? (
        <div className="p-8">
          <EmptyState message="Không thể tải danh sách sản phẩm" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={products}
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
      )}
    </div>
  );
}
