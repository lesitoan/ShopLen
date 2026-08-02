"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { PackageCheck, ChevronLeft, ChevronRight } from "lucide-react";
import OrderHistorySkeleton from "@/components/skeletons/userProfile/OrderHistorySkeleton";
import { useGetCustomerOrdersQuery } from "@/services/api/orderApi";
import { CustomerOrderResponse } from "@/types/order.type";
import { ORDER_FILTER_TABS } from "../constants";
import { OrderSummary, OrderStatus } from "../types";
import OrderCard from "./OrderCard";

interface OrderHistoryTabProps {
  onReorder?: (orderCode: string) => void;
}

export default function OrderHistoryTab({ onReorder }: OrderHistoryTabProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>("ALL");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const tabsContainerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    if (tabsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
      setCanScrollLeft(scrollLeft > 2);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2);
    }
  }, []);

  const handleToggleExpand = (orderId: string) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const { data: apiOrders, isLoading, isError } = useGetCustomerOrdersQuery();

  useEffect(() => {
    checkScroll();
    const timer = setTimeout(checkScroll, 100);
    window.addEventListener("resize", checkScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll, apiOrders, isLoading]);

  const handleScrollLeft = () => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({ left: -220, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({ left: 220, behavior: "smooth" });
    }
  };

  const mapApiOrderToSummary = (apiOrd: CustomerOrderResponse): OrderSummary => {
    let status: OrderStatus = "PENDING";
    let statusLabel = "Chờ xác nhận";

    switch (apiOrd.orderStatus) {
      case "PENDING_PAYMENT":
        status = "PENDING_PAYMENT";
        statusLabel = "Chờ thanh toán";
        break;
      case "PAID":
        status = "PENDING";
        statusLabel = "Chờ xác nhận";
        break;
      case "PACKING":
        status = "PACKING";
        statusLabel = "Đang chuẩn bị hàng";
        break;
      case "SHIPPING":
        status = "SHIPPING";
        statusLabel = "Đang vận chuyển";
        break;
      case "COMPLETED":
        status = "DELIVERED";
        statusLabel = "Đã giao hàng";
        break;
      case "CANCELLATION_REQUESTED":
        status = "CANCELLATION_REQUESTED";
        statusLabel = "Yêu cầu hủy đơn";
        break;
      case "CANCELLED":
        status = "CANCELLED";
        statusLabel = "Đã hủy";
        break;
      default:
        status = "PENDING";
        statusLabel = apiOrd.orderStatus;
    }

    const createdDate = new Date(apiOrd.createdAt);
    const formattedDate = `${createdDate.toLocaleDateString("vi-VN")} ${createdDate.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;

    const items = (apiOrd.items || []).map((it, idx) => {
      const snapshot = it.productSnapshot || {};
      const catName =
        typeof snapshot.category === "object"
          ? snapshot.category?.name
          : snapshot.category;

      return {
        id: idx + 1,
        name: snapshot.name || "Sản phẩm",
        price: it.unitPrice,
        quantity: it.quantity,
        image: snapshot.image || snapshot.images?.[0]?.url || "/logo.png",
        category: catName || "Móc khóa len",
      };
    });

    return {
      id: apiOrd.id,
      orderCode: apiOrd.orderCode,
      createdAt: formattedDate,
      status,
      statusLabel,
      items,
      totalAmount: apiOrd.totalAmount,
      shippingFee: apiOrd.shippingFee,
      paymentMethod: apiOrd.paymentMethod,
    };
  };

  const formattedOrders: OrderSummary[] = (apiOrders || []).map(mapApiOrderToSummary);

  const filteredOrders = formattedOrders.filter((ord) => {
    if (selectedStatus === "ALL") return true;
    return ord.status === selectedStatus;
  });

  const getTabCount = (tabId: OrderStatus) => {
    if (tabId === "ALL") return formattedOrders.length;
    return formattedOrders.filter((ord) => ord.status === tabId).length;
  };

  return (
    <div className="bg-transparent border-0 p-0 sm:bg-surface sm:border sm:border-border sm:rounded-xl sm:p-6 flex flex-col gap-6 text-left">
      <div className="hidden md:block">
        <h2 className="text-[18px] font-bold text-text-primary">
          Đơn hàng của tôi
        </h2>
        <p className="text-[12.5px] text-text-secondary mt-1">
          Theo dõi trạng thái tất cả các đơn hàng bạn đã mua tại Tiệm Len Nhà Kiều
        </p>
      </div>

      <div className="relative flex items-center gap-2 py-1">
        <button
          type="button"
          disabled={!canScrollLeft}
          onClick={handleScrollLeft}
          className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-text-primary hover:bg-primary-light hover:text-secondary hover:border-primary/50 transition-all disabled:opacity-20 disabled:cursor-not-allowed shrink-0"
          title="Cuộn sang trái"
        >
          <ChevronLeft size={16} />
        </button>

        <div
          ref={tabsContainerRef}
          onScroll={checkScroll}
          className="flex items-center gap-2 overflow-x-auto scroll-smooth w-full no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {ORDER_FILTER_TABS.map((tab) => {
            const isActive = selectedStatus === tab.id;
            const count = getTabCount(tab.id);
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedStatus(tab.id)}
                className={`py-2 px-3 rounded-xl text-[13.5px] font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? "bg-primary-light text-secondary font-bold"
                    : "text-text-secondary hover:text-text-primary hover:bg-background/80"
                }`}
              >
                <span>{tab.label}</span>
                {count > 0 && (
                  <span
                    className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold transition-colors ${
                      isActive
                        ? "bg-secondary text-white"
                        : "bg-border/60 text-text-secondary dark:bg-border/40"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          disabled={!canScrollRight}
          onClick={handleScrollRight}
          className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-text-primary hover:bg-primary-light hover:text-secondary hover:border-primary/50 transition-all disabled:opacity-20 disabled:cursor-not-allowed shrink-0"
          title="Cuộn sang phải"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {isLoading ? (
        <OrderHistorySkeleton />
      ) : isError ? (
        <div className="py-12 text-center flex flex-col items-center justify-center gap-3">
          <PackageCheck size={40} className="text-text-secondary/40" />
          <span className="text-[13.5px] text-error font-medium">
            Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.
          </span>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-12 text-center flex flex-col items-center justify-center gap-3">
          <PackageCheck size={40} className="text-text-secondary/40" />
          <span className="text-[13.5px] text-text-secondary">
            Không tìm thấy đơn hàng nào ở trạng thái này
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              isExpanded={expandedOrderId === order.id}
              onToggleExpand={() => handleToggleExpand(order.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
