"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Trash2, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import MobileBottomSheet from "@/components/ui/MobileBottomSheet";
import Modal from "@/components/ui/Modal";
import CartModalSkeleton from "@/components/skeletons/cart/CartModalSkeleton";
import { CartItem } from "@/types/cart.type";
import { useGetCartProductsMutation } from "@/services/api/cartApi";
import { useAppDispatch } from "@/store/hooks";
import { syncCartWithApiData } from "@/store/slices/cartSlice";
import { useModal } from "@/hooks/useModal";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLDivElement | null>;
  cartItems: CartItem[];
  onQtyChange: (id: string | number, delta: number) => void;
  onRemoveItem: (id: string | number) => void;
  onClearAll: () => void;
}

export default function CartModal({
  isOpen,
  onClose,
  triggerRef,
  cartItems,
  onQtyChange,
  onRemoveItem,
  onClearAll
}: CartModalProps) {
  const desktopModalRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const [getCartProducts, { isLoading: isSyncing }] = useGetCartProductsMutation();
  const confirmClearModal = useModal();

  const handleConfirmClear = () => {
    onClearAll();
    confirmClearModal.closeModal();
  };

  useEffect(() => {
    if (!isOpen || cartItems.length === 0) return;

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
        });
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!isOpen) return;
      const target = event.target as HTMLElement;

      if (!target || !document.body.contains(target)) return;

      if (
        window.innerWidth < 768 ||
        target?.closest?.('[data-mobile-bottom-sheet]')
      ) {
        return;
      }

      if (
        desktopModalRef.current &&
        !desktopModalRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, triggerRef]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "đ";
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <>
      <div
        ref={desktopModalRef}
        className="hidden md:flex flex-col absolute right-0 top-full mt-2 w-96 bg-surface border border-border rounded-xl shadow-xl z-50 overflow-hidden text-left animate-in fade-in slide-in-from-top-2 duration-200"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface select-none">
          <div className="flex items-center gap-2">
            <ShoppingCart size={16} className="text-secondary" />
            <span className="text-[13.5px] font-bold text-text-primary">Giỏ hàng của bạn ({cartCount})</span>
            {isSyncing && (
              <span title="Đang đồng bộ...">
                <Loader2 size={13} className="animate-spin text-secondary shrink-0" />
              </span>
            )}
          </div>
          {cartItems.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                confirmClearModal.openModal();
              }}
              className="text-[11.5px] font-medium text-text-secondary hover:text-error transition-colors"
            >
              Xóa tất cả
            </button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-border/60 px-4">
          {isSyncing ? (
            <CartModalSkeleton />
          ) : cartItems.length === 0 ? (
            <div className="py-8 text-center flex flex-col items-center justify-center">
              <ShoppingCart size={32} className="text-text-secondary/40 mb-2" />
              <p className="text-[13px] text-text-secondary font-medium">Giỏ hàng của bạn đang trống</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="py-3.5 flex items-center gap-3 group">
                <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-border/80 shrink-0 bg-background">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-[12.5px] font-bold text-text-primary truncate group-hover:text-secondary transition-colors">
                    {item.name}
                  </h4>
                  {item.color && (
                    <p className="text-[11px] text-text-secondary">
                      Phân loại: <span className="font-semibold text-text-primary">{item.color}</span>
                    </p>
                  )}
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-[12px] font-bold text-secondary">{formatPrice(item.price)}</span>
                    {item.originalPrice && (
                      <span className="text-[10px] text-text-secondary line-through">{formatPrice(item.originalPrice)}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center border border-border rounded-md bg-surface overflow-hidden">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onQtyChange(item.id, -1);
                    }}
                    className="w-6 h-6 flex items-center justify-center text-text-secondary hover:bg-background text-xs font-bold"
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-[11px] font-bold text-text-primary">{item.quantity}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onQtyChange(item.id, 1);
                    }}
                    className="w-6 h-6 flex items-center justify-center text-text-secondary hover:bg-background text-xs font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveItem(item.id);
                  }}
                  className="text-text-secondary/60 hover:text-error transition-colors p-1"
                  title="Xóa sản phẩm"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-4 border-t border-border bg-surface flex flex-col gap-3">
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-text-secondary font-medium">Tạm tính:</span>
              <span className="text-[15px] font-bold text-secondary">{formatPrice(totalPrice)}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Link href="/gio-hang" onClick={onClose}>
                <Button variant="outline" size="sm" className="w-full text-xs font-semibold py-2">
                  Xem giỏ hàng
                </Button>
              </Link>
              <Link href="/thanh-toan" onClick={onClose}>
                <Button variant="primary" size="sm" className="w-full text-xs font-bold py-2">
                  Thanh toán
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      <MobileBottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title={`Giỏ hàng (${cartCount})`}
      >
        <div className="flex flex-col gap-3 text-left">
          <div className="max-h-[55vh] overflow-y-auto divide-y divide-border/60">
            {isSyncing ? (
              <CartModalSkeleton />
            ) : cartItems.length === 0 ? (
              <div className="py-8 text-center flex flex-col items-center justify-center">
                <ShoppingCart size={36} className="text-text-secondary/40 mb-2" />
                <p className="text-[13px] text-text-secondary font-medium">Giỏ hàng của bạn đang trống</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="py-3 flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-border/80 shrink-0 bg-background">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] font-bold text-text-primary truncate">{item.name}</h4>
                    {item.color && (
                      <p className="text-[11px] text-text-secondary">
                        Phân loại: <span className="font-semibold text-text-primary">{item.color}</span>
                      </p>
                    )}
                    <span className="text-[12px] font-bold text-secondary">{formatPrice(item.price)}</span>
                  </div>

                  <div className="flex items-center border border-border rounded-md bg-surface overflow-hidden">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onQtyChange(item.id, -1);
                      }}
                      className="w-6 h-6 flex items-center justify-center text-text-secondary text-xs font-bold"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-[11px] font-bold text-text-primary">{item.quantity}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onQtyChange(item.id, 1);
                      }}
                      className="w-6 h-6 flex items-center justify-center text-text-secondary text-xs font-bold"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveItem(item.id);
                    }}
                    className="text-text-secondary/60 hover:text-error p-1"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="pt-3 border-t border-border flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-text-secondary font-medium">Tạm tính:</span>
                <span className="text-[15px] font-bold text-secondary">{formatPrice(totalPrice)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/gio-hang" onClick={onClose}>
                  <Button variant="outline" size="md" className="w-full text-xs font-semibold py-2.5">
                    Xem giỏ hàng
                  </Button>
                </Link>
                <Link href="/thanh-toan" onClick={onClose}>
                  <Button variant="primary" size="md" className="w-full text-xs font-bold py-2.5">
                    Thanh toán
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </MobileBottomSheet>

      <Modal
        isOpen={confirmClearModal.isOpen}
        onClose={confirmClearModal.closeModal}
        title="Xóa tất cả sản phẩm?"
        description="Bạn có chắc chắn muốn xóa toàn bộ sản phẩm khỏi giỏ hàng không? Thao tác này không thể hoàn tác."
        onConfirm={handleConfirmClear}
        confirmLabel="Xóa tất cả"
        cancelLabel="Hủy"
        isDestructive={true}
      />
    </>
  );
}
