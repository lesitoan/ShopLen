"use client";

import React, { useState } from "react";
import OrderLookupHeader from "./components/OrderLookupHeader";
import OrderLookupForm from "./components/OrderLookupForm";
import OrderLookupResult from "./components/OrderLookupResult";
import { MOCK_LOOKUP_ORDERS, OrderDetail } from "./constants";
import { AlertCircle } from "lucide-react";

export default function OrderLookupScreen() {
  const [searchedOrder, setSearchedOrder] = useState<OrderDetail | null>(MOCK_LOOKUP_ORDERS[0]);
  const [hasSearched, setHasSearched] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = ({ orderCode, phone }: { orderCode: string; phone: string }) => {
    setIsLoading(true);
    setNotFound(false);

    setTimeout(() => {
      const cleanedCode = orderCode.trim().toUpperCase();
      const cleanedPhone = phone.trim().replace(/\D/g, "");

      const found = MOCK_LOOKUP_ORDERS.find(
        (o) =>
          o.orderCode.toUpperCase() === cleanedCode &&
          o.phone.replace(/\D/g, "") === cleanedPhone
      );

      setHasSearched(true);
      setIsLoading(false);

      if (found) {
        setSearchedOrder(found);
        setNotFound(false);
      } else {
        setSearchedOrder(null);
        setNotFound(true);
      }
    }, 400);
  };

  return (
    <main className="flex-1 flex flex-col">
      <OrderLookupHeader />

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8 flex flex-col gap-8 w-full">
        <OrderLookupForm onSearch={handleSearch} isLoading={isLoading} />

        {notFound && (
          <div className="border border-red-200 bg-red-50/50 rounded-xl p-5 text-center flex flex-col items-center gap-2 animate-in fade-in duration-200">
            <AlertCircle size={28} className="text-red-500" />
            <h3 className="text-[15px] font-bold text-red-600">Không tìm thấy đơn hàng</h3>
            <p className="text-[13px] text-text-secondary max-w-md">
              Vui lòng kiểm tra lại Mã đơn hàng (ví dụ: TLNK8899) và Số điện thoại bạn đã dùng khi chốt đơn.
            </p>
          </div>
        )}

        {hasSearched && searchedOrder && <OrderLookupResult order={searchedOrder} />}
      </div>
    </main>
  );
}
