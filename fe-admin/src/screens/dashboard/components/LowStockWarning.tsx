"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Tooltip } from "@/components/ui/Tooltip";
import { Loading } from "@/components/ui/Loading";
import { EmptyState } from "@/components/ui/EmptyState";
import { useGetLowStockProductsQuery } from "@/services/api/analyticsApi";

export function LowStockWarning() {
  const { data, isLoading } = useGetLowStockProductsQuery({
    threshold: 5,
    limit: 5,
  });

  const products = data?.items || [];
  const totalCount = data?.total ?? products.length;
  const threshold = data?.threshold ?? 5;

  return (
    <Card className="border-amber-500/30 bg-gradient-to-b from-surface to-amber-950/10">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-status-warning truncate">
          Cảnh báo tồn kho thấp (&lt; {threshold})
        </CardTitle>
        <Badge variant={totalCount > 0 ? "warning" : "success"}>
          {totalCount} sản phẩm
        </Badge>
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="py-8">
            <Loading size="md" />
          </div>
        ) : products.length === 0 ? (
          <EmptyState message="Kho hàng ổn định, không có sản phẩm sắp hết hàng" />
        ) : (
          <div className="divide-y divide-border-subtle">
            {products.map((item) => {
              const categoryName =
                typeof item.category === "object" && item.category
                  ? item.category.name
                  : (item.category as string) || "Chung";

              const isOutOfStock = item.stockLeft === 0;

              return (
                <div
                  key={item.id}
                  className="p-3 flex items-center justify-between gap-2 hover:bg-surface-hover/50 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="min-w-0 flex-1">
                      <Tooltip
                        content={item.name}
                        position="top"
                        className="w-full"
                      >
                        <h4 className="text-xs font-semibold text-text-primary truncate cursor-default">
                          {item.name}
                        </h4>
                      </Tooltip>
                      <span className="text-[11px] text-text-muted truncate block">
                        {categoryName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={isOutOfStock ? "danger" : "danger"} dot>
                      {isOutOfStock ? "Hết hàng" : `Chỉ còn ${item.stockLeft} cái`}
                    </Badge>

                    <Link
                      href={`/products?search=${encodeURIComponent(item.name)}`}
                      className="px-2 py-1 text-[11px] font-bold rounded bg-primary/20 text-primary border border-primary/30 hover:bg-primary hover:text-bg-deep inline-flex items-center gap-1 transition-all whitespace-nowrap shrink-0"
                    >
                      <Plus className="w-3 h-3" /> Nhập hàng
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
