"use client";

import React, { useMemo } from "react";
import { useTableFilters } from "@/hooks/useTableFilters";
import { useListOrdersQuery } from "@/services/api/orderApi";
import type { AdminOrderListQueryDto, OrderStatus } from "@/types/order.type";
import { OrderListHeader } from "./components/OrderListHeader";
import { OrderStatusTabs } from "./components/OrderStatusTabs";
import { OrderFilterBar } from "./components/OrderFilterBar";
import { OrdersTable } from "./components/OrdersTable";
import { DEFAULT_ORDER_FILTERS, OrderStatusFilter } from "./constants";
import { toast } from "react-toastify";

export function OrdersListScreen() {
  const { filters, setFilter, setFilters, resetFilters } = useTableFilters(
    DEFAULT_ORDER_FILTERS
  );

  const queryDto: AdminOrderListQueryDto = useMemo(() => {
    return {
      page: filters.page,
      limit: filters.limit,
      status:
        filters.status === "ALL"
          ? undefined
          : (filters.status as OrderStatus),
      search: filters.search.trim() || undefined,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
      sort: filters.sort,
    };
  }, [filters]);

  const { data, isLoading, isFetching, isError } = useListOrdersQuery(queryDto);

  const orders = data?.items || [];
  const totalCount = data?.pagination.total || 0;

  const handleExportExcel = () => {
    toast.info("Tính năng đang phát triển", {
      position: "top-right",
      autoClose: 5000,
    });
  };

  return (
    <div className="space-y-5">
      <OrderListHeader
        totalCount={totalCount}
        onExportExcel={handleExportExcel}
      />

      <OrderStatusTabs
        currentTab={filters.status as OrderStatusFilter}
        onSelectTab={(tab) => setFilter("status", tab)}
      />

      <OrderFilterBar
        searchQuery={filters.search}
        onSearchChange={(q) => setFilter("search", q)}
        dateRange={{
          startDate: filters.startDate,
          endDate: filters.endDate,
        }}
        onDateRangeChange={(range) =>
          setFilters({
            startDate: range.startDate,
            endDate: range.endDate,
          })
        }
        sortBy={filters.sort}
        onSortByChange={(s) => setFilter("sort", s)}
        onResetFilter={resetFilters}
      />

      <OrdersTable
        orders={orders}
        totalCount={totalCount}
        page={filters.page}
        pageSize={filters.limit}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        onPageChange={(p) => setFilter("page", p)}
        onPageSizeChange={(limit) => setFilter("limit", limit)}
      />
    </div>
  );
}
