"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { SystemSettingsState } from "../constants";
import { Send, CheckCircle2, AlertTriangle, Save, RotateCcw } from "lucide-react";

interface TelegramSettingsCardProps {
  settings: SystemSettingsState;
  onChange: (key: keyof SystemSettingsState, value: unknown) => void;
  onSave: () => void;
  onReset: () => void;
  isSaving: boolean;
}

export function TelegramSettingsCard({
  settings,
  onChange,
  onSave,
  onReset,
  isSaving,
}: TelegramSettingsCardProps) {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const [pendingToggle, setPendingToggle] = useState<{
    key: "notifyNewOrderTelegram" | "notifyPaidTelegram";
    label: string;
    nextValue: boolean;
  } | null>(null);

  const handleTestTelegram = async () => {
    if (!settings.telegramBotToken || !settings.telegramChatId) {
      setTestResult({
        success: false,
        message: "Vui lòng điền đầy đủ Telegram Bot Token và Chat ID trước khi thử nghiệm.",
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const response = await fetch("/api/admin/settings/test-telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          botToken: settings.telegramBotToken,
          chatId: settings.telegramChatId,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setTestResult({
          success: true,
          message: data.message || "Gửi tin nhắn thử nghiệm Telegram Bot thành công!",
        });
      } else {
        setTestResult({
          success: false,
          message: data.message || "Gửi tin nhắn thất bại. Vui lòng kiểm tra lại Bot Token và Chat ID.",
        });
      }
    } catch (err) {
      const error = err as Error;
      setTestResult({
        success: false,
        message: `Lỗi kết nối API: ${error.message}`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleConfirmToggle = () => {
    if (pendingToggle) {
      onChange(pendingToggle.key, pendingToggle.nextValue);
      setPendingToggle(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7 space-y-6">
        <Card className="p-6 space-y-5">
          <div className="border-b border-border pb-4">
            <h3 className="text-base font-semibold text-text-primary">
              Cấu Hình Telegram Bot Thông Báo Đơn Hàng
            </h3>
            <p className="text-xs text-text-secondary mt-1">
              Tự động gửi tin nhắn báo có đơn mới hoặc đơn thanh toán thành công về nhóm Telegram Admin.
            </p>
          </div>

          <div className="space-y-4">
            <Input
              label="Telegram Bot Token"
              value={settings.telegramBotToken}
              onChange={(e) => onChange("telegramBotToken", e.target.value.trim())}
              placeholder="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ..."
              type="password"
            />

            <Input
              label="Telegram Chat ID (ID Nhóm hoặc cá nhân)"
              value={settings.telegramChatId}
              onChange={(e) => onChange("telegramChatId", e.target.value.trim())}
              placeholder="-1001234567890 hoặc 987654321"
            />

            <div className="pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={handleTestTelegram}
                disabled={!settings.telegramBotToken || !settings.telegramChatId}
                isLoading={isTesting}
                leftIcon={<Send className="w-4 h-4 text-sky-400 shrink-0" />}
              >
                {isTesting ? "Đang gửi tin nhắn thử..." : "Gửi tin nhắn thử nghiệm qua Telegram"}
              </Button>
            </div>

            {testResult && (
              <div
                className={`p-3.5 rounded-lg border text-xs flex items-start gap-2.5 ${
                  testResult.success
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-red-500/10 border-red-500/30 text-red-400"
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}
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
          <div className="border-b border-border pb-3">
            <h3 className="text-base font-semibold text-text-primary">
              Cài Đặt Sự Kiện Kích Hoạt Thông Báo
            </h3>
          </div>

          <div className="space-y-3 divide-y divide-border/40">
            <div className="flex items-center justify-between pt-2">
              <div className="space-y-0.5 pr-2">
                <span className="text-xs font-semibold text-text-primary block">
                  Thông báo Telegram khi có Đơn hàng mới
                </span>
                <span className="text-[11px] text-text-muted block">
                  Gửi tin nhắn chi tiết kèm tên khách, SĐT, mã đơn và tổng tiền khi vừa tạo đơn.
                </span>
              </div>
              <Switch
                checked={settings.notifyNewOrderTelegram}
                onChange={(nextVal) =>
                  setPendingToggle({
                    key: "notifyNewOrderTelegram",
                    label: "Thông báo Telegram khi có Đơn hàng mới",
                    nextValue: nextVal,
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div className="space-y-0.5 pr-2">
                <span className="text-xs font-semibold text-text-primary block">
                  Thông báo Telegram khi Đã thanh toán
                </span>
                <span className="text-[11px] text-text-muted block">
                  Gửi tin nhắn nhóm Telegram ngay khi giao dịch khớp tiền ngân hàng.
                </span>
              </div>
              <Switch
                checked={settings.notifyPaidTelegram}
                onChange={(nextVal) =>
                  setPendingToggle({
                    key: "notifyPaidTelegram",
                    label: "Thông báo Telegram khi Đã thanh toán",
                    nextValue: nextVal,
                  })
                }
              />
            </div>
          </div>
        </Card>
      </div>

      <Modal
        isOpen={Boolean(pendingToggle)}
        onClose={() => setPendingToggle(null)}
        onConfirm={handleConfirmToggle}
        type="CONFIRM"
        title="Xác nhận thay đổi cài đặt thông báo"
        description={
          pendingToggle
            ? `Bạn có chắc chắn muốn ${pendingToggle.nextValue ? "bật" : "tắt"} tính năng "${
                pendingToggle.label
              }" không?`
            : ""
        }
        confirmText="Xác nhận"
        cancelText="Bỏ qua"
        size="sm"
      />
    </div>
  );
}
