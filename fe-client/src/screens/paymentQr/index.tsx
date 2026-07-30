"use client";

import React, { useState, useEffect } from "react";
import { useGetPaymentQrQuery } from "@/services/api/paymentApi";
import PaymentLoadingView from "./components/PaymentLoadingView";
import PaymentErrorView from "./components/PaymentErrorView";
import PaymentSuccessView from "./components/PaymentSuccessView";
import PaymentPendingView from "./components/PaymentPendingView";
import PaymentExpiredView from "./components/PaymentExpiredView";

interface PaymentQrScreenProps {
  orderId: string;
}

export default function PaymentQrScreen({ orderId }: PaymentQrScreenProps) {
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60);

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
  const isExpired =
    timeLeft <= 0 ||
    qrData?.paymentStatus === "EXPIRED" ||
    qrData?.paymentStatus === "CANCELLED" ||
    qrData?.orderStatus === "CANCELLED";

  useEffect(() => {
    if (!qrData) return;

    const calculateRemainingSeconds = () => {
      let expiresTimeMs: number;
      if (qrData.expiresAt) {
        expiresTimeMs = new Date(qrData.expiresAt).getTime();
      } else if (qrData.createdAt) {
        expiresTimeMs = new Date(qrData.createdAt).getTime() + 15 * 60 * 1000;
      } else {
        expiresTimeMs = Date.now() + 15 * 60 * 1000;
      }

      const diffSeconds = Math.floor((expiresTimeMs - Date.now()) / 1000);
      return Math.max(0, diffSeconds);
    };

    setTimeLeft(calculateRemainingSeconds());
  }, [qrData?.createdAt, qrData?.expiresAt]);

  useEffect(() => {
    if (isPaid || isExpired) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isPaid, isExpired]);

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

  if (isExpired) {
    return <PaymentExpiredView qrData={qrData} />;
  }

  return (
    <PaymentPendingView
      qrData={qrData}
      timeLeft={timeLeft}
    />
  );
}
