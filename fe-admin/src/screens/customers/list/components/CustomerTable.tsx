"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, User } from "lucide-react";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Switch } from "@/components/ui/Switch";
import { CustomerListItem, CustomerStatus } from "../constants";

interface CustomerTableProps {
  customers: CustomerListItem[];
  totalItems: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onToggleStatus: (customerId: string, currentStatus: CustomerStatus) => void;
}

export function CustomerTable({
  customers,
  totalItems,
  page,
  pageSize,
  onPageChange,
  onToggleStatus,
}: CustomerTableProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);
  };

  const columns: Column<CustomerListItem>[] = [
    {
      key: "customerInfo",
      header: "Khách hàng",
      align: "left",
      width: "35%",
      render: (customer) => (
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full bg-surface-muted border border-border overflow-hidden shrink-0 flex items-center justify-center font-bold text-primary text-xs">
            {customer.avatar ? (
              <Image
                src={customer.avatar}
                alt={customer.name}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-text-muted" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <Link
              href={`/customers/${customer.id}`}
              className="font-bold text-text-primary text-xs tracking-tight hover:text-primary transition-colors block truncate"
            >
              {customer.name}
            </Link>
            <div className="flex items-center gap-2 text-[11px] text-text-muted mt-0.5">
              <span className="font-mono text-primary font-semibold">{customer.code}</span>
              <span>• {customer.phone}</span>
              <span className="truncate hidden sm:inline">• {customer.email}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "totalSpent",
      header: "Tổng chi tiêu",
      align: "left",
      width: "18%",
      render: (customer) => (
        <div className="font-bold text-xs text-text-highlight">
          {formatCurrency(customer.totalSpent)}
        </div>
      ),
    },
    {
      key: "totalOrders",
      header: "Đơn hàng",
      align: "left",
      width: "14%",
      render: (customer) => (
        <span className="text-xs font-semibold text-text-primary">
          {customer.totalOrders} đơn
        </span>
      ),
    },
    {
      key: "rewardPoints",
      header: "Tích điểm",
      align: "left",
      width: "15%",
      render: (customer) => (
        <span className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
          {customer.rewardPoints} đ
        </span>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      align: "left",
      width: "13%",
      render: (customer) =>
        customer.status === "ACTIVE" ? (
          <Badge variant="success" dot>
            Hoạt động
          </Badge>
        ) : (
          <Badge variant="danger" dot>
            Tạm khóa
          </Badge>
        ),
    },
    {
      key: "actions",
      header: "Chi tiết",
      align: "right",
      width: "5%",
      render: (customer) => (
        <div className="flex items-center justify-end gap-2">
          <Switch
            checked={customer.status === "ACTIVE"}
            onChange={() => onToggleStatus(customer.id, customer.status)}
            size="sm"
          />

          <Link
            href={`/customers/${customer.id}`}
            title="Xem hồ sơ chi tiết"
            className="p-1.5 rounded-lg text-text-muted hover:text-primary hover:bg-surface-muted transition-colors"
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
        data={customers}
        keyExtractor={(customer) => customer.id}
        pagination={{
          currentPage: page,
          totalPages: Math.ceil(totalItems / pageSize) || 1,
          totalItems,
          pageSize,
          onPageChange,
        }}
        emptyMessage="Không tìm thấy khách hàng nào phù hợp"
      />
    </div>
  );
}
