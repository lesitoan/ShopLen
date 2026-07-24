"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";
import { SystemSettingsState } from "../constants";
import { ShieldCheck, HelpCircle, Save, RotateCcw } from "lucide-react";

interface ShippingSettingsCardProps {
  settings: SystemSettingsState;
  onChange: (key: keyof SystemSettingsState, value: unknown) => void;
  onSave: () => void;
  onReset: () => void;
  isSaving: boolean;
}

export function ShippingSettingsCard({
  settings,
  onChange,
  onSave,
  onReset,
  isSaving,
}: ShippingSettingsCardProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-6 space-y-6">
        <Card className="p-6 space-y-5">
          <div className="border-b border-border pb-4">
            <h3 className="text-base font-semibold text-text-primary">
              Thời Gian Giữ Đơn Chờ Thanh Toán
            </h3>
            <p className="text-xs text-text-secondary mt-1">
              Thời gian giữ tồn kho sản phẩm cho khách thanh toán chuyển khoản trước khi tự hủy.
            </p>
          </div>

          <div className="space-y-4">
            <Input
              label="Số phút giữ đơn (phút)"
              type="number"
              value={settings.orderHoldMinutes}
              onChange={(e) => onChange("orderHoldMinutes", Math.max(1, Number(e.target.value) || 15))}
              min={1}
              max={120}
            />

            <div className="p-3.5 bg-surface-muted rounded-md border border-border text-xs text-text-secondary space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-text-primary">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                Cơ chế tự động hủy & giải phóng tồn kho:
              </div>
              <p>
                Khi đơn hàng ở trạng thái <span className="text-amber-400 font-medium">Chờ xác nhận</span> vượt quá{" "}
                <strong className="text-text-primary">{settings.orderHoldMinutes} phút</strong> mà chưa khớp giao dịch chuyển khoản:
              </p>
              <ul className="list-disc list-inside space-y-1 text-text-muted pl-1 text-[11px]">
                <li>Hệ thống tự động chuyển trạng thái đơn sang Đã hủy (cancelled).</li>
                <li>Hoàn trả tồn kho dự trữ (reserved stock) về lại kho sản phẩm.</li>
                <li>Bắn sự kiện Socket.IO cập nhật danh sách đơn realtime cho Admin & Khách.</li>
              </ul>
            </div>
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

      <div className="lg:col-span-6 space-y-6">
        <Card className="p-6 space-y-5">
          <div className="border-b border-border pb-4">
            <h3 className="text-base font-semibold text-text-primary">
              Cấu Hình Phí Vận Chuyển toàn quốc
            </h3>
            <p className="text-xs text-text-secondary mt-1">
              Phí vận chuyển đồng giá áp dụng cho đơn hàng mua trực tuyến trên website khách.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Input
                label="Phí ship đồng giá mặc định (VNĐ)"
                type="number"
                value={settings.shippingFee}
                onChange={(e) => onChange("shippingFee", Math.max(0, Number(e.target.value) || 0))}
                step={1000}
                min={0}
              />
              <p className="mt-1 text-[11px] text-text-muted">
                Bằng chữ: <strong className="text-text-primary">{formatCurrency(settings.shippingFee)}</strong>
              </p>
            </div>

            <div className="pt-2 border-t border-border/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-text-primary block">
                    Áp dụng Miễn Phí Vận Chuyển (Freeship)
                  </span>
                  <span className="text-[11px] text-text-muted block">
                    Tự động giảm phí ship về 0đ khi đơn đạt giá trị tối thiểu.
                  </span>
                </div>
                <Switch
                  checked={settings.enableFreeShipping}
                  onChange={(val) => onChange("enableFreeShipping", val)}
                  size="md"
                />
              </div>

              {settings.enableFreeShipping && (
                <div className="mt-2 p-3 bg-surface-muted rounded-md border border-border">
                  <Input
                    label="Giá trị đơn hàng tối thiểu để Freeship (VNĐ)"
                    type="number"
                    value={settings.freeShippingThreshold}
                    onChange={(e) =>
                      onChange("freeShippingThreshold", Math.max(0, Number(e.target.value) || 0))
                    }
                    step={10000}
                    min={0}
                  />
                  <p className="mt-1.5 text-[11px] text-text-secondary flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                    Đơn hàng từ <strong className="text-primary">{formatCurrency(settings.freeShippingThreshold)}</strong> sẽ được free shipping.
                  </p>
                </div>
              )}
            </div>
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
    </div>
  );
}
