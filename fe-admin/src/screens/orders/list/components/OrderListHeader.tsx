"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Download, ShoppingBag } from "lucide-react";

interface OrderListHeaderProps {
  totalCount: number;
  onExportExcel: () => void;
}

export function OrderListHeader({ totalCount, onExportExcel }: OrderListHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-bold text-text-highlight tracking-tight">
            Quản Lý Đơn Hàng
          </h1>
        </div>
        <p className="text-xs text-text-muted mt-1">
          Theo dõi, tìm kiếm, lọc và xử lý toàn bộ đơn hàng của tiệm ({totalCount} đơn hàng)
        </p>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <Button
          variant="primary"
          size="md"
          leftIcon={<Download className="w-4 h-4" />}
          onClick={onExportExcel}
        >
          Xuất Excel
        </Button>
      </div>
    </div>
  );
}
