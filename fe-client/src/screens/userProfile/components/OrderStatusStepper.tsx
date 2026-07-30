"use client";

import React from "react";
import { Clock, CheckCircle2, Package, Truck, Check, XCircle } from "lucide-react";

interface OrderStatusStepperProps {
  orderStatus: string;
}

export default function OrderStatusStepper({ orderStatus }: OrderStatusStepperProps) {
  if (orderStatus === "CANCELLED") {
    return (
      <div className="w-full bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl p-3.5 flex items-center gap-3 text-left">
        <div className="w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
          <XCircle size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-[13px] font-bold text-rose-700 dark:text-rose-300">
            Đơn hàng đã hủy
          </span>
          <span className="text-[11.5px] text-rose-600/80 dark:text-rose-400/80">
            Đơn hàng này không còn hiệu lực.
          </span>
        </div>
      </div>
    );
  }

  const steps = [
    { key: "PENDING_PAYMENT", label: "Chờ thanh toán", icon: Clock },
    { key: "PENDING", label: "Chờ xác nhận", icon: CheckCircle2 },
    { key: "PACKING", label: "Chuẩn bị hàng", icon: Package },
    { key: "SHIPPING", label: "Đang giao", icon: Truck },
    { key: "COMPLETED", label: "Đã giao", icon: Check },
  ];

  const getActiveStepIndex = (status: string) => {
    switch (status) {
      case "PENDING_PAYMENT":
        return 0;
      case "PAID":
      case "PENDING":
        return 1;
      case "PACKING":
        return 2;
      case "SHIPPING":
        return 3;
      case "COMPLETED":
      case "DELIVERED":
        return 4;
      default:
        return 0;
    }
  };

  const currentIndex = getActiveStepIndex(orderStatus);

  return (
    <div className="w-full bg-surface/80 dark:bg-surface/40 border border-border/60 rounded-xl p-4 md:p-5">
      <h4 className="text-[12.5px] font-bold text-text-primary mb-4 text-left">
        Hành trình đơn hàng
      </h4>

      {/* MOBILE: STEPPER HÀNG DỌC */}
      <div className="flex flex-col gap-4 md:hidden relative pl-1">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const StepIcon = step.icon;

          return (
            <div key={step.key} className="flex items-center gap-3.5 relative">
              {index < steps.length - 1 && (
                <div
                  className={`absolute left-[17px] top-8 w-0.5 h-6 transition-colors duration-300 ${
                    index < currentIndex ? "bg-emerald-600" : "bg-border/60"
                  }`}
                />
              )}

              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-300 ${
                  isCompleted
                    ? "bg-emerald-600 text-white shadow-xs"
                    : isCurrent
                    ? "bg-amber-500 text-white ring-4 ring-amber-100 dark:ring-amber-950/60 shadow-md scale-105"
                    : "bg-background border-2 border-border text-text-secondary/50"
                }`}
              >
                {isCompleted ? <Check size={16} /> : <StepIcon size={16} />}
              </div>

              <div className="flex flex-col text-left">
                <span
                  className={`text-[13px] ${
                    isCurrent
                      ? "text-amber-600 dark:text-amber-400 font-bold"
                      : isCompleted
                      ? "text-text-primary font-bold"
                      : "text-text-secondary/60 font-medium"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* DESKTOP: STEPPER HÀNG NGANG */}
      <div className="hidden md:flex items-center justify-between relative w-full">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const StepIcon = step.icon;

          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center gap-2 z-10 shrink-0">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? "bg-emerald-600 text-white shadow-xs"
                      : isCurrent
                      ? "bg-amber-500 text-white ring-4 ring-amber-100 dark:ring-amber-950/60 shadow-md scale-105"
                      : "bg-background border-2 border-border text-text-secondary/50"
                  }`}
                >
                  {isCompleted ? <Check size={16} /> : <StepIcon size={16} />}
                </div>

                <span
                  className={`text-[11.5px] font-semibold text-center whitespace-nowrap ${
                    isCurrent
                      ? "text-amber-600 dark:text-amber-400 font-bold"
                      : isCompleted
                      ? "text-text-primary"
                      : "text-text-secondary/60"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-3 -mt-6 transition-colors duration-300 ${
                    index < currentIndex ? "bg-emerald-600" : "bg-border/60"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
