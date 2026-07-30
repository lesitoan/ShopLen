import React, { useState } from "react";
import { Ticket, Check, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Voucher } from "@/types/cart.type";

interface VoucherAndPointsProps {
  appliedVoucher: Voucher | null;
  onApplyVoucher: (voucher: Voucher | null) => void;
  subtotal: number;
}

export default function VoucherAndPoints({
  appliedVoucher,
  onApplyVoucher,
}: VoucherAndPointsProps) {
  const [inputCode, setInputCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleApplyInput = () => {
    setErrorMessage("");
    const trimmed = inputCode.trim();
    if (!trimmed) {
      setErrorMessage("Vui lòng nhập mã giảm giá.");
      return;
    }

    setErrorMessage("Mã giảm giá không hợp lệ.");
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-4 md:p-6 mt-4 flex flex-col gap-4">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-[14px] font-bold text-text-primary">
            <Ticket size={18} className="text-secondary" />
            <span>Mã giảm giá (Voucher)</span>
          </div>
        </div>

        {appliedVoucher ? (
          <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Check size={16} className="text-emerald-600" />
              <div>
                <p className="text-[13px] font-bold text-emerald-800">
                  Đã áp dụng mã {appliedVoucher.code}
                </p>
                <p className="text-[11.5px] text-emerald-600">
                  {appliedVoucher.description}
                </p>
              </div>
            </div>
            <button
              onClick={() => onApplyVoucher(null)}
              className="text-[12px] font-semibold text-error hover:underline"
            >
              Gỡ bỏ
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Nhập mã giảm giá..."
                className="text-[13px]"
              />
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={handleApplyInput}
              className="rounded-md font-bold text-[13px] px-5 shrink-0"
            >
              Áp dụng
            </Button>
          </div>
        )}

        {errorMessage && (
          <div className="flex items-center gap-1.5 mt-2 text-[12px] text-error">
            <AlertCircle size={14} />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
