"use client";

import React from "react";
import Image from "next/image";
import { User, Edit2, Trash2, KeyRound } from "lucide-react";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Switch } from "@/components/ui/Switch";
import type { AdminUserItem, UserRole } from "@/types/staff.type";
import { ROLE_NAME_MAP } from "../constants";

interface StaffTableProps {
  data: AdminUserItem[];
  totalItems?: number;
  page?: number;
  pageSize?: number;
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
  onEdit: (staff: AdminUserItem) => void;
  onDelete: (staff: AdminUserItem) => void;
  onUpdatePassword: (staff: AdminUserItem) => void;
  onToggleStatus: (id: string, currentStatus: string) => void;
  onViewPermissions: () => void;
}

export function StaffTable({
  data,
  totalItems = 0,
  page = 1,
  pageSize = 10,
  isLoading = false,
  onPageChange,
  onEdit,
  onDelete,
  onUpdatePassword,
  onToggleStatus,
}: StaffTableProps) {
  const getRoleBadge = (role: UserRole, roleName?: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return (
          <Badge variant="danger" dot>
            Super Admin
          </Badge>
        );
      case "ADMIN":
        return (
          <Badge variant="success" dot>
            Admin
          </Badge>
        );
      case "STAFF_ORDER":
        return (
          <Badge variant="info" dot>
            CTV check đơn
          </Badge>
        );
      case "STAFF_CONTENT":
        return (
          <Badge variant="warning" dot>
            CTV đăng bài
          </Badge>
        );
      default:
        return (
          <Badge variant="neutral">
            {roleName || ROLE_NAME_MAP[role] || "Nhân viên"}
          </Badge>
        );
    }
  };

  const columns: Column<AdminUserItem>[] = [
    {
      key: "staffInfo",
      header: "Nhân viên",
      align: "left",
      width: "22%",
      render: (staff) => {
        const displayName = staff.fullName || staff.name || "Nhân viên";
        return (
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full bg-surface-muted border border-border overflow-hidden shrink-0 flex items-center justify-center font-bold text-primary text-xs">
              {staff.avatar ? (
                <Image
                  src={staff.avatar}
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
              <div
                className="font-bold text-text-primary text-xs tracking-tight hover:text-primary transition-colors block truncate"
                title={displayName}
              >
                {displayName}
              </div>
              <div className="text-[11px] font-mono text-primary font-semibold mt-0.5">
                {staff.code}
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
      width: "18%",
      render: (staff) => (
        <span
          className="text-xs text-text-secondary truncate block"
          title={staff.email}
        >
          {staff.email}
        </span>
      ),
    },
    {
      key: "phone",
      header: "Số điện thoại",
      align: "left",
      width: "13%",
      render: (staff) =>
        staff.phone ? (
          <span className="text-xs font-mono text-text-primary">
            {staff.phone}
          </span>
        ) : (
          <span className="text-xs text-text-muted italic">Chưa cập nhật</span>
        ),
    },
    {
      key: "role",
      header: "Vai trò / Chức vụ",
      align: "left",
      width: "15%",
      render: (staff) => getRoleBadge(staff.role, staff.roleName),
    },
    {
      key: "lastLoginAt",
      header: "Đăng nhập gần nhất",
      align: "left",
      width: "14%",
      render: (staff) => (
        <span className="text-xs text-text-muted">
          {staff.lastLoginAt
            ? new Date(staff.lastLoginAt).toLocaleString("vi-VN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Chưa đăng nhập"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      align: "left",
      width: "10%",
      render: (staff) =>
        staff.status === "ACTIVE" ? (
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
      header: "Thao tác",
      align: "right",
      width: "8%",
      render: (staff) => (
        <div className="flex items-center justify-end gap-1">
          <Switch
            checked={staff.status === "ACTIVE"}
            onChange={() => onToggleStatus(staff.id, staff.status)}
            size="sm"
          />

          <button
            type="button"
            onClick={() => onUpdatePassword(staff)}
            className="p-1.5 rounded-lg text-text-muted hover:text-status-warning hover:bg-status-warning/10 transition-colors"
            title="Đổi mật khẩu"
          >
            <KeyRound className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onEdit(staff)}
            className="p-1.5 rounded-lg text-text-muted hover:text-primary hover:bg-surface-hover transition-colors"
            title="Chỉnh sửa thông tin nhân viên"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(staff)}
            className="p-1.5 rounded-lg text-text-muted hover:text-status-danger hover:bg-status-danger/10 transition-colors"
            title="Xóa nhân viên"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        keyExtractor={(staff) => staff.id}
        pagination={
          onPageChange && totalItems > 0
            ? {
                currentPage: page,
                totalPages: Math.ceil(totalItems / pageSize) || 1,
                totalItems,
                pageSize,
                onPageChange,
              }
            : undefined
        }
        emptyMessage="Không tìm thấy nhân viên nào phù hợp"
      />
    </div>
  );
}
