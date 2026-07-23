"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import { MOCK_CUSTOMERS_DATA, CustomerListItem } from "../list/constants";
import {
  MOCK_CUSTOMER_ORDERS,
  MOCK_CUSTOMER_POINTS_HISTORY,
  MOCK_CUSTOMER_ADMIN_NOTES,
  CustomerAdminNoteItem,
} from "./constants";
import { CustomerDetailHeader } from "./components/CustomerDetailHeader";
import { CustomerProfileCard } from "./components/CustomerProfileCard";
import { CustomerTabsPanel } from "./components/CustomerTabsPanel";
import { AddPointsModal } from "./components/AddPointsModal";

interface CustomerDetailScreenProps {
  customerId: string;
}

export function CustomerDetailScreen({ customerId }: CustomerDetailScreenProps) {
  const [customer, setCustomer] = useState<CustomerListItem | undefined>(() => {
    return MOCK_CUSTOMERS_DATA.find((c) => c.id === customerId) || MOCK_CUSTOMERS_DATA[0];
  });

  const [isAddPointsModalOpen, setIsAddPointsModalOpen] = useState(false);
  const [pointsAmount, setPointsAmount] = useState<number>(50);
  const [pointsNote, setPointsNote] = useState<string>("Tặng điểm sự kiện sinh nhật khách hàng");

  const [isToggleLockModalOpen, setIsToggleLockModalOpen] = useState(false);

  const [notesList, setNotesList] = useState<CustomerAdminNoteItem[]>(MOCK_CUSTOMER_ADMIN_NOTES);
  const [newNoteText, setNewNoteText] = useState("");

  if (!customer) {
    return (
      <div className="p-8 text-center text-text-muted">
        Không tìm thấy thông tin khách hàng.{" "}
        <Link href="/customers" className="text-primary hover:underline font-semibold">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  const handleConfirmAddPoints = () => {
    setCustomer((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        rewardPoints: prev.rewardPoints + pointsAmount,
      };
    });
    setIsAddPointsModalOpen(false);
  };

  const handleConfirmToggleLockStatus = () => {
    setCustomer((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        status: prev.status === "ACTIVE" ? "LOCKED" : "ACTIVE",
      };
    });
    setIsToggleLockModalOpen(false);
  };

  const handleAddNote = () => {
    if (!newNoteText.trim()) return;
    const newNote: CustomerAdminNoteItem = {
      id: `note_${Date.now()}`,
      author: "Quản trị viên",
      createdAt: new Date().toLocaleString("vi-VN"),
      content: newNoteText.trim(),
    };
    setNotesList((prev) => [newNote, ...prev]);
    setNewNoteText("");
  };

  return (
    <div className="space-y-6">
      <CustomerDetailHeader
        customer={customer}
        onOpenAddPointsModal={() => setIsAddPointsModalOpen(true)}
        onOpenToggleLockModal={() => setIsToggleLockModalOpen(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CustomerProfileCard customer={customer} />

        <div className="lg:col-span-2">
          <CustomerTabsPanel
            orders={MOCK_CUSTOMER_ORDERS}
            pointsHistory={MOCK_CUSTOMER_POINTS_HISTORY}
            notes={notesList}
            newNoteText={newNoteText}
            onNoteTextChange={setNewNoteText}
            onAddNote={handleAddNote}
          />
        </div>
      </div>

      <AddPointsModal
        isOpen={isAddPointsModalOpen}
        onClose={() => setIsAddPointsModalOpen(false)}
        onConfirm={handleConfirmAddPoints}
        pointsAmount={pointsAmount}
        onPointsAmountChange={setPointsAmount}
        pointsNote={pointsNote}
        onPointsNoteChange={setPointsNote}
      />

      <Modal
        isOpen={isToggleLockModalOpen}
        onClose={() => setIsToggleLockModalOpen(false)}
        onConfirm={handleConfirmToggleLockStatus}
        type={customer.status === "ACTIVE" ? "DANGER" : "CONFIRM"}
        title={
          customer.status === "ACTIVE"
            ? "Tạm khóa tài khoản khách hàng"
            : "Mở khóa tài khoản khách hàng"
        }
        description={
          customer.status === "ACTIVE"
            ? `Bạn có chắc chắn muốn tạm khóa tài khoản của khách hàng "${customer.name}" (${customer.code}) không? Khách hàng sẽ không thể đăng nhập hoặc đặt mua trên website.`
            : `Bạn có chắc chắn muốn mở khóa tài khoản cho khách hàng "${customer.name}" không?`
        }
        confirmText={
          customer.status === "ACTIVE" ? "Khóa tài khoản" : "Mở khóa tài khoản"
        }
        cancelText="Bỏ qua"
        size="sm"
      />
    </div>
  );
}
