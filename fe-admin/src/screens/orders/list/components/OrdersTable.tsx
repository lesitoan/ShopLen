"use client";

import React from "react";
import Link from "next/link";
import { Eye, ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Tooltip } from "@/components/ui/Tooltip";
import { Pagination } from "@/components/ui/Pagination";
import { ORDER_STATUS_MAP } from "@/constants/orders";
import { OrderListItem } from "../constants";

interface OrdersTableProps {
  orders: OrderListItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function OrdersTable({
  orders,
  totalCount,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: OrdersTableProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startIndex = (page - 1) * pageSize;
  const paginatedOrders = orders.slice(startIndex, startIndex + pageSize);

  return (
    <Card className="p-0 overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-muted text-text-secondary uppercase text-[10px] tracking-wider border-b border-border">
              <tr>
                <th className="px-4 py-3 font-semibold">Mã đơn hàng</th>
                <th className="px-4 py-3 font-semibold">Khách hàng</th>
                <th className="px-4 py-3 font-semibold">Sản phẩm & Giá trị</th>
                <th className="px-4 py-3 font-semibold">Thanh toán</th>
                <th className="px-4 py-3 font-semibold">Trạng thái</th>
                <th className="px-4 py-3 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-text-muted">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ShoppingBag className="w-8 h-8 text-text-muted/50" />
                      <p className="text-xs font-medium">Không tìm thấy đơn hàng nào phù hợp</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => {
                  const statusConfig = ORDER_STATUS_MAP[order.status];

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-surface-hover/60 transition-colors"
                    >
                      <td className="px-4 py-3.5 font-semibold text-text-highlight">
                        <Link
                          href={`/orders/${order.id}`}
                          className="hover:text-primary transition-colors font-mono"
                        >
                          {order.orderCode}
                        </Link>
                        <span className="block text-[10px] font-normal text-text-muted mt-0.5">
                          {order.createdAt}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <Tooltip content={order.customerName} position="top">
                          <div className="font-medium text-text-primary truncate max-w-[150px] cursor-default">
                            {order.customerName}
                          </div>
                        </Tooltip>
                        <div className="text-[11px] text-text-muted font-mono">{order.phone}</div>
                      </td>

                      <td className="px-4 py-3.5">
                        <Tooltip content={order.itemsSummary} position="top">
                          <div className="text-text-secondary truncate max-w-[200px] cursor-default">
                            {order.itemsSummary}
                          </div>
                        </Tooltip>
                        <div className="text-xs font-semibold text-primary mt-0.5">
                          {order.totalAmount.toLocaleString("vi-VN")}đ
                          <span className="text-[10px] font-normal text-text-muted ml-1">
                            ({order.itemsCount} món)
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-muted text-text-secondary border border-border">
                          {order.paymentMethod === "BANK_TRANSFER"
                            ? "Chuyển khoản ngân hàng"
                            : order.paymentMethod === "COD" || order.paymentMethod === "CASH_ON_DELIVERY"
                            ? "COD (Tiền mặt)"
                            : order.paymentMethod}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <Badge
                          variant={statusConfig?.variant ?? "neutral"}
                          dot={statusConfig?.dot}
                        >
                          {statusConfig?.label ?? order.status}
                        </Badge>
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/orders/${order.id}`}
                            className="p-1.5 rounded bg-surface-hover hover:bg-surface-active text-text-secondary hover:text-text-primary inline-flex items-center justify-center transition-colors"
                            title="Xem chi tiết đơn"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {totalCount > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-surface-muted/50 border-t border-border text-xs">
            <div className="text-text-muted">
              Hiển thị{" "}
              <span className="font-semibold text-text-primary">
                {startIndex + 1}
              </span>{" "}
              -{" "}
              <span className="font-semibold text-text-primary">
                {Math.min(startIndex + pageSize, totalCount)}
              </span>{" "}
              trên tổng số{" "}
              <span className="font-semibold text-text-primary">{totalCount}</span>{" "}
              đơn hàng
            </div>

            <div className="flex items-center gap-3">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
