"use client";

import React, { useState, useMemo } from "react";
import { toast } from "react-toastify";
import { useTableFilters } from "@/hooks/useTableFilters";
import {
  useListCustomersQuery,
  useUpdateCustomerStatusMutation,
} from "@/services/api/customerApi";
import type {
  AdminCustomerListItem,
  AdminCustomerListQueryDto,
  CustomerStatus,
} from "@/types/customer.type";
import { DEFAULT_CUSTOMER_FILTERS } from "./constants";
import { CustomerFilterBar } from "./components/CustomerFilterBar";
import { CustomerTable } from "./components/CustomerTable";
import { Modal } from "@/components/ui/Modal";

export function CustomersListScreen() {
  const { filters, setFilter, setFilters, resetFilters } = useTableFilters(
    DEFAULT_CUSTOMER_FILTERS
  );

  const [pendingToggleCustomer, setPendingToggleCustomer] = useState<{
    customer: AdminCustomerListItem;
    nextStatus: CustomerStatus;
  } | null>(null);

  const queryDto: AdminCustomerListQueryDto = useMemo(() => {
    return {
      page: filters.page,
      limit: filters.limit,
      search: filters.search.trim() || undefined,
      status: filters.status === "ALL" ? undefined : filters.status,
    };
  }, [filters]);

  const { data, isLoading, isFetching } = useListCustomersQuery(queryDto);

  const [updateCustomerStatus, { isLoading: isUpdating }] =
    useUpdateCustomerStatusMutation();

  const customers = data?.items || [];
  const totalCount = data?.pagination.total || 0;

  const handleRequestToggleStatus = (
    customerId: string,
    currentStatus: CustomerStatus
  ) => {
    const customer = customers.find((c) => c.id === customerId);
    if (!customer) return;
    const nextStatus: CustomerStatus =
      currentStatus === "ACTIVE" ? "LOCKED" : "ACTIVE";
    setPendingToggleCustomer({ customer, nextStatus });
  };

  const handleConfirmToggleStatus = async () => {
    if (!pendingToggleCustomer) return;

    try {
      await updateCustomerStatus({
        id: pendingToggleCustomer.customer.id,
        body: { status: pendingToggleCustomer.nextStatus },
      }).unwrap();

      toast.success(
        pendingToggleCustomer.nextStatus === "ACTIVE"
          ? "Mở khóa tài khoản khách hàng thành công."
          : "Đã tạm khóa tài khoản khách hàng."
      );
      setPendingToggleCustomer(null);
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Không thể cập nhật trạng thái khách hàng."
      );
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-highlight tracking-tight">
            Quản lý Khách Hàng
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Quản lý danh sách khách hàng và trạng thái tài khoản
          </p>
        </div>
      </div>

      <CustomerFilterBar
        filters={filters}
        onFilterChange={(updated) => setFilters(updated)}
        onResetFilter={resetFilters}
      />

      <CustomerTable
        customers={customers}
        totalItems={totalCount}
        page={filters.page}
        pageSize={filters.limit}
        isLoading={isLoading || isFetching}
        onPageChange={(page) => setFilter("page", page)}
        onToggleStatus={handleRequestToggleStatus}
      />

      <Modal
        isOpen={Boolean(pendingToggleCustomer)}
        onClose={() => {
          if (!isUpdating) setPendingToggleCustomer(null);
        }}
        onConfirm={handleConfirmToggleStatus}
        isLoading={isUpdating}
        type={
          pendingToggleCustomer?.nextStatus === "LOCKED" ? "DANGER" : "CONFIRM"
        }
        title={
          pendingToggleCustomer?.nextStatus === "LOCKED"
            ? "Tạm khóa tài khoản khách hàng"
            : "Mở khóa tài khoản khách hàng"
        }
        description={
          pendingToggleCustomer?.nextStatus === "LOCKED"
            ? `Bạn có chắc chắn muốn tạm khóa tài khoản của khách hàng "${
                pendingToggleCustomer?.customer.fullName ||
                pendingToggleCustomer?.customer.name
              }" (${
                pendingToggleCustomer?.customer.code
              }) không? Khách hàng sẽ không thể đăng nhập hoặc đặt mua trên website.`
            : `Bạn có chắc chắn muốn mở khóa tài khoản cho khách hàng "${
                pendingToggleCustomer?.customer.fullName ||
                pendingToggleCustomer?.customer.name
              }" không?`
        }
        confirmText={
          pendingToggleCustomer?.nextStatus === "LOCKED"
            ? "Khóa tài khoản"
            : "Mở khóa tài khoản"
        }
        cancelText="Bỏ qua"
        size="sm"
      />
    </div>
  );
}
