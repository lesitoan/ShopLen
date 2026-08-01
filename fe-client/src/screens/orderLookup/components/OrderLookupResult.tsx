"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  Clock,
  Truck,
  Package,
  ShieldCheck,
  MapPin,
  Phone,
  User,
  MessageCircle,
  AlertCircle,
  QrCode,
} from "lucide-react";
import { ORDER_STATUS_STEPS, getActiveStepIndex } from "@/constants/orders";
import type { OrderDetailResponse } from "@/types/order.type";
import Button from "@/components/ui/Button";
import OrderStatusStepper from "@/components/orders/OrderStatusStepper";

interface OrderLookupResultProps {
  order: OrderDetailResponse;
}

export default function OrderLookupResult({ order }: OrderLookupResultProps) {
  const activeStepIndex = getActiveStepIndex(order.orderStatus);
  const currentStepLabel = ORDER_STATUS_STEPS[activeStepIndex]?.label || "Đang xử lý";
  const isCancelled = order.orderStatus === "CANCELLED";

  const fullAddress = [
    order.shippingAddress,
    order.shippingWard,
    order.shippingDistrict,
    order.shippingProvince,
  ]
    .filter(Boolean)
    .join(", ");

  const totalDiscount = (order.discountAmount || 0) + (order.pointsDiscount || 0);

  const formattedCreatedAt = (() => {
    try {
      return new Date(order.createdAt).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return order.createdAt;
    }
  })();

  const isExpired = order.expiresAt
    ? new Date(order.expiresAt).getTime() < Date.now()
    : false;
  const isPaid = order.paymentStatus === "PAID";

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300 text-left">
      <div className="border-0 md:border md:border-border rounded-none md:rounded-xl bg-transparent md:bg-surface p-0 md:p-6 flex flex-col gap-6 shadow-none">
        {/* HEADER SUMMARY */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-text-secondary font-medium">
                Mã đơn hàng:
              </span>
              <span className="text-[16px] font-bold text-secondary tracking-wide">
                #{order.orderCode}
              </span>
            </div>
            <span className="text-[12px] text-text-secondary">
              Ngày đặt: {formattedCreatedAt}
            </span>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {isCancelled ? (
              <span className="bg-red-50 text-red-600 text-[12.5px] font-bold px-3 py-1.5 rounded-full border border-red-200 flex items-center gap-1.5">
                <AlertCircle size={14} />
                <span>Đơn hàng đã bị hủy</span>
              </span>
            ) : (
              <span className="bg-primary-light text-secondary text-[12.5px] font-bold px-3 py-1.5 rounded-full border border-primary/30 flex items-center gap-1.5">
                <Clock size={14} />
                <span>{currentStepLabel}</span>
              </span>
            )}
          </div>
        </div>

        {/* CANCELLED NOTIFICATION */}
        {isCancelled && (
          <div className="border border-red-200 bg-red-50/70 dark:bg-red-950/30 rounded-xl p-4 flex flex-col gap-1 text-[13px] text-red-600 dark:text-red-400">
            <span className="font-bold flex items-center gap-1.5 text-[14px]">
              <AlertCircle size={16} />
              Đơn hàng này đã bị hủy
            </span>
            {order.cancelReason && (
              <p className="text-[12.5px] text-red-600/90 mt-0.5">
                Lý do hủy: {order.cancelReason}
              </p>
            )}
          </div>
        )}

        {/* STEPPER PROGRESS */}
        <OrderStatusStepper orderStatus={order.orderStatus} />

        {/* CUSTOMER & PAYMENT DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="border-[1.5px] border-dashed border-primary rounded-lg bg-background p-4 flex flex-col gap-2.5">
            <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider border-l-4 border-primary pl-2.5">
              Thông tin nhận hàng
            </h3>
            <div className="flex flex-col gap-1.5 text-[13px] text-text-primary">
              <div className="flex items-center gap-2">
                <User size={14} className="text-text-secondary shrink-0" />
                <span className="font-semibold" title={order.customerName}>
                  {order.customerName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-text-secondary shrink-0" />
                <span>{order.customerPhone}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-text-secondary shrink-0 mt-0.5" />
                <span
                  className="text-text-secondary leading-relaxed"
                  title={fullAddress}
                >
                  {fullAddress}
                </span>
              </div>
            </div>
          </div>

          <div className="border-[1.5px] border-dashed border-primary rounded-lg bg-background p-4 flex flex-col gap-2.5">
            <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider border-l-4 border-primary pl-2.5">
              Vận chuyển & Thanh toán
            </h3>
            <div className="flex flex-col gap-1.5 text-[13px] text-text-primary">
              <div className="flex items-center gap-2">
                <Truck size={14} className="text-text-secondary shrink-0" />
                <span>
                  Đơn vị:{" "}
                  <strong className="font-semibold">
                    {order.shippingUnit || "Giao hàng tiêu chuẩn"}
                  </strong>
                </span>
              </div>
              {order.trackingCode && (
                <div className="flex items-center gap-2">
                  <Package size={14} className="text-text-secondary shrink-0" />
                  <span>
                    Mã vận đơn:{" "}
                    <strong className="font-semibold text-secondary" title={order.trackingCode}>
                      {order.trackingCode}
                    </strong>
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-text-secondary shrink-0" />
                <span>
                  Thanh toán:{" "}
                  <strong
                    className={`font-semibold ${
                      isPaid
                        ? "text-emerald-600"
                        : isExpired
                        ? "text-error"
                        : "text-amber-600"
                    }`}
                  >
                    {isPaid
                      ? "VietQR (Đã xác nhận thanh toán)"
                      : isExpired
                      ? "VietQR (Quá hạn thanh toán)"
                      : "VietQR (Chờ thanh toán)"}
                  </strong>
                </span>
              </div>
            </div>

            {!isPaid && !isExpired && !isCancelled && (
              <div className="mt-2 pt-2 border-t border-border/60">
                <Link href={`/thanh-toan/qr/${order.id}`}>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full py-2 text-[12.5px] font-bold rounded-lg justify-center"
                  >
                    <QrCode size={15} />
                    <span>Quét mã QR thanh toán ngay</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ITEMS LIST */}
        <div className="flex flex-col gap-3 pt-2">
          <h3 className="text-[14px] font-bold text-text-primary uppercase tracking-wider border-l-4 border-primary pl-2.5">
            Sản phẩm trong đơn hàng ({order.items.length})
          </h3>

          <div className="border border-border rounded-lg divide-y divide-border/70 overflow-hidden bg-background">
            {order.items.map((item) => {
              const snapshot = item.productSnapshot || {};
              const productName = snapshot.name || "Sản phẩm móc len";
              const productImage =
                snapshot.image || snapshot.images?.[0]?.url || "/logo.png";
              const optionText = snapshot.selectedOptions
                ? snapshot.selectedOptions
                    .map((opt: any) => opt.name || opt.label || opt.code)
                    .join(" • ")
                : "";

              return (
                <div
                  key={item.id}
                  className="p-3.5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-14 h-14 rounded-md border border-border overflow-hidden bg-surface shrink-0">
                      <Image
                        src={productImage}
                        alt={productName}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span
                        className="text-[13.5px] font-bold text-text-primary truncate"
                        title={productName}
                      >
                        {productName}
                      </span>
                      {optionText && (
                        <span
                          className="text-[12px] text-text-secondary truncate"
                          title={optionText}
                        >
                          {optionText}
                        </span>
                      )}
                      <span className="text-[12.5px] text-text-secondary">
                        x{item.quantity}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[14px] font-bold text-secondary">
                      {item.unitPrice.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FINANCIAL SUMMARY */}
        <div className="flex flex-col gap-2 pt-2 border-t border-border text-[13.5px] text-text-secondary">
          <div className="flex justify-between items-center">
            <span>Tạm tính:</span>
            <span className="font-medium text-text-primary">
              {order.subtotal.toLocaleString("vi-VN")}đ
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Phí vận chuyển:</span>
            <span className="font-medium text-text-primary">
              +{order.shippingFee.toLocaleString("vi-VN")}đ
            </span>
          </div>
          {totalDiscount > 0 && (
            <div className="flex justify-between items-center text-emerald-600">
              <span>Giảm giá:</span>
              <span className="font-medium">
                -{totalDiscount.toLocaleString("vi-VN")}đ
              </span>
            </div>
          )}
          <div className="flex justify-between items-center text-[15px] font-bold text-text-primary pt-2 border-t border-border/60">
            <span>Tổng thanh toán:</span>
            <span className="text-secondary text-[17px]">
              {order.totalAmount.toLocaleString("vi-VN")}đ
            </span>
          </div>
        </div>
      </div>

      {/* SUPPORT BANNER */}
      <div className="border border-border rounded-xl bg-primary-light/40 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="text-[13px] text-text-primary">
          Cần hỗ trợ về đơn hàng <strong>#{order.orderCode}</strong>? Liên hệ ngay
          với Tiệm Len Nhà Kiều.
        </div>
        <Link
          href="/lien-he"
          className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg text-[13.5px] font-semibold flex items-center justify-center gap-1.5 w-full sm:w-fit shrink-0 transition-colors"
        >
          <MessageCircle size={15} />
          <span>Liên hệ hỗ trợ</span>
        </Link>
      </div>
    </div>
  );
}
