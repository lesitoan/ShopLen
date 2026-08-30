"use client";

import React, { useState, useEffect, useMemo } from "react";
import debounce from "debounce";
import {
  Search,
  Users,
  ShieldCheck,
  ShieldAlert,
  ClipboardCheck,
  PenLine,
  CircleDot,
  CheckCircle2,
  Lock,
  RotateCcw,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/DropdownMenu";
import {
  StaffFilterState,
  StaffRoleFilter,
  StaffStatusFilter,
} from "../constants";

interface StaffFilterBarProps {
  filters: StaffFilterState;
  onFilterChange: (newFilters: Partial<StaffFilterState>) => void;
  onResetFilter?: () => void;
}

export function StaffFilterBar({
  filters,
  onFilterChange,
  onResetFilter,
}: StaffFilterBarProps) {
  const currentSearch = filters.search ?? filters.searchQuery ?? "";
  const currentRole = filters.role ?? filters.roleFilter ?? "ALL";
  const currentStatus = filters.status ?? filters.statusFilter ?? "ALL";

  const [searchTerm, setSearchTerm] = useState(currentSearch);

  useEffect(() => {
    setSearchTerm(currentSearch);
  }, [currentSearch]);

  const debouncedSearch = useMemo(
    () => debounce((val: string) => onFilterChange({ search: val }), 500),
    [onFilterChange]
  );

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
    <div className="bg-surface p-4 rounded-xl border border-border space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Tìm theo tên, email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                debouncedSearch(e.target.value);
              }}
              onClear={() => {
                setSearchTerm("");
                onFilterChange({ search: "" });
              }}
              leftIcon={<Search className="w-4 h-4 text-text-muted" />}
              className="h-[38px]"
            />
          </div>

          <DropdownMenu
            variant="surface"
            triggerIcon={<Users className="w-3.5 h-3.5 text-primary" />}
            label={roleLabels[currentRole]}
            selectedKey={currentRole}
            items={roleItems}
            onSelect={(key) => onFilterChange({ role: key as StaffRoleFilter })}
            width="w-48"
          />

          <DropdownMenu
            variant="surface"
            triggerIcon={<CircleDot className="w-3.5 h-3.5 text-primary" />}
            label={statusLabels[currentStatus]}
            selectedKey={currentStatus}
            items={statusItems}
            onSelect={(key) => onFilterChange({ status: key as StaffStatusFilter })}
            width="w-48"
          />
        </div>

        {onResetFilter && (
          <button
            type="button"
            onClick={onResetFilter}
            className="h-[38px] px-3 rounded-md bg-surface-muted hover:bg-surface-hover text-text-secondary hover:text-text-primary border border-border transition-colors flex items-center gap-1.5 text-xs font-medium shrink-0 ml-auto cursor-pointer"
            title="Đặt lại bộ lọc"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại</span>
          </button>
        )}
      </div>
    </div>
  );
}
