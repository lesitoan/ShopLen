"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";

interface AddPointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  pointsAmount: number;
  onPointsAmountChange: (val: number) => void;
  pointsNote: string;
  onPointsNoteChange: (val: string) => void;
}

export function AddPointsModal({
  isOpen,
  onClose,
  onConfirm,
  pointsAmount,
  onPointsAmountChange,
  pointsNote,
  onPointsNoteChange,
}: AddPointsModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      type="PRIMARY"
      title="Cộng điểm thưởng cho khách hàng"
      confirmText="Xác nhận cộng điểm"
      cancelText="Hủy bỏ"
      size="sm"
    >
      <div className="space-y-4 py-2">
        <Input
          label="Số điểm muốn cộng"
          type="number"
          min={1}
          value={pointsAmount}
          onChange={(e) => onPointsAmountChange(Number(e.target.value))}
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-text-secondary">
            Lý do cộng điểm
          </label>
          <input
            type="text"
            value={pointsNote}
            onChange={(e) => onPointsNoteChange(e.target.value)}
            className="w-full h-[38px] bg-surface-muted text-text-primary text-xs rounded-md border border-border px-3 outline-none focus:border-primary"
          />
        </div>
      </div>
    </Modal>
  );
}
