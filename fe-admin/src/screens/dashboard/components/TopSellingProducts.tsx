"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Tooltip } from "@/components/ui/Tooltip";
import { Loading } from "@/components/ui/Loading";
import { EmptyState } from "@/components/ui/EmptyState";
import { useGetTopSellingProductsQuery } from "@/services/api/analyticsApi";

export function TopSellingProducts() {
  const { data, isLoading } = useGetTopSellingProductsQuery({ limit: 5 });
  const products = data?.items || [];

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Top sản phẩm bán chạy</CardTitle>
        <Link
          href="/products"
          className="text-xs font-semibold text-primary hover:text-primary-hover inline-flex items-center gap-1 transition-colors"
        >
          Tất cả <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="py-8">
            <Loading size="md" />
          </div>
        ) : products.length === 0 ? (
          <EmptyState message="Chưa có dữ liệu sản phẩm bán chạy" />
        ) : (
          <div className="divide-y divide-border-subtle">
            {products.map((item, idx) => {
              const categoryName =
                typeof item.category === "object" && item.category
                  ? item.category.name
                  : (item.category as string) || "Chung";

              return (
                <div
                  key={item.id}
                  className="p-3 flex items-center justify-between hover:bg-surface-hover/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="w-5 text-center text-xs font-bold text-text-muted shrink-0">
                      #{item.rank || idx + 1}
                    </span>
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

                  <div className="text-right shrink-0 ml-2">
                    <span className="text-xs font-bold text-primary">
                      {item.soldCount} đã bán
                    </span>
                    <span className="block text-[10px] text-text-muted">
                      {item.revenue.toLocaleString("vi-VN")}đ
                    </span>
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
