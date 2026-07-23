"use client";

import React from "react";
import Image from "next/image";
import { User, Phone, Mail, MapPin, Calendar, CreditCard, ShoppingBag, Award } from "lucide-react";
import { CustomerListItem } from "../../list/constants";

interface CustomerProfileCardProps {
  customer: CustomerListItem;
}

export function CustomerProfileCard({ customer }: CustomerProfileCardProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-xl border border-border p-5 space-y-5">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full bg-surface-muted border-2 border-primary/40 overflow-hidden shrink-0 flex items-center justify-center font-bold text-primary text-xl">
            {customer.avatar ? (
              <Image
                src={customer.avatar}
                alt={customer.name}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-text-muted" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-bold text-text-highlight text-base truncate" title={customer.name}>
              {customer.name}
            </div>
            <div className="text-xs text-text-muted font-mono mt-0.5">
              {customer.code}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border space-y-3 text-xs">
          <div className="flex items-center gap-2.5 text-text-secondary">
            <Phone className="w-4 h-4 text-text-muted shrink-0" />
            <span className="font-mono text-text-primary">{customer.phone}</span>
          </div>
          <div className="flex items-center gap-2.5 text-text-secondary">
            <Mail className="w-4 h-4 text-text-muted shrink-0" />
            <span className="truncate text-text-primary" title={customer.email}>
              {customer.email}
            </span>
          </div>
          <div className="flex items-start gap-2.5 text-text-secondary">
            <MapPin className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
            <span>123 Nguyễn Văn Linh, Phường Tân Phong, Quận 7, TP. Hồ Chí Minh</span>
          </div>
          <div className="flex items-center gap-2.5 text-text-secondary">
            <Calendar className="w-4 h-4 text-text-muted shrink-0" />
            <span>Ngày tham gia: {customer.joinedAt}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface p-3.5 rounded-xl border border-border text-center space-y-1">
          <CreditCard className="w-4 h-4 text-primary mx-auto" />
          <div className="text-[10px] text-text-muted">Tổng chi tiêu</div>
          <div className="text-xs font-bold text-text-highlight">
            {formatCurrency(customer.totalSpent)}
          </div>
        </div>

        <div className="bg-surface p-3.5 rounded-xl border border-border text-center space-y-1">
          <ShoppingBag className="w-4 h-4 text-status-info mx-auto" />
          <div className="text-[10px] text-text-muted">Đơn hoàn thành</div>
          <div className="text-xs font-bold text-text-highlight">
            {customer.totalOrders} đơn
          </div>
        </div>

        <div className="bg-surface p-3.5 rounded-xl border border-border text-center space-y-1">
          <Award className="w-4 h-4 text-status-warning mx-auto" />
          <div className="text-[10px] text-text-muted">Tích điểm</div>
          <div className="text-xs font-bold text-primary">
            {customer.rewardPoints} đ
          </div>
        </div>
      </div>
    </div>
  );
}
