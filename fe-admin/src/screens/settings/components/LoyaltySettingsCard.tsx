"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SystemSettingsState } from "../constants";
import { AlertCircle, Save, RotateCcw } from "lucide-react";

interface LoyaltySettingsCardProps {
  settings: SystemSettingsState;
  onChange: (key: keyof SystemSettingsState, value: unknown) => void;
  onSave: () => void;
  onReset: () => void;
  isSaving: boolean;
}

export function LoyaltySettingsCard({
  settings,
  onChange,
  onSave,
  onReset,
  isSaving,
}: LoyaltySettingsCardProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7 space-y-6">
        <Card className="p-6 space-y-5">
          <div className="border-b border-border pb-4">
            <h3 className="text-base font-semibold text-text-primary">
              Tỷ Lệ Tích Điểm & Quy Đổi Điểm Thưởng
            </h3>
            <p className="text-xs text-text-secondary mt-1">
              Chính sách tích điểm thành viên khi mua sản phẩm và áp dụng giảm giá trực tiếp.
            </p>
          </div>

          <div className="space-y-5">
            <div className="p-4 bg-surface-muted border border-border rounded-lg space-y-3">
              <span className="text-xs font-semibold text-purple-300 block">
                1. Tỷ lệ tích điểm từ đơn hàng (Earn Rate)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Số tiền mua hàng (VNĐ)"
                  type="number"
                  value={settings.loyaltyEarnRate}
                  onChange={(e) => onChange("loyaltyEarnRate", Math.max(1, Number(e.target.value) || 1000))}
                  step={1000}
                />
                <div className="flex flex-col justify-end">
                  <div className="bg-surface p-2.5 rounded border border-border text-xs text-text-secondary font-medium">
                    = <span className="text-primary font-bold">1 điểm thưởng</span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-text-muted">
                Khách mua đơn {formatCurrency(250000)} sẽ tích được{" "}
                <strong className="text-primary font-bold">
                  {Math.floor(250000 / (settings.loyaltyEarnRate || 1000))} điểm
                </strong>.
              </p>
            </div>

            <div className="p-4 bg-surface-muted border border-border rounded-lg space-y-3">
              <span className="text-xs font-semibold text-emerald-400 block">
                2. Quy đổi điểm sang Tiền Giảm Giá (Redeem Rate)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Số điểm quy đổi"
                  type="number"
                  value={settings.loyaltyRedeemRate}
                  onChange={(e) => onChange("loyaltyRedeemRate", Math.max(1, Number(e.target.value) || 100))}
                  step={10}
                />
                <Input
                  label="Số tiền tương ứng giảm (VNĐ)"
                  type="number"
                  value={settings.loyaltyRedeemValue}
                  onChange={(e) => onChange("loyaltyRedeemValue", Math.max(0, Number(e.target.value) || 10000))}
                  step={1000}
                />
              </div>
              <p className="text-[11px] text-text-muted">
                Ví dụ: Khách dùng <strong className="text-text-primary">{settings.loyaltyRedeemRate} điểm</strong> sẽ được giảm ngay{" "}
                <strong className="text-emerald-400 font-bold">{formatCurrency(settings.loyaltyRedeemValue)}</strong> vào đơn.
              </p>
            </div>

            <Input
              label="Giá trị đơn hàng tối thiểu để áp dụng điểm (VNĐ)"
              type="number"
              value={settings.minOrderValueForRedeem}
              onChange={(e) => onChange("minOrderValueForRedeem", Math.max(0, Number(e.target.value) || 0))}
              step={10000}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={onReset}
              disabled={isSaving}
              leftIcon={<RotateCcw className="w-4 h-4 text-text-secondary shrink-0" />}
            >
              Khôi phục
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={onSave}
              isLoading={isSaving}
              leftIcon={<Save className="w-4 h-4 shrink-0" />}
            >
              {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-5 space-y-6">
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-semibold text-text-primary border-b border-border pb-3">
            Tóm Tắt Chính Sách Thành Viên
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-surface-muted rounded border border-border-subtle flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-text-primary mb-1">Thời điểm cộng điểm:</p>
                <p className="text-text-secondary text-[11px]">
                  Điểm chỉ được cộng vào tài khoản khách sau khi đơn hàng chuyển sang trạng thái{" "}
                  <span className="text-emerald-400 font-medium">Hoàn thành (completed)</span>.
                </p>
              </div>
            </div>

            <div className="p-3 bg-surface-muted rounded border border-border-subtle flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-text-primary mb-1">Hoàn điểm khi hủy đơn:</p>
                <p className="text-text-secondary text-[11px]">
                  Nếu đơn hàng có sử dụng điểm thưởng mà bị hủy, điểm đã dùng sẽ được tự động hoàn lại cho khách.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
