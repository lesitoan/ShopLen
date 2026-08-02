"use client";

import React from "react";
import { Check, XCircle, Clock } from "lucide-react";
import { ORDER_STATUS_STEPS, getActiveStepIndex } from "@/constants/orders";

interface OrderStatusStepperProps {
  orderStatus: string;
  cancelReason?: string | null;
  cancellationRequestReason?: string | null;
}

export default function OrderStatusStepper({
  orderStatus,
  cancelReason,
  cancellationRequestReason,
}: OrderStatusStepperProps) {
  if (orderStatus === "CANCELLED") {
    return (
      <div className="w-full bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl p-4 flex flex-col gap-0.5 text-left animate-in fade-in duration-200">
        <span className="text-[13.5px] font-bold text-rose-700 dark:text-rose-300">
          Đơn hàng đã hủy
        </span>
        <span className="text-[12px] text-rose-600/90 dark:text-rose-400/90">
          {cancelReason ? (
            <>
              Lý do hủy: <span className="font-semibold">{cancelReason}</span>
            </>
          ) : (
            "Đơn hàng này đã bị hủy và không còn hiệu lực."
          )}
        </span>
      </div>
    );
  }

  if (orderStatus === "CANCELLATION_REQUESTED") {
    return (
      <div className="w-full bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4 flex flex-col gap-0.5 text-left animate-in fade-in duration-200">
        <span className="text-[13.5px] font-bold text-amber-800 dark:text-amber-300">
          Yêu cầu hủy đơn hàng
        </span>
        <span className="text-[12px] text-amber-700/90 dark:text-amber-400/90">
          {cancellationRequestReason ? (
            <>
              Lý do hủy: <span className="font-semibold">{cancellationRequestReason}</span>
            </>
          ) : (
            "Yêu cầu hủy đơn hàng đã được gửi tới cửa hàng."
          )}
        </span>
      </div>
    );
  }

  const currentIndex = getActiveStepIndex(orderStatus);

  return (
    <div className="w-full bg-surface border-[1.5px] border-dashed border-primary rounded-xl p-4 md:p-5">
      <h4 className="text-[13px] font-bold text-text-primary mb-4 text-left uppercase tracking-wider border-l-4 border-primary pl-2.5">
        Hành trình đơn hàng
      </h4>

      {/* STEPPER HÀNG DỌC (HIỂN THỊ CẢ TRÊN MOBILE VÀ DESKTOP) */}
      <div className="flex flex-col gap-4.5 relative pl-1">
        {ORDER_STATUS_STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const StepIcon = step.icon;

          return (
            <div key={step.key} className="flex items-start gap-3.5 relative">
              {index < ORDER_STATUS_STEPS.length - 1 && (
                <div
                  className={`absolute left-[17.5px] top-8 w-[1px] h-7 dashed-line-v transition-colors duration-300 ${
                    index < currentIndex ? "text-primary" : "text-border"
                  }`}
                />
              )}

              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-300 ${
                  isCompleted
                    ? "bg-primary text-white shadow-xs"
                    : isCurrent
                    ? "bg-primary text-white ring-4 ring-primary-light shadow-md scale-105"
                    : "bg-background border-2 border-border text-text-secondary/50"
                }`}
              >
                {isCompleted ? <Check size={16} /> : <StepIcon size={16} />}
              </div>

              <div className="flex flex-col text-left pt-0.5">
                <span
                  className={`text-[13px] ${
                    isCurrent
                      ? "text-secondary font-bold"
                      : isCompleted
                      ? "text-text-primary font-bold"
                      : "text-text-secondary/70 font-medium"
                  }`}
                >
                  {step.label}
                </span>
                <span className="text-[11.5px] text-text-secondary leading-tight mt-0.5">
                  {step.desc}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
