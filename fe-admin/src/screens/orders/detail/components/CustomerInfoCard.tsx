"use client";

import React from "react";
import Image from "next/image";
import { User, Phone, Mail, MapPin, MessageSquare, Copy } from "lucide-react";
import { OrderCustomer } from "../constants";

interface CustomerInfoCardProps {
  customer: OrderCustomer;
}

export function CustomerInfoCard({ customer }: CustomerInfoCardProps) {
  const [copiedAddress, setCopiedAddress] = React.useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(customer.address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  return (
    <div className="bg-surface rounded-xl border border-border p-4 space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-bold text-text-highlight">
            Thông tin Khách hàng
          </h2>
        </div>
        <span className="text-[11px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-bold">
          {customer.totalOrdersCount} đơn đã mua
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-11 h-11 rounded-full overflow-hidden border border-border shrink-0 bg-surface-muted">
          {customer.avatar ? (
            <Image
              src={customer.avatar}
              alt={customer.name}
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-bold text-primary text-base">
              {customer.name.charAt(0)}
            </div>
          )}
        </div>

        <div>
          <div className="font-bold text-text-highlight text-sm">
            {customer.name}
          </div>
          <div className="text-xs text-text-muted">Mã KH: {customer.id}</div>
        </div>
      </div>

      <div className="space-y-2.5 text-xs">
        <div className="flex items-center justify-between p-2 rounded-lg bg-surface-muted/40 border border-border/40">
          <div className="flex items-center gap-2 text-text-secondary">
            <Phone className="w-3.5 h-3.5 text-primary" />
            <span className="font-semibold text-text-primary">{customer.phone}</span>
          </div>
          <a
            href={`tel:${customer.phone}`}
            className="text-[11px] font-semibold text-primary hover:underline"
          >
            Gọi điện
          </a>
        </div>

        <div className="flex items-center gap-2 text-text-secondary px-1">
          <Mail className="w-3.5 h-3.5 text-text-muted shrink-0" />
          <span className="truncate">{customer.email}</span>
        </div>

        <div className="pt-2 border-t border-border/60 space-y-1">
          <div className="flex items-center justify-between text-text-muted font-medium text-[11px]">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-status-danger" />
              <span>Địa chỉ nhận hàng:</span>
            </span>
            <button
              onClick={handleCopyAddress}
              className="text-primary hover:underline flex items-center gap-1 text-[10px]"
            >
              <Copy className="w-3 h-3" />
              <span>{copiedAddress ? "Đã chép!" : "Sao chép"}</span>
            </button>
          </div>
          <p className="text-xs text-text-primary font-medium leading-relaxed bg-surface-muted/30 p-2 rounded-lg border border-border/40">
            {customer.address}
          </p>
        </div>

        {customer.note && (
          <div className="pt-2 space-y-1">
            <div className="flex items-center gap-1 text-text-muted font-medium text-[11px]">
              <MessageSquare className="w-3.5 h-3.5 text-status-warning" />
              <span>Ghi chú của khách hàng:</span>
            </div>
            <p className="text-xs text-status-warning bg-status-warning/10 p-2 rounded-lg border border-status-warning/20 italic">
              &quot;{customer.note}&quot;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
