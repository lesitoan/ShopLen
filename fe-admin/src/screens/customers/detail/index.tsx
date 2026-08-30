"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { Modal } from "@/components/ui/Modal";
import { Loading } from "@/components/ui/Loading";
import {
  useGetCustomerDetailQuery,
  useUpdateCustomerStatusMutation,
} from "@/services/api/customerApi";
import type { CustomerStatus } from "@/types/customer.type";
import { CustomerDetailHeader } from "./components/CustomerDetailHeader";
import { CustomerProfileCard } from "./components/CustomerProfileCard";
import { CustomerTabsPanel } from "./components/CustomerTabsPanel";

interface CustomerDetailScreenProps {
  customerId: string;
}

export function CustomerDetailScreen({ customerId }: CustomerDetailScreenProps) {
  const {
    data: customer,
    isLoading,
    isError,
  } = useGetCustomerDetailQuery(customerId);

  const [updateCustomerStatus, { isLoading: isUpdatingStatus }] =
    useUpdateCustomerStatusMutation();

  const [isToggleLockModalOpen, setIsToggleLockModalOpen] = useState(false);

  const handleAddPoints = () => {
    toast.info("Tính năng đang phát triển");
  };

  const handleConfirmToggleLockStatus = async () => {
    if (!customer) return;
    const nextStatus: CustomerStatus =
      customer.status === "ACTIVE" ? "LOCKED" : "ACTIVE";

    try {
      await updateCustomerStatus({
        id: customer.id,
        body: { status: nextStatus },
      }).unwrap();

      toast.success(
        nextStatus === "ACTIVE"
          ? "Mở khóa tài khoản khách hàng thành công."
          : "Đã tạm khóa tài khoản khách hàng."
      );
      setIsToggleLockModalOpen(false);
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Không thể cập nhật trạng thái khách hàng."
      );
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <Loading size="lg" />
        <p className="text-xs text-text-muted">Đang tải thông tin khách hàng...</p>
      </div>
    );
  }

  if (!customer || isError) {
    return (
      <div className="p-8 text-center text-text-muted space-y-3">
        <p>Không tìm thấy thông tin khách hàng.</p>
        <div>
          <Link
            href="/customers"
            className="text-primary hover:underline font-semibold text-xs"
          >
            Quay lại danh sách khách hàng
          </Link>
        </div>
      </div>
    );
  }

  const displayName = customer.fullName || customer.name || "Khách hàng";

  return (
    <div className="space-y-6">
      <CustomerDetailHeader
        customer={customer}
        onAddPoints={handleAddPoints}
        onOpenToggleLockModal={() => setIsToggleLockModalOpen(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CustomerProfileCard customer={customer} />

        <div className="lg:col-span-2">
          <CustomerTabsPanel
            orders={customer.orders || []}
            pointsHistory={[]}
          />
        </div>
      </div>

      <Modal
        isOpen={isToggleLockModalOpen}
        onClose={() => {
          if (!isUpdatingStatus) setIsToggleLockModalOpen(false);
        }}
        onConfirm={handleConfirmToggleLockStatus}
        isLoading={isUpdatingStatus}
        type={customer.status === "ACTIVE" ? "DANGER" : "CONFIRM"}
        title={
          customer.status === "ACTIVE"
            ? "Tạm khóa tài khoản khách hàng"
            : "Mở khóa tài khoản khách hàng"
        }
        description={
          customer.status === "ACTIVE"
            ? `Bạn có chắc chắn muốn tạm khóa tài khoản của khách hàng "${displayName}" (${customer.code}) không? Khách hàng sẽ không thể đăng nhập hoặc đặt mua trên website.`
            : `Bạn có chắc chắn muốn mở khóa tài khoản cho khách hàng "${displayName}" không?`
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
