"use client";

import React, { useState, useMemo } from "react";
import {
  MOCK_ORDERS,
  OrderStatusFilter,
  DateRangeFilter,
  SortOption,
} from "./constants";
import { OrderStatusTabs } from "./components/OrderStatusTabs";
import { OrderFilterBar } from "./components/OrderFilterBar";
import { OrdersTable } from "./components/OrdersTable";

export function OrdersListScreen() {
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<DateRangeFilter>("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("NEWEST");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter and sort logic
  const filteredOrders = useMemo(() => {
    return MOCK_ORDERS.filter((order) => {
      // 1. Status Filter
      if (statusFilter !== "ALL" && order.status !== statusFilter) {
        return false;
      }

      // 2. Search Query (orderCode, customerName, phone)
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase().trim();
        const matchCode = order.orderCode.toLowerCase().includes(query);
        const matchName = order.customerName.toLowerCase().includes(query);
        const matchPhone = order.phone.toLowerCase().includes(query);

        if (!matchCode && !matchName && !matchPhone) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "NEWEST") return b.id.localeCompare(a.id);
      if (sortBy === "OLDEST") return a.id.localeCompare(b.id);
      if (sortBy === "TOTAL_HIGH") return b.totalAmount - a.totalAmount;
      if (sortBy === "TOTAL_LOW") return a.totalAmount - b.totalAmount;
      return 0;
    });
  }, [statusFilter, searchQuery, dateFilter, sortBy]);

  // Reset filter handler
  const handleResetFilter = () => {
    setStatusFilter("ALL");
    setSearchQuery("");
    setDateFilter("ALL");
    setSortBy("NEWEST");
    setPage(1);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-text-highlight">Quản lý Đơn hàng</h1>
          <p className="text-xs text-text-muted mt-0.5">
            Theo dõi, lọc và xử lý toàn bộ đơn hàng của tiệm
          </p>
        </div>
      </div>

      <OrderStatusTabs
        currentTab={statusFilter}
        onSelectTab={(tab) => {
          setStatusFilter(tab);
          setPage(1);
        }}
        orders={MOCK_ORDERS}
      />

      <OrderFilterBar
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setPage(1);
        }}
        dateFilter={dateFilter}
        onDateFilterChange={(d) => {
          setDateFilter(d);
          setPage(1);
        }}
        sortBy={sortBy}
        onSortByChange={(s) => {
          setSortBy(s);
          setPage(1);
        }}
        onResetFilter={handleResetFilter}
        totalFilteredCount={filteredOrders.length}
      />

      <OrdersTable
        orders={filteredOrders}
        totalCount={filteredOrders.length}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
