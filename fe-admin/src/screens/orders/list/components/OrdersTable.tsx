"use client";

import React from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Tooltip } from "@/components/ui/Tooltip";
import { EmptyState } from "@/components/ui/EmptyState";
import { Loading } from "@/components/ui/Loading";
import { ORDER_STATUS_MAP } from "@/constants/orders";
import type { AdminOrderListItem } from "@/types/order.type";

interface OrdersTableProps {
  orders: AdminOrderListItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  isLoading?: boolean;
  isFetching?: boolean;
  isError?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function OrdersTable({
  orders,
  totalCount,
  page,
  pageSize,
  isLoading,
  isFetching,
  isError,
  onPageChange,
  onPageSizeChange,
}: OrdersTableProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const columns: Column<AdminOrderListItem>[] = [
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
            {new Date(order.createdAt).toLocaleString("vi-VN", {
              dateStyle: "short",
              timeStyle: "short",
            })}
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
          <Tooltip content={order.customerName} position="top">
            <div className="font-medium text-text-primary text-xs truncate max-w-[150px] cursor-default">
              {order.customerName}
            </div>
          </Tooltip>
          <div className="text-[11px] text-text-muted font-mono">
            {order.customerPhone}
          </div>
        </div>
      ),
    },
    {
      key: "totalAmount",
      header: "Tổng tiền & Sản phẩm",
      align: "left",
      render: (order) => (
        <div>
          <div className="text-xs font-semibold text-primary">
            {order.totalAmount.toLocaleString("vi-VN")}đ
          </div>
          <div className="text-[10px] font-normal text-text-muted mt-0.5">
            ({order.itemsCount} sản phẩm)
          </div>
        </div>
      ),
    },
    {
      key: "paymentStatus",
      header: "Thanh toán",
      align: "left",
      render: (order) => {
        const isPaid = order.paymentStatus === "PAID";
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${
              isPaid
                ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/30"
                : "bg-amber-950/40 text-amber-400 border-amber-500/30"
            }`}
          >
            {isPaid ? "Đã thanh toán" : "Chờ thanh toán"}
          </span>
        );
      },
    },
    {
      key: "status",
      header: "Trạng thái đơn",
      align: "left",
      render: (order) => {
        const statusConfig = ORDER_STATUS_MAP[order.orderStatus];
        return (
          <Badge
            variant={statusConfig?.variant ?? "neutral"}
            dot={statusConfig?.dot}
          >
            {statusConfig?.label ?? order.orderStatus}
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
      {isLoading || isFetching ? (
        <div className="p-12 flex items-center justify-center">
          <Loading size="md" />
        </div>
      ) : isError ? (
        <div className="p-8">
          <EmptyState message="Không thể tải danh sách đơn hàng" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={orders}
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
      )}
    </div>
  );
}
