"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CartBreadcrumbs from "./components/CartBreadcrumbs";
import CartItemList from "./components/CartItemList";
import VoucherAndPoints from "./components/VoucherAndPoints";
import CartSummary from "./components/CartSummary";
import CartEmptyState from "./components/CartEmptyState";
import CartRelatedProducts from "./components/CartRelatedProducts";
import MobileCartActionBar from "./components/MobileCartActionBar";
import LoginRequiredModal from "@/components/modals/LoginRequiredModal";
import { hasAuthTokens } from "@/services/authStorage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateQuantity, removeFromCart, clearCart } from "@/store/slices/cartSlice";
import { Voucher, CartSummaryData } from "@/types/cart.type";
import {
  STANDARD_SHIPPING_FEE,
  MOCK_USER_POINTS,
  LOYALTY_POINTS_CONVERSION_RATE,
} from "./constants";

export default function CartScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [usePoints, setUsePoints] = useState(false);
  const [isAuthRequiredOpen, setIsAuthRequiredOpen] = useState(false);

  const handleQtyChange = (id: number | string, delta: number) => {
    dispatch(updateQuantity({ id, delta }));
  };

  const handleRemoveItem = (id: number | string) => {
    dispatch(removeFromCart(id));
  };

  const handleClearAll = () => {
    dispatch(clearCart());
    setAppliedVoucher(null);
    setUsePoints(false);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const shippingFee = subtotal === 0 ? 0 : STANDARD_SHIPPING_FEE;

  const voucherDiscount = appliedVoucher ? appliedVoucher.discountAmount : 0;
  const pointsDiscount = usePoints ? MOCK_USER_POINTS * LOYALTY_POINTS_CONVERSION_RATE : 0;

  const total = Math.max(0, subtotal + shippingFee - voucherDiscount - pointsDiscount);

  const summaryData: CartSummaryData = {
    subtotal,
    shippingFee,
    voucherDiscount,
    pointsDiscount,
    total,
  };

  const hasOutOfStockItem = cartItems.some((item) => !item.isAvailable || (item.stock !== undefined && item.stock <= 0));

  const handleCheckoutClick = () => {
    if (!hasAuthTokens()) {
      setIsAuthRequiredOpen(true);
      return;
    }

    router.push("/thanh-toan");
  };

  if (cartItems.length === 0) {
    return (
      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4 md:px-6 w-full">
          <CartBreadcrumbs />
          <CartEmptyState />
          <CartRelatedProducts />
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 py-8 pb-28 md:pb-0 text-left">
      <div className="max-w-6xl mx-auto px-4 md:px-6 w-full">
        <CartBreadcrumbs />

        <h1 className="text-center text-[24px] md:text-[28px] font-bold text-text-primary mb-6">
          Giỏ hàng
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 flex flex-col gap-4">
            <CartItemList
              items={cartItems}
              onQtyChange={handleQtyChange}
              onRemoveItem={handleRemoveItem}
              onClearAll={handleClearAll}
            />

            <VoucherAndPoints
              appliedVoucher={appliedVoucher}
              onApplyVoucher={setAppliedVoucher}
              usePoints={usePoints}
              onTogglePoints={setUsePoints}
              subtotal={subtotal}
            />
          </div>

          <div className="lg:col-span-4">
            <CartSummary
              summary={summaryData}
              isCheckoutDisabled={hasOutOfStockItem}
              onCheckoutClick={handleCheckoutClick}
            />
          </div>
        </div>

        <CartRelatedProducts />
      </div>

      <MobileCartActionBar
        total={total}
        isCheckoutDisabled={hasOutOfStockItem}
        onCheckoutClick={handleCheckoutClick}
      />

      <LoginRequiredModal
        isOpen={isAuthRequiredOpen}
        onClose={() => setIsAuthRequiredOpen(false)}
      />
    </main>
  );
}
