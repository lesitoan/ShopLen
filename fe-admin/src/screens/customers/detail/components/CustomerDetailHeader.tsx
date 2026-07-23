"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Lock, Unlock, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CustomerListItem } from "../../list/constants";

interface CustomerDetailHeaderProps {
  customer: CustomerListItem;
  onOpenAddPointsModal: () => void;
  onOpenToggleLockModal: () => void;
}

export function CustomerDetailHeader({
  customer,
  onOpenAddPointsModal,
  onOpenToggleLockModal,
}: CustomerDetailHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Link
          href="/customers"
          className="p-2 rounded-lg bg-surface border border-border text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
          title="Quay lại danh sách khách hàng"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-text-highlight tracking-tight" title={customer.name}>
              {customer.name}
            </h1>
            <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
              {customer.code}
            </span>
            {customer.status === "ACTIVE" ? (
              <Badge variant="success" dot>
                Hoạt động
              </Badge>
            ) : (
              <Badge variant="danger" dot>
                Tạm khóa
              </Badge>
            )}
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Hồ sơ chi tiết & lịch sử mua hàng của khách hàng
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <Button
          variant="outline"
          size="sm"
          leftIcon={<PlusCircle className="w-4 h-4" />}
          onClick={onOpenAddPointsModal}
        >
          Cộng điểm thưởng
        </Button>

        <Button
          variant={customer.status === "ACTIVE" ? "danger" : "primary"}
          size="sm"
          leftIcon={customer.status === "ACTIVE" ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          onClick={onOpenToggleLockModal}
        >
          {customer.status === "ACTIVE" ? "Khóa tài khoản" : "Mở khóa tài khoản"}
        </Button>
      </div>
    </div>
  );
}
