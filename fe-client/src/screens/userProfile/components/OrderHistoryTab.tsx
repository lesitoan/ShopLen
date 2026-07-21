"use client";

import React, { useState } from "react";
import { PackageCheck } from "lucide-react";
import { OrderSummary, OrderStatus } from "../types";
import OrderCard from "./OrderCard";

interface OrderHistoryTabProps {
  orders: OrderSummary[];
  onReorder?: (orderCode: string) => void;
}

export default function OrderHistoryTab({ orders, onReorder }: OrderHistoryTabProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>("ALL");

  const filterTabs: { id: OrderStatus; label: string }[] = [
    { id: "ALL", label: "Tất cả" },
    { id: "PENDING", label: "Chờ xác nhận" },
    { id: "SHIPPING", label: "Đang giao" },
    { id: "DELIVERED", label: "Đã giao" },
    { id: "CANCELLED", label: "Đã hủy" },
  ];

  const filteredOrders = orders.filter((ord) => {
    if (selectedStatus === "ALL") return true;
    return ord.status === selectedStatus;
  });

  return (
    <div className="bg-transparent border-0 p-0 sm:bg-surface sm:border sm:border-border sm:rounded-xl sm:p-6 flex flex-col gap-6 text-left">
      <div className="hidden md:block">
        <h2 className="text-[18px] font-bold text-text-primary">
          Đơn hàng của tôi
        </h2>
        <p className="text-[12.5px] text-text-secondary mt-1">
          Theo dõi trạng thái tất cả các đơn hàng bạn đã mua tại Tiệm Len Nhà Kiều
        </p>
      </div>

      <div className="flex items-center gap-6 overflow-x-auto no-scrollbar border-b border-border/60">
        {filterTabs.map((tab) => {
          const isActive = selectedStatus === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedStatus(tab.id)}
              className={`py-3 text-[13.5px] font-semibold whitespace-nowrap transition-all border-b-2 -mb-px ${
                isActive
                  ? "border-primary text-secondary font-bold"
                  : "border-transparent text-text-secondary hover:text-text-primary"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="py-12 text-center flex flex-col items-center justify-center gap-3">
          <PackageCheck size={40} className="text-text-secondary/40" />
          <span className="text-[13.5px] text-text-secondary">
            Không tìm thấy đơn hàng nào ở trạng thái này
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onReorder={onReorder || ((code) => console.log("Reorder:", code))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
