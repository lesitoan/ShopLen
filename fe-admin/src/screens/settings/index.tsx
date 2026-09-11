"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabItem } from "@/components/ui/Tabs";
import { SettingsHeader } from "./components/SettingsHeader";
import { BankSettingsCard } from "./components/BankSettingsCard";
import { ShippingSettingsCard } from "./components/ShippingSettingsCard";
import { LoyaltySettingsCard } from "./components/LoyaltySettingsCard";
import { TelegramSettingsCard } from "./components/TelegramSettingsCard";
import { toast } from "react-toastify";
import {
  DEFAULT_SETTINGS_STATE,
  SettingTabId,
  SystemSettingsState,
} from "./constants";
import {
  Building2,
  Truck,
  Award,
  Send,
} from "lucide-react";

export function SettingsScreen() {
  const [activeTab, setActiveTab] = useState<SettingTabId>("BANK");
  const [settings, setSettings] = useState<SystemSettingsState>(DEFAULT_SETTINGS_STATE);
  const [initialSettings, setInitialSettings] = useState<SystemSettingsState>(DEFAULT_SETTINGS_STATE);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch("/api/admin/settings");
        if (response.ok) {
          const res = await response.json();
          if (res.success && res.data) {
            setSettings(res.data);
            setInitialSettings(res.data);
            if (res.data.updatedAt) {
              setLastSavedTime(new Date(res.data.updatedAt).toLocaleTimeString("vi-VN"));
            }
          }
        }
      } catch (err) {
      }
    }
    loadSettings();
  }, []);

  const handleChange = (key: keyof SystemSettingsState, value: unknown) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleReset = () => {
    setSettings(initialSettings);
    toast.success("Đã khôi phục cài đặt về trạng thái ban đầu.");
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      const res = await response.json();

      if (response.ok && res.success) {
        setInitialSettings(res.data);
        setLastSavedTime(new Date().toLocaleTimeString("vi-VN"));
        toast.success("Lưu cấu hình hệ thống thành công!");
      } else {
        toast.error(res.message || "Không thể lưu cấu hình hệ thống.");
      }
    } catch (err) {
      const error = err as Error;
      toast.error(`Lỗi kết nối máy chủ: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const tabs: TabItem[] = [
    {
      id: "BANK",
      label: "Tài Khoản Ngân Hàng",
      icon: <Building2 className="w-4 h-4" />,
    },
    {
      id: "SHIPPING",
      label: "Đơn Hàng & Phí Vận Chuyển",
      icon: <Truck className="w-4 h-4" />,
    },
    {
      id: "LOYALTY",
      label: "Tích Điểm Thưởng",
      icon: <Award className="w-4 h-4" />,
    },
    {
      id: "TELEGRAM",
      label: "Telegram & Thông Báo",
      icon: <Send className="w-4 h-4" />,
    },
  ];

  return (
    <div className="space-y-5">
      <SettingsHeader lastSavedTime={lastSavedTime} />

      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as SettingTabId)}
      />

      <div className="pt-1">
        {activeTab === "BANK" && (
          <BankSettingsCard
            settings={settings}
            onChange={handleChange}
            onSave={handleSave}
            onReset={handleReset}
            isSaving={isSaving}
          />
        )}
        {activeTab === "SHIPPING" && (
          <ShippingSettingsCard
            settings={settings}
            onChange={handleChange}
            onSave={handleSave}
            onReset={handleReset}
            isSaving={isSaving}
          />
        )}
        {activeTab === "LOYALTY" && (
          <LoyaltySettingsCard
            settings={settings}
            onChange={handleChange}
            onSave={handleSave}
            onReset={handleReset}
            isSaving={isSaving}
          />
        )}
        {activeTab === "TELEGRAM" && (
          <TelegramSettingsCard
            settings={settings}
            onChange={handleChange}
            onSave={handleSave}
            onReset={handleReset}
            isSaving={isSaving}
          />
        )}
      </div>
    </div>
  );
}
