"use client";

import React from "react";
import { DollarSign, ShoppingBag, QrCode, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Loading } from "@/components/ui/Loading";
import { useGetDashboardSummaryQuery } from "@/services/api/analyticsApi";

type StatType = "REVENUE" | "NEW_ORDERS" | "PENDING_PAYMENT" | "NEW_CUSTOMERS";

export function QuickStatCards() {
  const { data: summary, isLoading, isError } = useGetDashboardSummaryQuery();

  if (isError) {
    return (
      <Card className="p-6 border border-border bg-surface">
        <EmptyState message="Không thể tải dữ liệu chỉ số tổng quan hôm nay" />
      </Card>
    );
  }

  if (isLoading || !summary) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <Card
            key={i}
            className="p-6 flex items-center justify-center min-h-[96px] bg-surface"
          >
            <Loading size="md" />
          </Card>
        ))}
      </div>
    );
  }

  const statItems: {
    id: string;
    title: string;
    value: string;
    type: StatType;
  }[] = [
    {
      id: "stat_revenue",
      title: "Doanh thu hôm nay (đ)",
      value: summary.revenueToday.toLocaleString("vi-VN"),
      type: "REVENUE",
    },
    {
      id: "stat_new_orders",
      title: "Đơn hàng mới (đơn)",
      value: summary.newOrdersToday.toLocaleString("vi-VN"),
      type: "NEW_ORDERS",
    },
    {
      id: "stat_pending_payment",
      title: "Chờ thanh toán (đơn)",
      value: summary.pendingPaymentOrders.toLocaleString("vi-VN"),
      type: "PENDING_PAYMENT",
    },
    {
      id: "stat_new_customers",
      title: "Khách hàng mới (khách)",
      value: summary.newCustomersToday.toLocaleString("vi-VN"),
      type: "NEW_CUSTOMERS",
    },
  ];

  const getCardStyle = (type: StatType) => {
    switch (type) {
      case "REVENUE":
        return {
          icon: DollarSign,
          boxClass:
            "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30",
          cardClass:
            "bg-gradient-to-br from-surface via-surface to-emerald-950/25 border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-300",
        };
      case "NEW_ORDERS":
        return {
          icon: ShoppingBag,
          boxClass:
            "bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg shadow-blue-500/30",
          cardClass:
            "bg-gradient-to-br from-surface via-surface to-blue-950/25 border-blue-500/30 hover:border-blue-500/50 transition-all duration-300",
        };
      case "PENDING_PAYMENT":
        return {
          icon: QrCode,
          boxClass:
            "bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-500/30",
          cardClass:
            "bg-gradient-to-br from-surface via-surface to-amber-950/25 border-amber-500/30 hover:border-amber-500/50 transition-all duration-300",
        };
      case "NEW_CUSTOMERS":
        return {
          icon: Users,
          boxClass:
            "bg-gradient-to-br from-purple-400 to-purple-600 text-white shadow-lg shadow-purple-500/30",
          cardClass:
            "bg-gradient-to-br from-surface via-surface to-purple-950/25 border-purple-500/30 hover:border-purple-500/50 transition-all duration-300",
        };
      default:
        return {
          icon: DollarSign,
          boxClass:
            "bg-gradient-to-br from-primary to-emerald-600 text-white shadow-lg shadow-primary/30",
          cardClass:
            "bg-gradient-to-br from-surface via-surface to-emerald-950/25 border-border transition-all duration-300",
        };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {statItems.map((item) => {
        const { icon: Icon, boxClass, cardClass } = getCardStyle(item.type);

        return (
          <Card key={item.id} className={`relative overflow-hidden ${cardClass}`}>
            <div className="flex items-start justify-between p-1">
              <div>
                <p className="text-xs font-medium text-text-secondary mb-1">
                  {item.title}
                </p>
                <h3 className="text-2xl font-bold text-text-highlight tracking-tight">
                  {item.value}
                </h3>
              </div>
              <div className={`p-2.5 rounded-md ${boxClass}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
