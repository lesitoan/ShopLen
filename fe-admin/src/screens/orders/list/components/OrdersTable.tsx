"use client";

import React from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { ORDER_STATUS_MAP } from "@/constants/orders";
import { OrderListItem } from "../constants";

interface OrdersTableProps {
  orders: OrderListItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function OrdersTable({
  orders,
  totalCount,
  page,
  pageSize,
  onPageChange,
}: OrdersTableProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startIndex = (page - 1) * pageSize;
  const paginatedOrders = orders.slice(startIndex, startIndex + pageSize);

  const columns: Column<OrderListItem>[] = [
    {
      key: "orderCode",
      header: "Mã đơn hàng",
      align: "left",
      render: (order) => (
        <div>
          <Link
            href={`/orders/${order.id}`}
            className="font-mono font-bold text-text-highlight hover:text-primary transition-colors text-xs"
          >
            {order.orderCode}
          </Link>
          <span className="block text-[10px] text-text-muted mt-0.5 font-normal">
            {order.createdAt}
          </span>
        </div>
      ),
    },
    {
      key: "customer",
      header: "Khách hàng",
      align: "left",
      render: (order) => (
        <div>
          <div
            title={order.customerName}
            className="font-medium text-text-primary text-xs truncate max-w-[150px]"
          >
            {order.customerName}
          </div>
          <div className="text-[11px] text-text-muted font-mono">{order.phone}</div>
        </div>
      ),
    },
    {
      key: "itemsSummary",
      header: "Sản phẩm & Giá trị",
      align: "left",
      render: (order) => (
        <div>
          <div
            title={order.itemsSummary}
            className="text-text-secondary text-xs truncate max-w-[200px]"
          >
            {order.itemsSummary}
          </div>
          <div className="text-xs font-semibold text-primary mt-0.5">
            {order.totalAmount.toLocaleString("vi-VN")}đ
            <span className="text-[10px] font-normal text-text-muted ml-1">
              ({order.itemsCount} món)
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "payment",
      header: "Thanh toán",
      align: "left",
      render: (order) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-muted text-text-secondary border border-border">
          {order.paymentMethod === "BANK_TRANSFER"
            ? "Chuyển khoản ngân hàng"
            : order.paymentMethod === "COD" || order.paymentMethod === "CASH_ON_DELIVERY"
            ? "COD (Tiền mặt)"
            : order.paymentMethod}
        </span>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      align: "left",
      render: (order) => {
        const statusConfig = ORDER_STATUS_MAP[order.status];
        return (
          <Badge
            variant={statusConfig?.variant ?? "neutral"}
            dot={statusConfig?.dot}
          >
            {statusConfig?.label ?? order.status}
          </Badge>
        );
      },
    },
    {
      key: "actions",
      header: "Thao tác",
      align: "right",
      render: (order) => (
        <div className="flex items-center justify-end">
          <Link
            href={`/orders/${order.id}`}
            className="p-1.5 rounded-lg text-text-muted hover:text-primary hover:bg-primary/15 transition-colors inline-flex items-center justify-center"
            title="Xem chi tiết đơn"
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
        data={paginatedOrders}
        keyExtractor={(order) => order.id}
        className="!border-0 !rounded-none !shadow-none"
        emptyMessage="Không tìm thấy đơn hàng nào phù hợp"
        pagination={{
          currentPage: page,
          totalPages,
          totalItems: totalCount,
          pageSize,
          onPageChange,
        }}
      />
    </div>
  );
}
