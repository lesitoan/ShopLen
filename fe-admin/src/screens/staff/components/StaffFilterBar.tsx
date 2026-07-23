"use client";

import React from "react";
import {
  Search,
  X,
  Users,
  ShieldCheck,
  ShieldAlert,
  ClipboardCheck,
  PenLine,
  CircleDot,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/DropdownMenu";
import {
  StaffFilterState,
  StaffRoleFilter,
  StaffStatusFilter,
  MOCK_ROLES,
} from "../constants";

interface StaffFilterBarProps {
  filters: StaffFilterState;
  onFilterChange: (newFilters: Partial<StaffFilterState>) => void;
}

export function StaffFilterBar({
  filters,
  onFilterChange,
}: StaffFilterBarProps) {
  const roleLabels: Record<StaffRoleFilter, string> = {
    ALL: "Tất cả vai trò",
    SUPER_ADMIN: "Super Admin",
    ADMIN: "Admin",
    STAFF_ORDER: "CTV check đơn",
    STAFF_CONTENT: "CTV đăng bài",
  };

  const statusLabels: Record<StaffStatusFilter, string> = {
    ALL: "Tất cả trạng thái",
    ACTIVE: "Đang hoạt động",
    LOCKED: "Tạm khóa",
  };

  const roleItems: DropdownMenuItem[] = [
    { key: "ALL", label: "Tất cả vai trò", icon: <Users className="w-3.5 h-3.5" /> },
    { key: "SUPER_ADMIN", label: "Super Admin", icon: <ShieldAlert className="w-3.5 h-3.5" /> },
    { key: "ADMIN", label: "Admin", icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { key: "STAFF_ORDER", label: "CTV check đơn", icon: <ClipboardCheck className="w-3.5 h-3.5" /> },
    { key: "STAFF_CONTENT", label: "CTV đăng bài", icon: <PenLine className="w-3.5 h-3.5" /> },
  ];

  const statusItems: DropdownMenuItem[] = [
    { key: "ALL", label: "Tất cả trạng thái", icon: <CircleDot className="w-3.5 h-3.5" /> },
    { key: "ACTIVE", label: "Đang hoạt động", icon: <CheckCircle2 className="w-3.5 h-3.5 text-status-success" /> },
    { key: "LOCKED", label: "Tạm khóa", icon: <Lock className="w-3.5 h-3.5 text-status-danger" /> },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 bg-surface p-4 rounded-xl border border-border">
      <div className="relative flex-1 min-w-[240px] max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          value={filters.searchQuery}
          onChange={(e) => onFilterChange({ searchQuery: e.target.value, page: 1 })}
          placeholder="Tìm theo tên, mã NV, email, SĐT..."
          className="w-full h-[38px] bg-surface-muted text-text-primary placeholder:text-text-muted text-xs rounded-md border border-border pl-9 pr-8 outline-none focus:border-primary transition-colors"
        />
        {filters.searchQuery && (
          <button
            type="button"
            onClick={() => onFilterChange({ searchQuery: "", page: 1 })}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-0.5 rounded"
            title="Xóa tìm kiếm"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <DropdownMenu
        variant="surface"
        triggerIcon={<Users className="w-3.5 h-3.5" />}
        label={roleLabels[filters.roleFilter]}
        selectedKey={filters.roleFilter}
        items={roleItems}
        onSelect={(key) => onFilterChange({ roleFilter: key as StaffRoleFilter, page: 1 })}
      />

      <DropdownMenu
        variant="surface"
        triggerIcon={<CircleDot className="w-3.5 h-3.5" />}
        label={statusLabels[filters.statusFilter]}
        selectedKey={filters.statusFilter}
        items={statusItems}
        onSelect={(key) => onFilterChange({ statusFilter: key as StaffStatusFilter, page: 1 })}
      />
    </div>
  );
}
