import React from "react";
import { QrCode, CheckCircle2 } from "lucide-react";
import { SINGLE_PAYMENT_METHOD } from "../constants";

export default function PaymentMethodSelector() {
  return (
    <div className="bg-surface border-y md:border border-border rounded-none md:rounded-xl p-4 md:p-6 flex flex-col gap-4">
      <h2 className="text-[16px] font-bold text-text-primary border-b border-border pb-3 flex items-center gap-2">
        <QrCode size={18} className="text-secondary" />
        <span>Phương thức thanh toán</span>
      </h2>

      <div className="border border-primary bg-primary-light/40 rounded-xl p-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-primary bg-primary flex items-center justify-center shrink-0">
            <div className="w-2 h-2 rounded-full bg-surface" />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[14px] font-bold text-text-primary">
              {SINGLE_PAYMENT_METHOD.name}
            </span>
            <span className="text-[10px] font-bold bg-primary text-surface px-2 py-0.5 rounded-full uppercase">
              Khuyên dùng
            </span>
          </div>
        </div>

        <CheckCircle2 size={20} className="text-primary shrink-0" />
      </div>
    </div>
  );
}
