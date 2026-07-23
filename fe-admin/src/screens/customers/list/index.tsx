"use client";

import React, { useState, useMemo } from "react";
import {
  MOCK_CUSTOMERS_DATA,
  CustomerListItem,
  CustomerStatus,
  CustomerFilterState,
} from "./constants";
import { CustomerFilterBar } from "./components/CustomerFilterBar";
import { CustomerTable } from "./components/CustomerTable";
import { Modal } from "@/components/ui/Modal";

export function CustomersListScreen() {
  const [customers, setCustomers] = useState<CustomerListItem[]>(MOCK_CUSTOMERS_DATA);

  const [pendingToggleCustomer, setPendingToggleCustomer] = useState<{
    customer: CustomerListItem;
    nextStatus: CustomerStatus;
  } | null>(null);

  const [filters, setFilters] = useState<CustomerFilterState>({
    searchQuery: "",
    statusFilter: "ALL",
    page: 1,
    pageSize: 10,
  });

  const handleFilterChange = (updated: Partial<CustomerFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleRequestToggleStatus = (customerId: string, currentStatus: CustomerStatus) => {
    const customer = customers.find((c) => c.id === customerId);
    if (!customer) return;
    const nextStatus: CustomerStatus = currentStatus === "ACTIVE" ? "LOCKED" : "ACTIVE";
    setPendingToggleCustomer({ customer, nextStatus });
  };

  const handleConfirmToggleStatus = () => {
    if (pendingToggleCustomer) {
      const { customer, nextStatus } = pendingToggleCustomer;
      setCustomers((prev) =>
        prev.map((c) => {
          if (c.id === customer.id) {
            return {
              ...c,
              status: nextStatus,
            };
          }
          return c;
        })
      );
      setPendingToggleCustomer(null);
    }
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter((cust) => {
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = cust.name.toLowerCase().includes(query);
        const matchesCode = cust.code.toLowerCase().includes(query);
        const matchesEmail = cust.email.toLowerCase().includes(query);
        const matchesPhone = cust.phone.toLowerCase().includes(query);
        if (!matchesName && !matchesCode && !matchesEmail && !matchesPhone) return false;
      }

      if (filters.statusFilter !== "ALL" && cust.status !== filters.statusFilter) {
        return false;
      }

      return true;
    });
  }, [customers, filters]);

  const totalCount = filteredCustomers.length;

  const paginatedCustomers = useMemo(() => {
    const start = (filters.page - 1) * filters.pageSize;
    return filteredCustomers.slice(start, start + filters.pageSize);
  }, [filteredCustomers, filters.page, filters.pageSize]);

  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-highlight tracking-tight">
            Quản lý Khách Hàng
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Quản lý danh sách khách hàng, điểm thưởng tích lũy và lịch sử mua hàng
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <CustomerFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {/* Customer Table */}
      <CustomerTable
        customers={paginatedCustomers}
        totalItems={totalCount}
        page={filters.page}
        pageSize={filters.pageSize}
        onPageChange={(page) => handleFilterChange({ page })}
        onToggleStatus={handleRequestToggleStatus}
      />

      {/* Confirm Toggle Status Modal */}
      <Modal
        isOpen={Boolean(pendingToggleCustomer)}
        onClose={() => setPendingToggleCustomer(null)}
        onConfirm={handleConfirmToggleStatus}
        type={pendingToggleCustomer?.nextStatus === "LOCKED" ? "DANGER" : "CONFIRM"}
        title={
          pendingToggleCustomer?.nextStatus === "LOCKED"
            ? "Tạm khóa tài khoản khách hàng"
            : "Mở khóa tài khoản khách hàng"
        }
        description={
          pendingToggleCustomer?.nextStatus === "LOCKED"
            ? `Bạn có chắc chắn muốn tạm khóa tài khoản của khách hàng "${pendingToggleCustomer?.customer.name}" (${pendingToggleCustomer?.customer.code}) không? Khách hàng sẽ không thể đăng nhập hoặc đặt mua trên website.`
            : `Bạn có chắc chắn muốn mở khóa tài khoản cho khách hàng "${pendingToggleCustomer?.customer.name}" không?`
        }
        confirmText={
          pendingToggleCustomer?.nextStatus === "LOCKED" ? "Khóa tài khoản" : "Mở khóa tài khoản"
        }
        cancelText="Bỏ qua"
        size="sm"
      />
    </div>
  );
}
