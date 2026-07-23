"use client";

import React, { useState } from "react";
import { ShoppingBag, Award, FileText } from "lucide-react";
import {
  CustomerOrderHistoryItem,
  CustomerPointHistoryItem,
  CustomerAdminNoteItem,
} from "../constants";
import { CustomerOrdersTable } from "./CustomerOrdersTable";
import { CustomerPointsTab } from "./CustomerPointsTab";
import { CustomerNotesTab } from "./CustomerNotesTab";

interface CustomerTabsPanelProps {
  orders: CustomerOrderHistoryItem[];
  pointsHistory: CustomerPointHistoryItem[];
  notes: CustomerAdminNoteItem[];
  newNoteText: string;
  onNoteTextChange: (text: string) => void;
  onAddNote: () => void;
}

export function CustomerTabsPanel({
  orders,
  pointsHistory,
  notes,
  newNoteText,
  onNoteTextChange,
  onAddNote,
}: CustomerTabsPanelProps) {
  const [activeTab, setActiveTab] = useState<"orders" | "points" | "notes">("orders");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 bg-surface p-1.5 rounded-xl border border-border">
        <button
          type="button"
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === "orders"
              ? "bg-primary text-bg-deep shadow-md"
              : "text-text-muted hover:text-text-primary hover:bg-surface-hover"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Lịch sử đơn hàng ({orders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("points")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === "points"
              ? "bg-primary text-bg-deep shadow-md"
              : "text-text-muted hover:text-text-primary hover:bg-surface-hover"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Lịch sử tích/tiêu điểm</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("notes")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === "notes"
              ? "bg-primary text-bg-deep shadow-md"
              : "text-text-muted hover:text-text-primary hover:bg-surface-hover"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Ghi chú nội bộ ({notes.length})</span>
        </button>
      </div>

      {activeTab === "orders" && <CustomerOrdersTable orders={orders} />}

      {activeTab === "points" && <CustomerPointsTab pointsHistory={pointsHistory} />}

      {activeTab === "notes" && (
        <CustomerNotesTab
          notes={notes}
          newNoteText={newNoteText}
          onNoteTextChange={onNoteTextChange}
          onAddNote={onAddNote}
        />
      )}
    </div>
  );
}
