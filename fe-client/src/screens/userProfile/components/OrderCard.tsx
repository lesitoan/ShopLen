"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Truck, CheckCircle, XCircle, Clock, Package, ChevronDown } from "lucide-react";
import Button from "@/components/ui/Button";
import OrderDetailModal from "@/components/modals/OrderDetailModal";
import OrderDetailContent from "./OrderDetailContent";
import { ORDER_STATUS_CONFIG_MAP } from "../constants";
import { OrderSummary, OrderStatus, OrderItem } from "../types";

export interface OrderItemRowProps {
  item: OrderItem;
}

export function OrderItemRow({ item }: OrderItemRowProps) {
  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "đ";
  };

  return (
    <div className="flex gap-3.5 items-center justify-between">
      <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-border/60 shrink-0 bg-surface shadow-xs">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="56px"
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0 text-left">
        <h4
          className="text-[13px] font-bold text-text-primary truncate"
          title={item.name}
        >
          {item.name}
        </h4>
        <p className="text-[11.5px] text-text-secondary mt-0.5">
          Phân loại: {item.category} • Số lượng: {item.quantity}
        </p>
      </div>
      <span className="text-[13.5px] font-bold text-secondary shrink-0">
        {formatPrice(item.price * item.quantity)}
      </span>
    </div>
  );
}

export interface OrderCardProps {
  order: OrderSummary;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export default function OrderCard({
  order,
  isExpanded = false,
  onToggleExpand,
}: OrderCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "đ";
  };

  const handleDetailClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsModalOpen(true);
    } else {
      if (onToggleExpand) {
        onToggleExpand();
      }
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "PENDING_PAYMENT":
        return <Clock size={13} className="animate-pulse" />;
      case "PENDING":
        return <Clock size={13} />;
      case "PACKING":
        return <Package size={13} />;
      case "SHIPPING":
        return <Truck size={13} />;
      case "DELIVERED":
        return <CheckCircle size={13} />;
      case "CANCELLED":
        return <XCircle size={13} />;
      default:
        return null;
    }
  };

  const config = ORDER_STATUS_CONFIG_MAP[order.status] || ORDER_STATUS_CONFIG_MAP.ALL;

  return (
    <>
      <div
        className={`border rounded-xl p-4 md:p-5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col gap-3.5 ${config.cardBgStyle}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-border/40 text-[12.5px]">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-bold text-text-primary">
              Mã đơn:{" "}
              <span
                className="font-mono text-secondary font-bold"
                title={`#${order.orderCode}`}
              >
                #{order.orderCode}
              </span>
            </span>
            <span className="text-text-secondary/40 hidden sm:inline">•</span>
            <span className="text-text-secondary">{order.createdAt}</span>
          </div>
          <div className="flex items-center shrink-0">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] font-bold shadow-2xs ${config.badgeStyle}`}
            >
              {getStatusIcon(order.status)}
              <span>{order.statusLabel}</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3.5 py-1">
          {order.items.map((item) => (
            <OrderItemRow key={item.id} item={item} />
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border/40">
          <div className="flex items-center gap-2 text-[13px]">
            <span className="text-text-secondary font-medium">
              Tổng thanh toán:
            </span>
            <span className="font-bold text-[16px] text-secondary">
              {formatPrice(order.totalAmount)}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto rounded-lg text-[13px] font-semibold px-4 py-2.5 justify-center border-border hover:border-secondary transition-all flex items-center gap-1.5"
              onClick={handleDetailClick}
            >
              <span>{isExpanded ? "Thu gọn" : "Chi tiết"}</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
              />
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="hidden md:block pt-3 border-t border-border/40 animate-in fade-in slide-in-from-top-2 duration-300">
            <OrderDetailContent orderId={order.id} />
          </div>
        )}
      </div>

      <OrderDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        orderId={order.id}
        orderCode={order.orderCode}
      />
    </>
  );
}
