"use client";

import React, { useState } from "react";
import { OrderHeaderBanner } from "./components/OrderHeaderBanner";
import { OrderItemsTable } from "./components/OrderItemsTable";
import { OrderStatusTimeline } from "./components/OrderStatusTimeline";
import { CustomerInfoCard } from "./components/CustomerInfoCard";
import { PaymentInfoCard } from "./components/PaymentInfoCard";
import { AdminNotesCard } from "./components/AdminNotesCard";
import { CancelOrderModal } from "./components/CancelOrderModal";
import { Modal } from "@/components/ui/Modal";
import { MOCK_ORDER_DETAIL, OrderDetail } from "./constants";
import { ORDER_STATUS_MAP, OrderStatus } from "@/constants/orders";

interface OrderDetailScreenProps {
  orderId: string;
}

export function OrderDetailScreen({ orderId }: OrderDetailScreenProps) {
  const [order, setOrder] = useState<OrderDetail>({
    ...MOCK_ORDER_DETAIL,
    id: orderId,
    orderCode: orderId.startsWith("TLK-") ? orderId : `TLK-${orderId}`,
  });

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [pendingTargetStatus, setPendingTargetStatus] = useState<OrderStatus | null>(null);

  const handleRequestStatusChange = (nextStatus: OrderStatus) => {
    setPendingTargetStatus(nextStatus);
  };

  const handleStatusChange = (nextStatus: OrderStatus) => {
    setOrder((prev) => {
      const now = new Date().toISOString().replace("T", " ").substring(0, 19);
      const nextConfig = ORDER_STATUS_MAP[nextStatus];

      const newTimelineItem = {
        id: `TL-${prev.timeline.length + 1}`,
        title: `Cập nhật trạng thái: ${nextConfig?.label || nextStatus}`,
        description: `Quản trị viên xác nhận cập nhật trạng thái đơn thành ${nextConfig?.label || nextStatus}`,
        timestamp: now,
        actor: "ADMIN" as const,
        isDone: true,
      };

      const updatedTimeline = prev.timeline.map((t) => ({
        ...t,
        isCurrent: false,
      }));

      return {
        ...prev,
        status: nextStatus,
        payment:
          nextStatus === "PAID"
            ? { ...prev.payment, status: "PAID", isMatched: true, paidAt: now }
            : prev.payment,
        timeline: [...updatedTimeline, { ...newTimelineItem, isCurrent: true }],
      };
    });

    setPendingTargetStatus(null);
  };

  const handleConfirmManualPayment = () => {
    setPendingTargetStatus("PAID");
  };

  const handleConfirmCancel = (reason: string) => {
    setOrder((prev) => {
      const now = new Date().toISOString().replace("T", " ").substring(0, 19);

      const cancelTimelineItem = {
        id: `TL-CANCEL`,
        title: "Đơn hàng đã hủy",
        description: `Lý do: ${reason}`,
        timestamp: now,
        actor: "ADMIN" as const,
        isDone: true,
        isCurrent: true,
      };

      return {
        ...prev,
        status: "CANCELLED",
        cancelReason: reason,
        timeline: [...prev.timeline.map((t) => ({ ...t, isCurrent: false })), cancelTimelineItem],
      };
    });
    setIsCancelModalOpen(false);
  };

  const handleSaveNotes = (notes: string) => {
    setOrder((prev) => ({ ...prev, adminNotes: notes }));
  };

  const targetConfig = pendingTargetStatus ? ORDER_STATUS_MAP[pendingTargetStatus] : null;

  return (
    <div className="space-y-5 pb-10">
      <OrderHeaderBanner
        order={order}
        onStatusChange={handleRequestStatusChange}
        onOpenCancelModal={() => setIsCancelModalOpen(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 space-y-5">
          <OrderItemsTable items={order.items} financial={order.financial} />
          <OrderStatusTimeline timeline={order.timeline} />
        </div>

        <div className="lg:col-span-4 space-y-5">
          <CustomerInfoCard customer={order.customer} />
          <PaymentInfoCard
            payment={order.payment}
            isPendingPayment={order.status === "PENDING_PAYMENT"}
            onConfirmManualPayment={handleConfirmManualPayment}
          />
          <AdminNotesCard
            initialNotes={order.adminNotes}
            onSaveNotes={handleSaveNotes}
          />
        </div>
      </div>

      <Modal
        isOpen={Boolean(pendingTargetStatus)}
        onClose={() => setPendingTargetStatus(null)}
        onConfirm={() => {
          if (pendingTargetStatus) handleStatusChange(pendingTargetStatus);
        }}
        type="CONFIRM"
        title="Xác nhận chuyển trạng thái đơn hàng"
        description={`Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng ${order.orderCode} sang "${targetConfig?.label || pendingTargetStatus}" không?`}
        confirmText="Xác nhận chuyển"
        cancelText="Hủy bỏ"
        size="sm"
      />

      <CancelOrderModal
        isOpen={isCancelModalOpen}
        orderCode={order.orderCode}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirmCancel={handleConfirmCancel}
      />
    </div>
  );
}
