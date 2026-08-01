"use client";

import React, { useState } from "react";
import OrderLookupHeader from "./components/OrderLookupHeader";
import OrderLookupForm from "./components/OrderLookupForm";
import OrderLookupResult from "./components/OrderLookupResult";
import { AlertCircle } from "lucide-react";
import type { OrderDetailResponse } from "@/types/order.type";

export default function OrderLookupScreen() {
  const [searchedOrder, setSearchedOrder] = useState<OrderDetailResponse | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSuccess = (order: OrderDetailResponse) => {
    setSearchedOrder(order);
    setHasSearched(true);
    setErrorMessage(null);
  };

  const handleError = (msg: string) => {
    setSearchedOrder(null);
    setHasSearched(true);
    setErrorMessage(msg);
  };

  return (
    <main className="flex-1 flex flex-col">
      <OrderLookupHeader />

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8 flex flex-col gap-8 w-full">
        <OrderLookupForm onSuccess={handleSuccess} onError={handleError} />

        {hasSearched && errorMessage && (
          <div className="border border-red-200 bg-red-50/70 dark:bg-red-950/30 rounded-xl p-5 text-center flex flex-col items-center gap-2 animate-in fade-in duration-200">
            <AlertCircle size={28} className="text-red-500" />
            <h3 className="text-[15px] font-bold text-red-600 dark:text-red-400">
              Không tìm thấy đơn hàng
            </h3>
            <p className="text-[13px] text-text-secondary max-w-md">
              {errorMessage}
            </p>
          </div>
        )}

        {hasSearched && searchedOrder && <OrderLookupResult order={searchedOrder} />}
      </div>
    </main>
  );
}
