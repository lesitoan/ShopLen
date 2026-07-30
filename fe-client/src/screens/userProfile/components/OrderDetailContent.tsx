"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, User, Phone, CreditCard, ShieldCheck, QrCode, Clock } from "lucide-react";
import LoadingDots from "@/components/ui/LoadingDots";
import Button from "@/components/ui/Button";
import OrderStatusStepper from "./OrderStatusStepper";
import { useGetOrderDetailQuery } from "@/services/api/orderApi";

interface OrderDetailContentProps {
  orderId: string;
}

export default function OrderDetailContent({ orderId }: OrderDetailContentProps) {
  const { data: detail, isLoading, isError } = useGetOrderDetailQuery(orderId, {
    skip: !orderId,
  });

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "đ";
  };

  if (isLoading) {
    return (
      <div className="py-8 text-center flex flex-col items-center justify-center gap-3">
        <LoadingDots size="md" color="bg-primary" />
        <span className="text-[12.5px] text-text-secondary">
          Đang tải chi tiết đơn hàng...
        </span>
      </div>
    );
  }

  if (isError || !detail) {
    return (
      <div className="py-6 text-center text-[12.5px] text-error font-medium">
        Không thể tải thông tin chi tiết đơn hàng. Vui lòng thử lại.
      </div>
    );
  }

  const latestPayment = detail.payments?.[0];
  const paymentCreatedAt = latestPayment?.createdAt || detail.createdAt;
  const paymentCreatedTime = new Date(paymentCreatedAt).getTime();
  const expiresAtTime = detail.expiresAt
    ? new Date(detail.expiresAt).getTime()
    : paymentCreatedTime + 15 * 60 * 1000;

  const isExpired = Date.now() > expiresAtTime;
  const isPendingPayment = detail.paymentStatus !== "PAID";

  return (
    <div className="flex flex-col gap-4 text-left pt-3">
      <OrderStatusStepper orderStatus={detail.orderStatus} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div className="bg-background/60 dark:bg-background/30 border border-border/60 rounded-xl p-3.5 flex flex-col gap-2 text-[12.5px]">
          <h4 className="font-bold text-text-primary border-b border-border/40 pb-1.5 flex items-center gap-1.5">
            <User size={14} className="text-secondary" />
            <span>Thông tin người nhận</span>
          </h4>
          <div className="flex items-center gap-2">
            <span className="text-text-secondary">Họ tên:</span>
            <span className="font-semibold text-text-primary">{detail.customerName}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-text-secondary">Điện thoại:</span>
            <span className="font-semibold text-text-primary">{detail.customerPhone}</span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin size={14} className="text-text-secondary shrink-0 mt-0.5" />
            <span className="text-text-primary font-medium">{detail.shippingAddress}</span>
          </div>
        </div>

        <div className="bg-background/60 dark:bg-background/30 border border-border/60 rounded-xl p-3.5 flex flex-col gap-2 text-[12.5px]">
          <h4 className="font-bold text-text-primary border-b border-border/40 pb-1.5 flex items-center gap-1.5">
            <CreditCard size={14} className="text-secondary" />
            <span>Thanh toán & Vận chuyển</span>
          </h4>
          <div className="flex justify-between">
            <span className="text-text-secondary">Hình thức:</span>
            <span className="font-semibold text-text-primary">Chuyển khoản (VietQR / SePay)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Trạng thái TT:</span>
            <span
              className={`font-bold ${
                detail.paymentStatus === "PAID"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : isExpired
                  ? "text-error"
                  : "text-amber-600 dark:text-amber-400"
              }`}
            >
              {detail.paymentStatus === "PAID"
                ? "Đã thanh toán"
                : isExpired
                ? "Quá hạn thanh toán"
                : "Chờ thanh toán"}
            </span>
          </div>
          {isPendingPayment && (
            <div className="pt-1">
              {isExpired ? (
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="w-full py-1.5 text-[12px] font-bold rounded-lg justify-center border-error/40 text-error bg-error/5 cursor-not-allowed"
                >
                  <Clock size={14} />
                  <span>Quá hạn thanh toán</span>
                </Button>
              ) : (
                <Link href={`/thanh-toan/qr/${detail.id}`}>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full py-1.5 text-[12px] font-bold rounded-lg justify-center"
                  >
                    <QrCode size={14} />
                    <span>Quét mã QR thanh toán ngay</span>
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-background/60 dark:bg-background/30 border border-border/60 rounded-xl p-3.5 flex flex-col gap-2 text-[12.5px]">
        <h4 className="font-bold text-text-primary border-b border-border/40 pb-2">
          Danh sách sản phẩm ({detail.items.length})
        </h4>

        <div className="flex flex-col gap-2.5 divide-y divide-border/30">
          {detail.items.map((it) => {
            const snapshot = it.productSnapshot || {};
            const catName =
              typeof snapshot.category === "object"
                ? snapshot.category?.name
                : snapshot.category;

            return (
              <div key={it.id} className="pt-2 first:pt-0 flex items-center justify-between gap-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-border/60 shrink-0 bg-surface">
                  <Image
                    src={snapshot.image || snapshot.images?.[0]?.url || "/logo.png"}
                    alt={snapshot.name || "Sản phẩm"}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-text-primary text-[12.5px] truncate" title={snapshot.name}>
                    {snapshot.name || "Sản phẩm"}
                  </h5>
                  <p className="text-[11px] text-text-secondary mt-0.5">
                    {catName ? `${catName} • ` : ""}SL: {it.quantity} x {formatPrice(it.unitPrice)}
                  </p>
                </div>
                <span className="font-bold text-secondary text-[13px] shrink-0">
                  {formatPrice(it.totalPrice)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-surface border border-border/80 rounded-xl p-3.5 flex flex-col gap-1.5 text-[12.5px]">
        <div className="flex justify-between text-text-secondary">
          <span>Tạm tính</span>
          <span className="font-semibold text-text-primary">{formatPrice(detail.subtotal)}</span>
        </div>
        <div className="flex justify-between text-text-secondary">
          <span>Phí vận chuyển</span>
          <span className="font-semibold text-text-primary">{formatPrice(detail.shippingFee)}</span>
        </div>
        {detail.discountAmount > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span>Giảm giá</span>
            <span className="font-semibold">-{formatPrice(detail.discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between items-center border-t border-border/60 pt-2 mt-1">
          <span className="font-bold text-text-primary text-[13.5px]">Tổng thanh toán</span>
          <span className="font-bold text-secondary text-[16px]">{formatPrice(detail.totalAmount)}</span>
        </div>
      </div>
    </div>
  );
}
