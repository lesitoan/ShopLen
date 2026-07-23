"use client";

import React, { useState } from "react";
import { StickyNote, Save, Check } from "lucide-react";

interface AdminNotesCardProps {
  initialNotes: string;
  onSaveNotes: (notes: string) => void;
}

export function AdminNotesCard({ initialNotes, onSaveNotes }: AdminNotesCardProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    onSaveNotes(notes);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="bg-surface rounded-xl border border-border p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <StickyNote className="w-4 h-4 text-status-warning" />
          <h2 className="text-sm font-bold text-text-highlight">
            Ghi chú Nội bộ Admin
          </h2>
        </div>
        <span className="text-[10px] text-text-muted">Chỉ Admin mới thấy</span>
      </div>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
        placeholder="Nhập ghi chú xử lý đơn hàng (ví dụ: Khách hẹn giao sau 5h, đã dặn bọc chống xóc...)"
        className="w-full bg-surface-muted text-text-primary text-xs p-3 rounded-lg border border-border focus:outline-none focus:border-primary placeholder:text-text-muted transition-colors resize-none"
      />

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            isSaved
              ? "bg-status-success text-bg-deep font-bold"
              : "bg-surface-active hover:bg-surface-hover text-text-highlight border border-border-light"
          }`}
        >
          {isSaved ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Đã lưu ghi chú!</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5 text-primary" />
              <span>Lưu ghi chú</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
