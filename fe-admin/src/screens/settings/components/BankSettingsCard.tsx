"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { POPULAR_BANKS, QR_TEMPLATE_OPTIONS, SystemSettingsState } from "../constants";
import { QrCode, RefreshCw, Eye, Save, RotateCcw } from "lucide-react";

interface BankSettingsCardProps {
  settings: SystemSettingsState;
  onChange: (key: keyof SystemSettingsState, value: unknown) => void;
  onSave: () => void;
  onReset: () => void;
  isSaving: boolean;
}

export function BankSettingsCard({
  settings,
  onChange,
  onSave,
  onReset,
  isSaving,
}: BankSettingsCardProps) {
  const [previewAmount, setPreviewAmount] = useState<number>(150000);
  const [imageError, setImageError] = useState<boolean>(false);

  const handleBankSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBin = e.target.value;
    const foundBank = POPULAR_BANKS.find((b) => b.bin === selectedBin);
    if (foundBank) {
      onChange("bankBin", foundBank.bin);
      onChange("bankName", foundBank.shortName);
    }
  };

  const bankSelectOptions = [
    { value: "", label: "-- Chọn ngân hàng --" },
    ...POPULAR_BANKS.map((b) => ({
      value: b.bin,
      label: `${b.shortName} (${b.name})`,
    })),
  ];

  const qrImageUrl = settings.bankBin && settings.bankAccountNo
    ? `https://img.vietqr.io/image/${settings.bankBin}-${settings.bankAccountNo}-${settings.qrTemplate}.png?amount=${previewAmount}&addInfo=NK10001&accountName=${encodeURIComponent(
        settings.bankAccountName || ""
      )}`
    : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7 space-y-6">
        <Card className="p-6 space-y-5">
          <div className="border-b border-border pb-4">
            <h3 className="text-base font-semibold text-text-primary">
              Tài Khoản Ngân Hàng Nhận Chuyển Khoản
            </h3>
            <p className="text-xs text-text-secondary mt-1">
              Thông tin dùng để tự động sinh mã QR Ngân hàng khi khách hàng thanh toán đơn hàng.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Select
                label="Chọn Ngân hàng"
                value={settings.bankBin}
                onChange={handleBankSelect}
                options={bankSelectOptions}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Mã BIN Ngân hàng"
                value={settings.bankBin}
                onChange={(e) => onChange("bankBin", e.target.value)}
                placeholder="Ví dụ: 970422"
              />

              <Input
                label="Tên Ngân hàng (Hiển thị)"
                value={settings.bankName}
                onChange={(e) => onChange("bankName", e.target.value)}
                placeholder="Ví dụ: MB Bank"
              />
            </div>

            <Input
              label="Số Tài Khoản Ngân Hàng"
              value={settings.bankAccountNo}
              onChange={(e) => onChange("bankAccountNo", e.target.value.replace(/\s+/g, ""))}
              placeholder="Nhập số tài khoản..."
            />

            <Input
              label="Tên Chủ Tài Khoản (Viết hoa không dấu)"
              value={settings.bankAccountName}
              onChange={(e) => onChange("bankAccountName", e.target.value.toUpperCase())}
              placeholder="NGUYEN THI KIEU"
            />

            <div>
              <Select
                label="Mẫu Giao Diện Mã QR Ngân Hàng"
                value={settings.qrTemplate}
                onChange={(e) => onChange("qrTemplate", e.target.value)}
                options={QR_TEMPLATE_OPTIONS}
                className="w-full"
              />
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

      <div className="lg:col-span-5 space-y-6">
        <Card className="p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h3 className="text-sm font-semibold text-text-primary">
              Xem Trước Mã QR Ngân Hàng
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">
              LIVE PREVIEW
            </span>
          </div>

          <div className="space-y-4">
            <Input
              label="Số tiền mô phỏng (VNĐ)"
              type="number"
              value={previewAmount}
              onChange={(e) => setPreviewAmount(Number(e.target.value) || 0)}
              step={10000}
              min={0}
            />

            <div className="bg-surface-muted border border-border rounded-lg p-4 flex flex-col items-center justify-center min-h-[280px] text-center relative">
              {qrImageUrl && !imageError ? (
                <div className="space-y-3 flex flex-col items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrImageUrl}
                    alt="Mã QR Ngân Hàng Xem Trước"
                    className="max-h-64 object-contain rounded border border-border shadow-md bg-white p-2"
                    onError={() => setImageError(true)}
                  />
                  <div className="text-xs text-text-secondary space-y-1">
                    <p className="font-semibold text-text-primary" title={settings.bankAccountName}>
                      {settings.bankAccountName || "CHƯA NHẬP TÊN CHỦ TK"}
                    </p>
                    <p className="font-mono text-primary text-sm font-bold">
                      {settings.bankAccountNo || "CHƯA NHẬP SỐ TK"}
                    </p>
                    <p className="text-[11px] text-text-muted">
                      {settings.bankName} (BIN: {settings.bankBin})
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-text-muted flex flex-col items-center">
                  <QrCode className="w-12 h-12 opacity-40" />
                  <p className="text-xs">
                    Vui lòng nhập đầy đủ Số tài khoản và Mã BIN ngân hàng để tạo mã QR Ngân hàng.
                  </p>
                  {imageError && (
                    <button
                      type="button"
                      onClick={() => setImageError(false)}
                      className="mt-2 text-xs text-primary flex items-center gap-1 hover:underline"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Thử tải lại hình ảnh
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="p-3 bg-surface-hover/50 rounded-md border border-border-subtle text-[11px] text-text-secondary flex items-start gap-2">
              <Eye className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>
                Mã QR này sẽ hiển thị cho khách hàng ở trang thanh toán kèm cú pháp nội dung chuyển khoản tự động (ví dụ: <strong className="text-text-primary">NK10001 0987654321</strong>).
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
