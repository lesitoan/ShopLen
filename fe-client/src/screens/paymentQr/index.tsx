"use client";

import React, { useState, useEffect } from "react";
import { useGetPaymentQrQuery } from "@/services/api/paymentApi";
import PaymentLoadingView from "./components/PaymentLoadingView";
import PaymentErrorView from "./components/PaymentErrorView";
import PaymentSuccessView from "./components/PaymentSuccessView";
import PaymentPendingView from "./components/PaymentPendingView";

interface PaymentQrScreenProps {
  orderId: string;
}

export default function PaymentQrScreen({ orderId }: PaymentQrScreenProps) {
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  const {
    data: qrData,
    isLoading,
    isError,
    refetch,
  } = useGetPaymentQrQuery(orderId, {
    pollingInterval: 4000,
    skip: !orderId,
  });

  const isPaid = qrData?.paymentStatus === "PAID";

  useEffect(() => {
    if (isPaid || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isPaid]);

  if (isLoading) {
    return <PaymentLoadingView />;
  }

  if (isError || !qrData) {
    return <PaymentErrorView onRetry={refetch} />;
  }

  if (isPaid) {
    return (
      <PaymentSuccessView
        orderCode={qrData.orderCode}
        amount={qrData.amount}
      />
    );
  }

  return (
    <PaymentPendingView
      qrData={qrData}
      timeLeft={timeLeft}
    />
  );
}
