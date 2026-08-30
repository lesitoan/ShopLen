"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, User } from "lucide-react";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Switch } from "@/components/ui/Switch";
import type {
  AdminCustomerListItem,
  CustomerStatus,
} from "@/types/customer.type";

interface CustomerTableProps {
  customers: AdminCustomerListItem[];
  totalItems: number;
  page: number;
  pageSize: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onToggleStatus: (customerId: string, currentStatus: CustomerStatus) => void;
}

export function CustomerTable({
  customers,
  totalItems,
  page,
  pageSize,
  isLoading = false,
  onPageChange,
  onToggleStatus,
}: CustomerTableProps) {
  const columns: Column<AdminCustomerListItem>[] = [
    {
      key: "customerInfo",
      header: "Khách hàng",
      align: "left",
      width: "25%",
      render: (customer) => {
        const displayName = customer.fullName || customer.name || "Khách hàng";
        return (
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full bg-surface-muted border border-border overflow-hidden shrink-0 flex items-center justify-center font-bold text-primary text-xs">
              {customer.avatar ? (
                <Image
                  src={customer.avatar}
                  alt={displayName}
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
                title={displayName}
                className="font-bold text-text-primary text-xs tracking-tight hover:text-primary transition-colors block truncate"
              >
                {displayName}
              </Link>
              <div className="text-[11px] font-mono text-primary font-semibold mt-0.5">
                {customer.code}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: "email",
      header: "Email",
      align: "left",
      width: "20%",
      render: (customer) => (
        <span
          className="text-xs text-text-secondary truncate block"
          title={customer.email}
        >
          {customer.email}
        </span>
      ),
    },
    {
      key: "phone",
      header: "Số điện thoại",
      align: "left",
      width: "14%",
      render: (customer) =>
        customer.phone ? (
          <span className="text-xs font-mono text-text-primary">
            {customer.phone}
          </span>
        ) : (
          <span className="text-xs text-text-muted italic">Chưa cập nhật</span>
        ),
    },
    {
      key: "loginSource",
      header: "Nguồn login",
      align: "left",
      width: "14%",
      render: (customer) => {
        const sources: string[] = [];
        if (customer.isManualLogin) sources.push("MANUAL");
        if (customer.isGoogleLogin) sources.push("GOOGLE");

        if (sources.length === 0) {
          return <span className="text-xs text-text-muted italic">—</span>;
        }

        return (
          <span className="text-xs font-mono font-medium text-text-secondary">
            {sources.join(", ")}
          </span>
        );
      },
    },
    {
      key: "createdAt",
      header: "Ngày tham gia",
      align: "left",
      width: "12%",
      render: (customer) => (
        <span className="text-xs text-text-secondary">
          {customer.createdAt
            ? new Date(customer.createdAt).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      align: "left",
      width: "10%",
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
      header: "Hành động",
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
        isLoading={isLoading}
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
