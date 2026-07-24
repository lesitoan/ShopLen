"use client";

import React from "react";

interface SettingsHeaderProps {
  lastSavedTime?: string | null;
}

export function SettingsHeader({ lastSavedTime }: SettingsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-text-highlight tracking-tight">
          Cấu Hình Hệ Thống & Tự Động Hóa
        </h1>
        <p className="text-xs text-text-muted mt-1 flex flex-wrap items-center gap-2">
          <span>
            Quản lý tài khoản Ngân hàng, thời gian giữ đơn, chính sách tích điểm và tích hợp Telegram Bot
          </span>
          {lastSavedTime && (
            <span className="pl-2 border-l border-border text-text-muted">
              Lưu lần cuối lúc: <strong className="text-text-primary">{lastSavedTime}</strong>
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
