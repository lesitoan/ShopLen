"use client";

import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";

interface CancelOrderModalProps {
  isOpen: boolean;
  orderCode: string;
  onClose: () => void;
  onConfirmCancel: (reason: string) => void;
}

export function CancelOrderModal({
  isOpen,
  orderCode,
  onClose,
  onConfirmCancel,
}: CancelOrderModalProps) {
  const [selectedReason, setSelectedReason] = useState("Khách hàng yêu cầu hủy đơn");
  const [otherReason, setOtherReason] = useState("");

  const reasons = [
    "Khách hàng yêu cầu hủy đơn",
    "Hết hàng trong kho (hết sợi len)",
    "Khách không chuyển khoản đúng hạn",
    "Sai thông tin giao hàng không liên hệ được",
    "Khác...",
  ];

  const handleConfirm = () => {
    const finalReason = selectedReason === "Khác..." ? otherReason.trim() || "Lý do khác" : selectedReason;
    onConfirmCancel(finalReason);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      type="CANCEL"
      title={`Xác nhận Hủy Đơn hàng ${orderCode}`}
      confirmText="Xác nhận Hủy Đơn"
      cancelText="Bỏ qua"
      size="sm"
    >
      <div className="space-y-4 text-xs">
        <div className="flex items-start gap-2 p-3 rounded-lg bg-status-danger/10 border border-status-danger/20 text-status-danger">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>Thao tác hủy đơn không thể hoàn tác. Trạng thái đơn sẽ chuyển sang &quot;Đã hủy&quot;.</span>
        </div>

        <div className="space-y-2">
          <label className="block text-text-secondary font-semibold">
            Vui lòng chọn lý do hủy đơn:
          </label>
          <div className="space-y-1.5">
            {reasons.map((reason) => (
              <label
                key={reason}
                className="flex items-center gap-2.5 p-2 rounded-lg bg-surface-muted/40 hover:bg-surface-hover cursor-pointer border border-border/40 transition-colors"
              >
                <input
                  type="radio"
                  name="cancelReason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="accent-primary"
                />
                <span className="text-text-primary font-medium">{reason}</span>
              </label>
            ))}
          </div>

          {selectedReason === "Khác..." && (
            <textarea
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              rows={2}
              placeholder="Nhập lý do cụ thể..."
              className="w-full mt-2 bg-surface-muted text-text-primary text-xs p-2.5 rounded-lg border border-border focus:outline-none focus:border-primary placeholder:text-text-muted"
            />
          )}
        </div>
      </div>
    </Modal>
  );
}
