import React from "react";
import Image from "next/image";
import { Check, Clock, Truck, Package, ShieldCheck, MapPin, Phone, User, MessageCircle } from "lucide-react";
import { OrderDetail, ORDER_STATUS_STEPS } from "../constants";
import Link from "next/link";

interface OrderLookupResultProps {
  order: OrderDetail;
}

export default function OrderLookupResult({ order }: OrderLookupResultProps) {
  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="border-0 md:border md:border-border rounded-none md:rounded-xl bg-transparent md:bg-surface p-0 md:p-6 flex flex-col gap-6 shadow-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-text-secondary font-medium">Mã đơn hàng:</span>
              <span className="text-[16px] font-bold text-secondary tracking-wide">#{order.orderCode}</span>
            </div>
            <span className="text-[12px] text-text-secondary">Ngày đặt: {order.createdAt}</span>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="bg-primary-light text-secondary text-[12.5px] font-bold px-3 py-1.5 rounded-full border border-primary/30 flex items-center gap-1.5">
              <Clock size={14} />
              <span>{ORDER_STATUS_STEPS.find((s) => s.step === order.currentStep)?.label}</span>
            </span>
          </div>
        </div>

        <div className="w-full py-2">
          <div className="hidden md:grid grid-cols-5 gap-2 relative">
            <div className="absolute top-[18px] left-[10%] right-[10%] h-[3px] bg-border -z-0">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${((order.currentStep - 1) / (ORDER_STATUS_STEPS.length - 1)) * 100}%` }}
              />
            </div>

            {ORDER_STATUS_STEPS.map((step) => {
              const isCompleted = step.step <= order.currentStep;
              const isCurrent = step.step === order.currentStep;

              return (
                <div key={step.step} className="flex flex-col items-center text-center gap-2 z-10">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold transition-all ${
                      isCurrent
                        ? "bg-primary text-white ring-4 ring-primary-light"
                        : isCompleted
                        ? "bg-primary text-white"
                        : "bg-surface border-2 border-border text-text-secondary"
                    }`}
                  >
                    {isCompleted ? <Check size={16} /> : step.step}
                  </div>
                  <div className="flex flex-col gap-0.5 max-w-[120px]">
                    <span
                      className={`text-[12.5px] font-bold ${
                        isCurrent ? "text-secondary" : isCompleted ? "text-text-primary" : "text-text-secondary"
                      }`}
                    >
                      {step.label}
                    </span>
                    <span className="text-[11px] text-text-secondary leading-tight hidden lg:block">
                      {step.desc}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex md:hidden flex-col gap-3">
            {ORDER_STATUS_STEPS.map((step) => {
              const isCompleted = step.step <= order.currentStep;
              const isCurrent = step.step === order.currentStep;

              return (
                <div key={step.step} className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 ${
                      isCurrent
                        ? "bg-primary text-white ring-2 ring-primary-light"
                        : isCompleted
                        ? "bg-primary text-white"
                        : "bg-surface border border-border text-text-secondary"
                    }`}
                  >
                    {isCompleted ? <Check size={14} /> : step.step}
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-[13px] font-bold ${
                        isCurrent ? "text-secondary" : isCompleted ? "text-text-primary" : "text-text-secondary"
                      }`}
                    >
                      {step.label}
                    </span>
                    <span className="text-[11.5px] text-text-secondary">{step.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="border border-border rounded-lg bg-background p-4 flex flex-col gap-2.5">
            <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider border-l-4 border-primary pl-2.5">
              Thông tin nhận hàng
            </h3>
            <div className="flex flex-col gap-1.5 text-[13px] text-text-primary">
              <div className="flex items-center gap-2">
                <User size={14} className="text-text-secondary shrink-0" />
                <span className="font-semibold">{order.customerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-text-secondary shrink-0" />
                <span>{order.phone}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-text-secondary shrink-0 mt-0.5" />
                <span className="text-text-secondary leading-relaxed">{order.shippingAddress}</span>
              </div>
            </div>
          </div>

          <div className="border border-border rounded-lg bg-background p-4 flex flex-col gap-2.5">
            <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider border-l-4 border-primary pl-2.5">
              Vận chuyển & Thanh toán
            </h3>
            <div className="flex flex-col gap-1.5 text-[13px] text-text-primary">
              <div className="flex items-center gap-2">
                <Truck size={14} className="text-text-secondary shrink-0" />
                <span>Đơn vị: <strong className="font-semibold">{order.shippingUnit}</strong></span>
              </div>
              {order.trackingCode && (
                <div className="flex items-center gap-2">
                  <Package size={14} className="text-text-secondary shrink-0" />
                  <span>Mã vận đơn: <strong className="font-semibold text-secondary">{order.trackingCode}</strong></span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-text-secondary shrink-0" />
                <span>Thanh toán: <strong className="font-semibold text-emerald-600">VietQR (Đã xác nhận)</strong></span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <h3 className="text-[14px] font-bold text-text-primary uppercase tracking-wider border-l-4 border-primary pl-2.5">
            Sản phẩm trong đơn hàng ({order.items.length})
          </h3>

          <div className="border border-border rounded-lg divide-y divide-border/70 overflow-hidden bg-background">
            {order.items.map((item) => (
              <div key={item.id} className="p-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-14 h-14 rounded-md border border-border overflow-hidden bg-surface shrink-0">
                    <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13.5px] font-bold text-text-primary truncate">{item.name}</span>
                    {item.variant && <span className="text-[12px] text-text-secondary">{item.variant}</span>}
                    <span className="text-[12.5px] text-text-secondary">x{item.quantity}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[14px] font-bold text-secondary">
                    {item.price.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2 border-t border-border text-[13.5px] text-text-secondary">
          <div className="flex justify-between items-center">
            <span>Tạm tính:</span>
            <span className="font-medium text-text-primary">{order.subtotal.toLocaleString("vi-VN")}đ</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Phí vận chuyển:</span>
            <span className="font-medium text-text-primary">+{order.shippingFee.toLocaleString("vi-VN")}đ</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between items-center text-emerald-600">
              <span>Giảm giá:</span>
              <span className="font-medium">-{order.discount.toLocaleString("vi-VN")}đ</span>
            </div>
          )}
          <div className="flex justify-between items-center text-[15px] font-bold text-text-primary pt-2 border-t border-border/60">
            <span>Tổng thanh toán:</span>
            <span className="text-secondary text-[17px]">{order.total.toLocaleString("vi-VN")}đ</span>
          </div>
        </div>
      </div>

      <div className="border border-border rounded-xl bg-primary-light/40 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="text-[13px] text-text-primary">
          Cần hỗ trợ về đơn hàng <strong>#{order.orderCode}</strong>? Liên hệ ngay với Tiệm Len Nhà Kiều.
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
