"use client";

import React from "react";
import Link from "next/link";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { CustomerOrderHistoryItem } from "../constants";

interface CustomerOrdersTableProps {
  orders: CustomerOrderHistoryItem[];
}

export function CustomerOrdersTable({ orders }: CustomerOrdersTableProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);
  };

  const columns: Column<CustomerOrderHistoryItem>[] = [
    {
      key: "code",
      header: "Mã đơn hàng",
      align: "left",
      width: "25%",
      render: (ord) => (
        <Link
          href={`/orders/${ord.id}`}
          className="font-mono font-semibold text-primary text-xs hover:underline"
          title={ord.code}
        >
          {ord.code}
        </Link>
      ),
    },
    {
      key: "date",
      header: "Thời gian đặt",
      align: "left",
      width: "25%",
      render: (ord) => (
        <span className="text-xs text-text-muted">{ord.date}</span>
      ),
    },
    {
      key: "itemCount",
      header: "Số món",
      align: "left",
      width: "18%",
      render: (ord) => (
        <span className="text-xs font-semibold text-text-primary">
          {ord.itemCount} sản phẩm
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
      key: "status",
      header: "Trạng thái",
      align: "left",
      width: "14%",
      render: (ord) => (
        <Badge variant="success" dot>
          {ord.statusLabel}
        </Badge>
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
