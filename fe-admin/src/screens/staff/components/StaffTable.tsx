"use client";

import React from "react";
import Image from "next/image";
import { User, Edit2, Trash2 } from "lucide-react";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Switch } from "@/components/ui/Switch";
import { StaffListItem, StaffRole } from "../constants";

interface StaffTableProps {
  data: StaffListItem[];
  onEdit: (staff: StaffListItem) => void;
  onDelete: (staff: StaffListItem) => void;
  onToggleStatus: (id: string, currentStatus: string) => void;
  onViewPermissions: () => void;
}

export function StaffTable({
  data,
  onEdit,
  onDelete,
  onToggleStatus,
  onViewPermissions,
}: StaffTableProps) {
  const getRoleBadge = (role: StaffRole, roleName?: string) => {
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
            {roleName || "Nhân viên"}
          </Badge>
        );
    }
  };

  const columns: Column<StaffListItem>[] = [
    {
      key: "staffInfo",
      header: "Nhân viên",
      align: "left",
      width: "35%",
      render: (staff) => (
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full bg-surface-muted border border-border overflow-hidden shrink-0 flex items-center justify-center font-bold text-primary text-xs">
            {staff.avatar ? (
              <Image
                src={staff.avatar}
                alt={staff.name}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-text-muted" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-bold text-text-primary text-xs tracking-tight hover:text-primary transition-colors block truncate" title={staff.name}>
              {staff.name}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-text-muted mt-0.5">
              <span className="font-mono text-primary font-semibold">{staff.code}</span>
              <span>• {staff.phone}</span>
              <span className="truncate hidden sm:inline" title={staff.email}>• {staff.email}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Vai trò / Chức vụ",
      align: "left",
      width: "25%",
      render: (staff) => getRoleBadge(staff.role, staff.roleName),
    },
    {
      key: "lastLoginAt",
      header: "Đăng nhập gần nhất",
      align: "left",
      width: "18%",
      render: (staff) => (
        <span className="text-xs text-text-muted">{staff.lastLoginAt}</span>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      align: "left",
      width: "14%",
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
        <div className="flex items-center justify-end gap-1.5">
          <Switch
            checked={staff.status === "ACTIVE"}
            onChange={() => onToggleStatus(staff.id, staff.status)}
            size="sm"
          />

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
        keyExtractor={(staff) => staff.id}
        emptyMessage="Không tìm thấy nhân viên nào phù hợp"
      />
    </div>
  );
}
