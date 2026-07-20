import React, { useState } from "react";
import { Ticket, Coins, Check, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Voucher } from "../types";
import { AVAILABLE_VOUCHERS, MOCK_USER_POINTS, LOYALTY_POINTS_CONVERSION_RATE } from "../constants";

interface VoucherAndPointsProps {
  appliedVoucher: Voucher | null;
  onApplyVoucher: (voucher: Voucher | null) => void;
  usePoints: boolean;
  onTogglePoints: (use: boolean) => void;
  subtotal: number;
}

export default function VoucherAndPoints({
  appliedVoucher,
  onApplyVoucher,
  usePoints,
  onTogglePoints,
  subtotal,
}: VoucherAndPointsProps) {
  const [inputCode, setInputCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showVoucherList, setShowVoucherList] = useState(false);

  const pointsValue = MOCK_USER_POINTS * LOYALTY_POINTS_CONVERSION_RATE;

  const handleApplyInput = () => {
    setErrorMessage("");
    const found = AVAILABLE_VOUCHERS.find(
      (v) => v.code.toUpperCase() === inputCode.trim().toUpperCase()
    );

    if (!found) {
      setErrorMessage("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
      return;
    }

    if (subtotal < found.minOrderValue) {
      setErrorMessage(`Đơn hàng tối thiểu ${found.minOrderValue.toLocaleString("vi-VN")}đ để sử dụng mã này.`);
      return;
    }

    onApplyVoucher(found);
    setInputCode("");
  };

  const handleSelectVoucher = (voucher: Voucher) => {
    setErrorMessage("");
    if (subtotal < voucher.minOrderValue) {
      setErrorMessage(`Đơn hàng tối thiểu ${voucher.minOrderValue.toLocaleString("vi-VN")}đ để sử dụng mã này.`);
      return;
    }
    onApplyVoucher(voucher);
    setShowVoucherList(false);
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-4 md:p-6 mt-4 flex flex-col gap-4">
      {/* Voucher section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-[14px] font-bold text-text-primary">
            <Ticket size={18} className="text-secondary" />
            <span>Mã giảm giá (Voucher)</span>
          </div>
          <button
            onClick={() => setShowVoucherList(!showVoucherList)}
            className="text-[12px] font-semibold text-secondary hover:underline"
          >
            {showVoucherList ? "Ẩn danh sách mã" : "Xem danh sách mã"}
          </button>
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

        {showVoucherList && !appliedVoucher && (
          <div className="mt-3 flex flex-col gap-2 p-3 bg-background border border-border rounded-lg max-h-48 overflow-y-auto">
            {AVAILABLE_VOUCHERS.map((voucher) => (
              <div
                key={voucher.code}
                className="flex items-center justify-between p-2.5 bg-surface border border-border/80 rounded-md hover:border-primary/50 transition-colors"
              >
                <div>
                  <span className="text-[12.5px] font-bold text-text-primary">
                    {voucher.code}
                  </span>
                  <p className="text-[11px] text-text-secondary">
                    {voucher.description}
                  </p>
                </div>
                <button
                  onClick={() => handleSelectVoucher(voucher)}
                  className="text-[12px] font-bold text-secondary hover:text-primary transition-colors px-2 py-1 rounded bg-primary-light"
                >
                  Dùng mã
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-border/60 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[14px] font-bold text-text-primary">
            <Coins size={18} className="text-amber-500" />
            <span>Điểm thưởng tích lũy</span>
          </div>
          <span className="text-[12px] text-text-secondary">
            Bạn có <strong className="text-text-primary font-bold">{MOCK_USER_POINTS}</strong> điểm
          </span>
        </div>

        <label className="flex items-center gap-2.5 mt-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={usePoints}
            onChange={(e) => onTogglePoints(e.target.checked)}
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
          />
          <span className="text-[13px] text-text-primary">
            Sử dụng <strong className="font-bold">{MOCK_USER_POINTS} điểm</strong> (quy đổi <strong className="text-secondary font-bold">{pointsValue.toLocaleString("vi-VN")}đ</strong>)
          </span>
        </label>
      </div>
    </div>
  );
}
