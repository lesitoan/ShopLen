"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Truck, CheckCircle, XCircle, Clock } from "lucide-react";
import Button from "@/components/ui/Button";
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
      <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-border/60 shrink-0 bg-surface">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="56px"
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0 text-left">
        <h4 className="text-[13px] font-semibold text-text-primary truncate">
          {item.name}
        </h4>
        <p className="text-[11.5px] text-text-secondary mt-0.5">
          Phân loại: {item.category} • Số lượng: {item.quantity}
        </p>
      </div>
      <span className="text-[13px] font-bold text-secondary shrink-0">
        {formatPrice(item.price * item.quantity)}
      </span>
    </div>
  );
}

export interface OrderCardProps {
  order: OrderSummary;
  onReorder?: (orderCode: string) => void;
}

export default function OrderCard({ order, onReorder }: OrderCardProps) {
  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "đ";
  };

  const getStatusBadge = (status: OrderStatus, label: string) => {
    switch (status) {
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11.5px] font-semibold">
            <CheckCircle size={13} />
            <span>{label}</span>
          </span>
        );
      case "SHIPPING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11.5px] font-semibold">
            <Truck size={13} />
            <span>{label}</span>
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11.5px] font-semibold">
            <Clock size={13} />
            <span>{label}</span>
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11.5px] font-semibold">
            <XCircle size={13} />
            <span>{label}</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="border border-border/80 rounded-lg p-4 bg-background/30 hover:border-primary/30 transition-all flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-border/50 text-[12.5px]">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-bold text-text-primary">
            Mã đơn: {order.orderCode}
          </span>
          <span className="text-text-secondary/60 hidden sm:inline">•</span>
          <span className="text-text-secondary">{order.createdAt}</span>
        </div>
        <div className="flex items-center shrink-0">
          {getStatusBadge(order.status, order.statusLabel)}
        </div>
      </div>

      <div className="flex flex-col gap-3 py-1">
        {order.items.map((item) => (
          <OrderItemRow key={item.id} item={item} />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border/50">
        <div className="flex items-center gap-1.5 text-[13px]">
          <span className="text-text-secondary font-medium">
            Tổng thanh toán:
          </span>
          <span className="font-bold text-[15px] text-secondary">
            {formatPrice(order.totalAmount)}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
          <Link href={`/thanh-toan/qr/${order.orderCode}`} className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="w-full rounded-lg text-[13px] font-semibold px-3 py-2.5 justify-center"
            >
              Chi tiết
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            className="w-full sm:w-auto rounded-lg text-[13px] font-bold px-3.5 py-2.5 justify-center"
            onClick={() => onReorder && onReorder(order.orderCode)}
          >
            Mua lại
          </Button>
        </div>
      </div>
    </div>
  );
}
