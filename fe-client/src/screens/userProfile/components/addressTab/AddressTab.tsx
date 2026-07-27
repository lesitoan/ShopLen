"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import AddressSkeleton from "@/components/skeletons/userProfile/AddressSkeleton";
import { useGetCustomerAddressesQuery } from "@/services/api/customerAddressApi";
import AddAddressForm from "./AddAddressForm";
import ListAddress from "./ListAddress";

export default function AddressTab() {
  const [showAddForm, setShowAddForm] = useState(false);

  const {
    data: addresses = [],
    isLoading,
    isError,
    refetch,
  } = useGetCustomerAddressesQuery();

  if (isLoading) {
    return <AddressSkeleton />;
  }

  if (isError) {
    return (
      <div className="bg-transparent border-0 p-0 sm:bg-surface sm:border sm:border-border sm:rounded-xl sm:p-8 flex items-center justify-center min-h-[350px] w-full">
        <EmptyState
          title="Không có dữ liệu, thử lại sau"
          actionLabel="Tải lại"
          onAction={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="bg-transparent border-0 p-0 sm:bg-surface sm:border sm:border-border sm:rounded-xl sm:p-6 flex flex-col gap-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="hidden md:block">
          <h2 className="text-[18px] font-bold text-text-primary">
            Sổ địa chỉ
          </h2>
          <p className="text-[12.5px] text-text-secondary mt-1">
            Quản lý các địa chỉ nhận hàng của bạn để tự động điền khi thanh toán
          </p>
        </div>

        {!showAddForm && (
          <Button
            variant="primary"
            size="md"
            onClick={() => setShowAddForm(true)}
            className="w-full sm:w-auto rounded-lg font-bold px-5 py-3 text-[13.5px] inline-flex items-center justify-center gap-2 shrink-0"
          >
            <Plus size={16} />
            <span>Thêm địa chỉ mới</span>
          </Button>
        )}
      </div>

      {showAddForm && (
        <AddAddressForm
          onCancel={() => setShowAddForm(false)}
          onSuccess={() => setShowAddForm(false)}
          isFirstAddress={addresses.length === 0}
        />
      )}

      <ListAddress addresses={addresses} />
    </div>
  );
}
