"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, Plus, Package } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Tooltip } from "@/components/ui/Tooltip";
import { LowStockProductItem } from "../constants";

interface LowStockWarningProps {
  products: LowStockProductItem[];
}

export function LowStockWarning({ products }: LowStockWarningProps) {
  return (
    <Card className="border-amber-500/30 bg-gradient-to-b from-surface to-amber-950/10">
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <AlertTriangle className="w-4 h-4 text-status-warning shrink-0" />
          <CardTitle className="text-status-warning truncate">Cảnh báo tồn kho thấp (&lt; 5)</CardTitle>
        </div>
        <Badge variant="warning">{products.length} sản phẩm</Badge>
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y divide-border-subtle">
          {products.map((item) => (
            <div
              key={item.id}
              className="p-3 flex items-center justify-between gap-2 hover:bg-surface-hover/50 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-8 h-8 rounded bg-surface-muted border border-border flex items-center justify-center text-text-muted shrink-0">
                  <Package className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <Tooltip content={item.name} position="top" className="w-full">
                    <h4 className="text-xs font-semibold text-text-primary truncate cursor-default">
                      {item.name}
                    </h4>
                  </Tooltip>
                  <span className="text-[11px] text-text-muted truncate block">{item.category}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="danger" dot>
                  Chỉ còn {item.stockLeft} cái
                </Badge>

                <Link
                  href={`/products`}
                  className="px-2 py-1 text-[11px] font-bold rounded bg-primary/20 text-primary border border-primary/30 hover:bg-primary hover:text-bg-deep inline-flex items-center gap-1 transition-all whitespace-nowrap shrink-0"
                >
                  <Plus className="w-3 h-3" /> Nhập hàng
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
