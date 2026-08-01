"use client";

import React from "react";
import { Check, XCircle } from "lucide-react";
import { ORDER_STATUS_STEPS, getActiveStepIndex } from "@/constants/orders";

interface OrderStatusStepperProps {
  orderStatus: string;
}

export default function OrderStatusStepper({ orderStatus }: OrderStatusStepperProps) {
  if (orderStatus === "CANCELLED") {
    return (
      <div className="w-full bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl p-4 flex items-center gap-3 text-left animate-in fade-in duration-200">
        <div className="w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
          <XCircle size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-[13.5px] font-bold text-rose-700 dark:text-rose-300">
            Đơn hàng đã hủy
          </span>
          <span className="text-[12px] text-rose-600/80 dark:text-rose-400/80">
            Đơn hàng này đã bị hủy và không còn hiệu lực.
          </span>
        </div>
      </div>
    );
  }

  const currentIndex = getActiveStepIndex(orderStatus);

  return (
    <div className="w-full bg-surface border-[1.5px] border-dashed border-primary rounded-xl p-4 md:p-5">
      <h4 className="text-[13px] font-bold text-text-primary mb-4 text-left uppercase tracking-wider border-l-4 border-primary pl-2.5">
        Hành trình đơn hàng
      </h4>

      {/* MOBILE / TABLET (<1024px): STEPPER HÀNG DỌC */}
      <div className="flex flex-col gap-4.5 lg:hidden relative pl-1">
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

      {/* DESKTOP (>=1024px): STEPPER HÀNG NGANG */}
      <div className="hidden lg:flex items-center justify-between relative w-full pt-1 pb-2">
        {ORDER_STATUS_STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const StepIcon = step.icon;

          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center gap-2 z-10 shrink-0">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? "bg-primary text-white shadow-xs"
                      : isCurrent
                      ? "bg-primary text-white ring-4 ring-primary-light shadow-md scale-105"
                      : "bg-background border-2 border-border text-text-secondary/50"
                  }`}
                >
                  {isCompleted ? <Check size={16} /> : <StepIcon size={16} />}
                </div>

                <div className="flex flex-col items-center text-center gap-0.5 max-w-[130px]">
                  <span
                    className={`text-[12px] font-bold whitespace-nowrap ${
                      isCurrent
                        ? "text-secondary"
                        : isCompleted
                        ? "text-text-primary"
                        : "text-text-secondary/70"
                    }`}
                  >
                    {step.label}
                  </span>
                  <span className="text-[11px] text-text-secondary leading-tight">
                    {step.desc}
                  </span>
                </div>
              </div>

              {index < ORDER_STATUS_STEPS.length - 1 && (
                <div
                  className={`flex-1 h-[1px] dashed-line-h mx-2 -mt-10 transition-colors duration-300 ${
                    index < currentIndex ? "text-primary" : "text-border"
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
