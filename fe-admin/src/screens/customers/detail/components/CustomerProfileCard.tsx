"use client";

import React from "react";
import Image from "next/image";
import { User, Phone, Mail, MapPin, Calendar } from "lucide-react";
import type { AdminCustomerListItem } from "@/types/customer.type";

interface CustomerProfileCardProps {
  customer: AdminCustomerListItem & { name?: string; joinedAt?: string };
}

export function CustomerProfileCard({ customer }: CustomerProfileCardProps) {
  const displayName = customer.fullName || customer.name || "Khách hàng";
  const joinedDate = customer.createdAt
    ? new Date(customer.createdAt).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : customer.joinedAt || "—";

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-xl border border-border p-5 space-y-5">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full bg-surface-muted border-2 border-primary/40 overflow-hidden shrink-0 flex items-center justify-center font-bold text-primary text-xl">
            {customer.avatar ? (
              <Image
                src={customer.avatar}
                alt={displayName}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-text-muted" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div
              className="font-bold text-text-highlight text-base truncate"
              title={displayName}
            >
              {displayName}
            </div>
            <div className="text-xs text-text-muted font-mono mt-0.5">
              {customer.code}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border space-y-3 text-xs">
          <div className="flex items-center gap-2.5 text-text-secondary">
            <Phone className="w-4 h-4 text-text-muted shrink-0" />
            <span className="font-mono text-text-primary">
              {customer.phone || "Chưa cập nhật SĐT"}
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-text-secondary">
            <Mail className="w-4 h-4 text-text-muted shrink-0" />
            <span className="truncate text-text-primary" title={customer.email}>
              {customer.email}
            </span>
          </div>
          <div className="flex items-start gap-2.5 text-text-secondary">
            <MapPin className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
            <span>Chưa có địa chỉ mặc định</span>
          </div>
          <div className="flex items-center gap-2.5 text-text-secondary">
            <Calendar className="w-4 h-4 text-text-muted shrink-0" />
            <span>Ngày tham gia: {joinedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
