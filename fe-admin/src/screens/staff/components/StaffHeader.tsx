"use client";

import React from "react";
import { Users, Plus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface StaffHeaderProps {
  onOpenPermissionMatrix: () => void;
  onAddStaff: () => void;
}

export function StaffHeader({ onOpenPermissionMatrix, onAddStaff }: StaffHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Users className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-text-highlight tracking-tight">
            Quản Lý Nhân Viên &amp; Phân Quyền
          </h1>
        </div>
        <p className="text-xs text-text-muted mt-1">
          Quản lý tài khoản truy cập, vai trò và phân quyền cho nhân viên vận hành hệ thống
        </p>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <Button
          variant="secondary"
          size="md"
          leftIcon={<ShieldCheck className="w-4 h-4 text-primary" />}
          onClick={onOpenPermissionMatrix}
        >
          Ma trận phân quyền
        </Button>

        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={onAddStaff}
        >
          Thêm nhân viên
        </Button>
      </div>
    </div>
  );
}
