"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import CheckoutBreadcrumbs from "./components/CheckoutBreadcrumbs";
import ShippingForm from "./components/ShippingForm";
import PaymentMethodSelector from "./components/PaymentMethodSelector";
import OrderReviewItems from "./components/OrderReviewItems";
import CheckoutSummary from "./components/CheckoutSummary";
import MobileCheckoutActionBar from "./components/MobileCheckoutActionBar";
import LoginRequiredModal from "@/components/modals/LoginRequiredModal";
import { hasAuthTokens } from "@/services/authStorage";
import { useAppSelector } from "@/store/hooks";
import { CartSummaryData } from "@/types/cart.type";
import { CheckoutFormData } from "./types";

export default function CheckoutScreen() {
  const router = useRouter();
  const cartItems = useAppSelector((state) => state.cart.items);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthRequiredOpen, setIsAuthRequiredOpen] = useState(false);

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

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = subtotal === 0 ? 0 : 30000;
  const voucherDiscount = 0;
  const pointsDiscount = 0;
  const total = Math.max(0, subtotal + shippingFee - voucherDiscount - pointsDiscount);

  const summaryData: CartSummaryData = {
    subtotal,
    shippingFee,
    voucherDiscount,
    pointsDiscount,
    total,
  };

  useEffect(() => {
    if (!hasAuthTokens()) {
      setIsAuthRequiredOpen(true);
    }
  }, []);

  const onSubmit = (data: CheckoutFormData) => {
    if (!hasAuthTokens()) {
      setIsAuthRequiredOpen(true);
      return;
    }

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

  if (cartItems.length === 0) {
    return (
      <main className="flex-1 py-16 text-center px-4">
        <h2 className="text-[18px] font-bold text-text-primary mb-3">
          Giỏ hàng của bạn đang trống
        </h2>
        <p className="text-[13px] text-text-secondary mb-6">
          Vui lòng thêm sản phẩm vào giỏ hàng trước khi tiến hành thanh toán.
        </p>
        <button
          onClick={() => router.push("/san-pham")}
          className="px-6 py-2.5 bg-secondary text-white font-bold text-xs rounded-md"
        >
          Quay lại cửa hàng
        </button>
      </main>
    );
  }

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

      <LoginRequiredModal
        isOpen={isAuthRequiredOpen}
        onClose={() => setIsAuthRequiredOpen(false)}
      />
    </main>
  );
}
