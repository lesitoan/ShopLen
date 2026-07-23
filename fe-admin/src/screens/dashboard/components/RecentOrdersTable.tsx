"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Eye } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Tooltip } from "@/components/ui/Tooltip";
import { ORDER_STATUS_MAP } from "@/constants/orders";
import { RecentOrderItem } from "../constants";

interface RecentOrdersTableProps {
  orders: RecentOrderItem[];
}

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {

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

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-muted text-text-secondary uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-semibold">Mã đơn</th>
                  <th className="px-4 py-3 font-semibold">Khách hàng</th>
                  <th className="px-4 py-3 font-semibold">Tổng tiền</th>
                  <th className="px-4 py-3 font-semibold">Trạng thái</th>
                  <th className="px-4 py-3 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-hover/60 transition-colors">
                    <td className="px-4 py-3 font-semibold text-text-highlight">
                      {order.orderCode}
                      <span className="block text-[10px] font-normal text-text-muted">
                        {order.createdAt}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Tooltip content={order.customerName} position="top">
                        <div className="font-medium text-text-primary truncate max-w-[140px] cursor-default">
                          {order.customerName}
                        </div>
                      </Tooltip>
                      <div className="text-[11px] text-text-muted">{order.phone}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-primary">
                      {order.totalAmount.toLocaleString("vi-VN")}đ
                      <span className="block text-[10px] font-normal text-text-muted">
                        ({order.itemsCount} sản phẩm)
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {(() => {
                        const statusConfig = ORDER_STATUS_MAP[order.status];
                        return (
                          <Badge
                            variant={statusConfig?.variant ?? "neutral"}
                            dot={statusConfig?.dot}
                          >
                            {statusConfig?.label ?? order.status}
                          </Badge>
                        );
                      })()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/orders/${order.id}`}
                        className="p-1.5 rounded bg-surface-hover hover:bg-surface-active text-text-secondary hover:text-text-primary inline-flex items-center justify-center transition-colors"
                        title="Xem chi tiết đơn"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
