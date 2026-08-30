"use client";

import React from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { ORDER_STATUS_MAP } from "@/constants/orders";
import type { AdminOrderListItem } from "@/types/order.type";

interface CustomerOrdersTableProps {
  orders: AdminOrderListItem[];
}

export function CustomerOrdersTable({ orders }: CustomerOrdersTableProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);
  };

  const columns: Column<AdminOrderListItem>[] = [
    {
      key: "orderCode",
      header: "Mã đơn hàng",
      align: "left",
      width: "22%",
      render: (ord) => (
        <Link
          href={`/orders/${ord.id}`}
          className="font-mono font-semibold text-primary text-xs hover:underline"
          title={ord.orderCode}
        >
          {ord.orderCode}
        </Link>
      ),
    },
    {
      key: "createdAt",
      header: "Thời gian đặt",
      align: "left",
      width: "22%",
      render: (ord) => (
        <span className="text-xs text-text-muted">
          {ord.createdAt
            ? new Date(ord.createdAt).toLocaleString("vi-VN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "—"}
        </span>
      ),
    },
    {
      key: "itemsCount",
      header: "Số món",
      align: "left",
      width: "16%",
      render: (ord) => (
        <span className="text-xs font-semibold text-text-primary">
          {ord.itemsCount ?? 0} sản phẩm
        </span>
      ),
    },
    {
      key: "totalAmount",
      header: "Tổng tiền",
      align: "left",
      width: "18%",
      render: (ord) => (
        <span className="text-xs font-bold text-text-highlight">
          {formatCurrency(ord.totalAmount)}
        </span>
      ),
    },
    {
      key: "orderStatus",
      header: "Trạng thái",
      align: "left",
      width: "14%",
      render: (ord) => {
        const config = ORDER_STATUS_MAP[ord.orderStatus] || {
          label: ord.orderStatus,
          variant: "info" as const,
          dot: true,
        };
        return (
          <Badge variant={config.variant} dot={config.dot}>
            {config.label}
          </Badge>
        );
      },
    },
    {
      key: "actions",
      header: "Chi tiết",
      align: "right",
      width: "8%",
      render: (ord) => (
        <div className="flex items-center justify-end">
          <Link
            href={`/orders/${ord.id}`}
            className="p-1.5 rounded-lg text-text-muted hover:text-primary hover:bg-primary/15 transition-colors inline-flex items-center justify-center"
            title="Xem chi tiết đơn hàng"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      <DataTable
        columns={columns}
        data={orders}
        keyExtractor={(ord) => ord.id}
        emptyMessage="Khách hàng chưa có đơn hàng nào"
      />
    </div>
  );
}
