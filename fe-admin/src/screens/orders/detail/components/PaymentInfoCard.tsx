"use client";

import React from "react";
import { CreditCard, ShieldAlert, Check } from "lucide-react";
import { OrderPaymentInfo } from "../constants";
import { Badge } from "@/components/ui/Badge";

interface PaymentInfoCardProps {
  payment: OrderPaymentInfo;
  isPendingPayment: boolean;
  onConfirmManualPayment: () => void;
}

export function PaymentInfoCard({
  payment,
  isPendingPayment,
  onConfirmManualPayment,
}: PaymentInfoCardProps) {
  return (
    <div className="bg-surface rounded-xl border border-border p-4 space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-bold text-text-highlight">
            Thông tin Thanh toán
          </h2>
        </div>

        {payment.isMatched ? (
          <Badge variant="success" dot>
            Đã thanh toán
          </Badge>
        ) : (
          <Badge variant="warning" dot>
            Chờ chuyển khoản
          </Badge>
        )}
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between py-1 border-b border-border/40">
          <span className="text-text-muted">Phương thức:</span>
          <span className="font-semibold text-text-primary">
            {payment.method || "Chuyển khoản ngân hàng"}
          </span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-border/40">
          <span className="text-text-muted">Ngân hàng nhận:</span>
          <span className="font-semibold text-text-primary">{payment.bankName}</span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-border/40">
          <span className="text-text-muted">Số tài khoản:</span>
          <span className="font-mono font-bold text-primary">{payment.accountNo}</span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-border/40">
          <span className="text-text-muted">Mã giao dịch:</span>
          <span className="font-mono text-text-secondary">{payment.transactionRef || "—"}</span>
        </div>

        {payment.paidAt && (
          <div className="flex items-center justify-between py-1">
            <span className="text-text-muted">Thời gian khớp tiền:</span>
            <span className="font-semibold text-status-success">{payment.paidAt}</span>
          </div>
        )}
      </div>

      {isPendingPayment && (
        <div className="pt-2 border-t border-border space-y-2">
          <div className="flex items-start gap-1.5 p-2 rounded-lg bg-status-warning/10 border border-status-warning/20 text-status-warning text-[11px]">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Đơn chưa nhận được xác nhận thanh toán tự động. Bạn có thể kiểm tra biến động số dư và xác nhận thủ công.</span>
          </div>

          <button
            onClick={onConfirmManualPayment}
            className="w-full py-2 px-3 rounded-lg bg-primary hover:bg-primary-hover text-bg-deep font-bold text-xs transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Xác nhận đã thanh toán thủ công</span>
          </button>
        </div>
      )}
    </div>
  );
}
