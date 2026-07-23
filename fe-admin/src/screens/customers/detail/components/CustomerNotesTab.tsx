"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { CustomerAdminNoteItem } from "../constants";

interface CustomerNotesTabProps {
  notes: CustomerAdminNoteItem[];
  newNoteText: string;
  onNoteTextChange: (text: string) => void;
  onAddNote: () => void;
}

export function CustomerNotesTab({
  notes,
  newNoteText,
  onNoteTextChange,
  onAddNote,
}: CustomerNotesTabProps) {
  return (
    <div className="bg-surface rounded-xl border border-border p-5 space-y-4">
      <div className="space-y-2">
        <label className="block text-xs font-bold text-text-primary">
          Thêm ghi chú quản trị viên
        </label>
        <textarea
          rows={3}
          value={newNoteText}
          onChange={(e) => onNoteTextChange(e.target.value)}
          placeholder="Nhập ghi chú quan trọng về khách hàng này (chỉ admin nhìn thấy)..."
          className="w-full bg-surface-muted text-text-primary placeholder:text-text-muted text-xs rounded-md border border-border p-3 outline-none focus:border-primary transition-colors resize-none"
        />
        <Button size="sm" onClick={onAddNote}>
          Lưu ghi chú
        </Button>
      </div>

      <div className="pt-4 border-t border-border space-y-3">
        {notes.map((note) => (
          <div key={note.id} className="p-3 rounded-lg bg-surface-muted/40 border border-border/60 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-text-muted">
              <span className="font-bold text-text-primary">{note.author}</span>
              <span>{note.createdAt}</span>
            </div>
            <p className="text-xs text-text-secondary">{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
