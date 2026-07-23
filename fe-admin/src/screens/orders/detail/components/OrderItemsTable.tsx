"use client";

import React from "react";
import Image from "next/image";
import { Package, Tag, CreditCard } from "lucide-react";
import { DataTable, Column } from "@/components/ui/DataTable";
import { OrderLineItem, OrderFinancial } from "../constants";

interface OrderItemsTableProps {
  items: OrderLineItem[];
  financial: OrderFinancial;
}

export function OrderItemsTable({ items, financial }: OrderItemsTableProps) {
  const formatMoney = (amount: number) => {
    return amount.toLocaleString("vi-VN") + "đ";
  };

  const columns: Column<OrderLineItem>[] = [
    {
      key: "product",
      header: "Sản phẩm",
      align: "left",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-lg bg-surface-muted border border-border overflow-hidden shrink-0">
            <Image
              src={item.image}
              alt={item.title}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
          <div>
            <div className="font-semibold text-text-primary text-xs hover:text-primary transition-colors">
              {item.title}
            </div>
            <div className="text-[11px] text-text-muted mt-0.5">
              Biến thể: <span className="text-text-secondary">{item.variantName}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "price",
      header: "Đơn giá",
      align: "right",
      render: (item) => (
        <span className="font-medium text-text-secondary text-xs">
          {formatMoney(item.price)}
        </span>
      ),
    },
    {
      key: "quantity",
      header: "SL",
      align: "center",
      render: (item) => (
        <span className="inline-block px-2 py-0.5 rounded bg-surface-muted font-bold text-text-primary text-xs">
          x{item.quantity}
        </span>
      ),
    },
    {
      key: "total",
      header: "Thành tiền",
      align: "right",
      render: (item) => (
        <span className="font-bold text-text-highlight text-xs">
          {formatMoney(item.total)}
        </span>
      ),
    },
  ];

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      <div className="flex items-center gap-2 p-4 border-b border-border bg-surface-muted/40">
        <Package className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-bold text-text-highlight">
          Danh sách Sản phẩm ({items.length})
        </h2>
      </div>

      <DataTable
        columns={columns}
        data={items}
        keyExtractor={(item) => item.id}
        className="!border-0 !rounded-none !shadow-none"
      />

      <div className="p-4 border-t border-border bg-surface-muted/30 space-y-2 text-xs">
        <div className="flex items-center justify-between text-text-secondary">
          <span>Tổng tiền hàng ({items.length} món):</span>
          <span className="font-semibold text-text-primary">{formatMoney(financial.subtotal)}</span>
        </div>

        <div className="flex items-center justify-between text-text-secondary">
          <span>Phí vận chuyển:</span>
          <span className="font-semibold text-text-primary">
            {financial.shippingFee === 0 ? "Miễn phí" : formatMoney(financial.shippingFee)}
          </span>
        </div>

        {financial.discountAmount > 0 && (
          <div className="flex items-center justify-between text-status-success font-medium">
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              <span>Giảm giá ({financial.voucherCode}):</span>
            </span>
            <span className="font-bold">-{formatMoney(financial.discountAmount)}</span>
          </div>
        )}

        <div className="pt-2 border-t border-border flex items-center justify-between text-sm">
          <span className="font-bold text-text-highlight flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-primary" />
            <span>Tổng thanh toán:</span>
          </span>
          <span className="text-base font-extrabold text-primary">
            {formatMoney(financial.totalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}
