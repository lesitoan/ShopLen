"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CartBreadcrumbs from "./components/CartBreadcrumbs";
import CartItemList from "./components/CartItemList";
import VoucherAndPoints from "./components/VoucherAndPoints";
import CartSummary from "./components/CartSummary";
import CartEmptyState from "./components/CartEmptyState";
import CartRelatedProducts from "./components/CartRelatedProducts";
import MobileCartActionBar from "./components/MobileCartActionBar";
import Modal from "@/components/ui/Modal";
import CartSkeleton from "@/components/skeletons/cart/CartSkeleton";
import { useModal } from "@/hooks/useModal";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateQuantity, removeFromCart, clearCart, syncCartWithApiData } from "@/store/slices/cartSlice";
import { useGetCartProductsMutation } from "@/services/api/cartApi";
import { Voucher, CartSummaryData } from "@/types/cart.type";
import { STANDARD_SHIPPING_FEE } from "./constants";

export default function CartScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const [getCartProducts, { isLoading: isSyncing }] = useGetCartProductsMutation();
  const [mounted, setMounted] = useState(false);

  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const confirmClearModal = useModal();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (cartItems.length === 0) return;
    const productIds = Array.from(
      new Set(
        cartItems
          .map((item) => item.productId || String(item.id).split("-")[0])
          .filter((id) => Boolean(id) && id.length > 0)
      )
    );

    if (productIds.length > 0) {
      getCartProducts({ ids: productIds })
        .unwrap()
        .then((res) => {
          if (res && Array.isArray(res.items)) {
            dispatch(syncCartWithApiData(res.items));
          }
        })
        .catch((err) => {
          console.error("Failed to sync cart on CartScreen:", err);
        });
    }
  }, []);

  const handleQtyChange = (id: number | string, delta: number) => {
    dispatch(updateQuantity({ id, delta }));
  };

  const handleRemoveItem = (id: number | string) => {
    dispatch(removeFromCart(id));
  };

  const handleConfirmClearAll = () => {
    dispatch(clearCart());
    setAppliedVoucher(null);
    confirmClearModal.closeModal();
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const shippingFee = subtotal === 0 ? 0 : STANDARD_SHIPPING_FEE;

  const voucherDiscount = appliedVoucher ? appliedVoucher.discountAmount : 0;
  const pointsDiscount = 0;

  const total = Math.max(0, subtotal + shippingFee - voucherDiscount);

  const summaryData: CartSummaryData = {
    subtotal,
    shippingFee,
    voucherDiscount,
    pointsDiscount,
    total,
  };

  const hasOutOfStockItem = cartItems.some((item) => !item.isAvailable || (item.stock !== undefined && item.stock <= 0));

  const handleCheckoutClick = () => {
    router.push("/thanh-toan");
  };

  if (!mounted || isSyncing) {
    return <CartSkeleton />;
  }

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
    <main className="flex-1 py-8 pb-28 md:pb-16 text-left">
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
              onClearAll={confirmClearModal.openModal}
            />

            <VoucherAndPoints
              appliedVoucher={appliedVoucher}
              onApplyVoucher={setAppliedVoucher}
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

      <Modal
        isOpen={confirmClearModal.isOpen}
        onClose={confirmClearModal.closeModal}
        title="Xóa tất cả sản phẩm?"
        description="Bạn có chắc chắn muốn xóa toàn bộ sản phẩm khỏi giỏ hàng không? Thao tác này không thể hoàn tác."
        onConfirm={handleConfirmClearAll}
        confirmLabel="Xóa tất cả"
        cancelLabel="Hủy"
        isDestructive={true}
      />
    </main>
  );
}
