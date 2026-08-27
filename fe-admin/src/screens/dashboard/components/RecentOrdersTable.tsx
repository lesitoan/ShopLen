"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Eye } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Tooltip } from "@/components/ui/Tooltip";
import { EmptyState } from "@/components/ui/EmptyState";
import { Loading } from "@/components/ui/Loading";
import { ORDER_STATUS_MAP } from "@/constants/orders";
import { useListOrdersQuery } from "@/services/api/orderApi";
import type { AdminOrderListItem } from "@/types/order.type";

export function RecentOrdersTable() {
  const { data, isLoading, isFetching, isError } = useListOrdersQuery({
    limit: 10,
  });

  const columns: Column<AdminOrderListItem>[] = [
    {
      key: "orderCode",
      header: "Mã đơn",
      render: (order) => (
        <div>
          <span className="font-semibold text-text-highlight block">
            {order.orderCode}
          </span>
          <span className="text-[10px] font-normal text-text-muted">
            {new Date(order.createdAt).toLocaleDateString("vi-VN")}
          </span>
        </div>
      ),
    },
    {
      key: "customerName",
      header: "Khách hàng",
      render: (order) => (
        <div>
          <Tooltip content={order.customerName} position="top">
            <div className="font-medium text-text-primary truncate max-w-[140px] cursor-default">
              {order.customerName}
            </div>
          </Tooltip>
          <div className="text-[11px] text-text-muted">{order.customerPhone}</div>
        </div>
      ),
    },
    {
      key: "totalAmount",
      header: "Tổng tiền",
      render: (order) => (
        <div>
          <span className="font-semibold text-primary block">
            {order.totalAmount.toLocaleString("vi-VN")}đ
          </span>
          <span className="text-[10px] font-normal text-text-muted">
            ({order.itemsCount} sản phẩm)
          </span>
        </div>
      ),
    },
    {
      key: "orderStatus",
      header: "Trạng thái",
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
        <Link
          href={`/orders/${order.id}`}
          className="p-1.5 rounded bg-surface-hover hover:bg-primary/15 text-text-secondary hover:text-primary inline-flex items-center justify-center transition-colors"
          title="Xem chi tiết đơn"
        >
          <Eye className="w-3.5 h-3.5" />
        </Link>
      ),
    },
  ];

  const orders = data?.items || [];

  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Đơn hàng gần đây</CardTitle>
          <Link
            href="/orders"
            className="text-xs font-semibold text-primary hover:text-primary-hover inline-flex items-center gap-1 transition-colors"
          >
            Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </CardHeader>

        <CardContent className="p-0 border-t-0">
          {isLoading || isFetching ? (
            <div className="p-8 flex items-center justify-center">
              <Loading size="md" />
            </div>
          ) : isError ? (
            <div className="p-6">
              <EmptyState message="Không thể tải danh sách đơn hàng gần đây" />
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={orders}
              keyExtractor={(item) => item.id}
              className="border-0 shadow-none rounded-none border-t border-border"
            />
          )}
        </CardContent>
      </div>
    </Card>
  );
}
