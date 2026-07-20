"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import CheckoutBreadcrumbs from "./components/CheckoutBreadcrumbs";
import ShippingForm from "./components/ShippingForm";
import PaymentMethodSelector from "./components/PaymentMethodSelector";
import OrderReviewItems from "./components/OrderReviewItems";
import CheckoutSummary from "./components/CheckoutSummary";
import MobileCheckoutActionBar from "./components/MobileCheckoutActionBar";

import { CheckoutFormData, CheckoutSummaryData } from "./types";
import { INITIAL_CHECKOUT_ITEMS } from "./constants";

export default function CheckoutScreen() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      address: "",
      province: "",
      note: "",
      confirmTerms: false,
    },
    mode: "onTouched",
  });

  const cartItems = INITIAL_CHECKOUT_ITEMS;
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = subtotal >= 700000 ? 0 : 30000;
  const voucherDiscount = 0;
  const pointsDiscount = 0;
  const total = Math.max(0, subtotal + shippingFee - voucherDiscount - pointsDiscount);

  const summaryData: CheckoutSummaryData = {
    subtotal,
    shippingFee,
    voucherDiscount,
    pointsDiscount,
    total,
  };

  const onSubmit = (data: CheckoutFormData) => {
    setIsSubmitting(true);
    console.log("Order submission payload:", {
      shippingInfo: data,
      paymentMethod: "qr_bank",
      items: cartItems,
      total,
    });

    setTimeout(() => {
      const mockOrderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
      router.push(`/thanh-toan/qr/${mockOrderId}`);
    }, 800);
  };

  return (
    <main className="flex-1 py-8 pb-28 md:pb-0 text-left">
      <div className="max-w-6xl mx-auto px-4 md:px-6 w-full">
        <CheckoutBreadcrumbs />

        <h1 className="text-center text-[24px] md:text-[28px] font-bold text-text-primary mb-6">
          Thanh toán đơn hàng
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 flex flex-col gap-6">
              <ShippingForm
                register={register}
                errors={errors}
                control={control}
              />

              <PaymentMethodSelector />
            </div>

            <div className="lg:col-span-5 flex flex-col gap-6">
              <OrderReviewItems items={cartItems} />

              <CheckoutSummary
                summary={summaryData}
                isSubmitting={isSubmitting}
                register={register}
                errors={errors}
                control={control}
              />
            </div>
          </div>

          <MobileCheckoutActionBar
            total={total}
            isSubmitting={isSubmitting}
            register={register}
            errors={errors}
            control={control}
          />
        </form>
      </div>
    </main>
  );
}
