"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, X, Trash2, Truck, ChevronDown } from "lucide-react";
import Button from "@/components/ui/Button";

interface CartItem {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLDivElement | null>;
  cartItems: CartItem[];
  onQtyChange: (id: number, delta: number) => void;
  onRemoveItem: (id: number) => void;
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
  const [mounted, setMounted] = useState(false);

  // Set mounted on client side to avoid Next.js hydration issues with Portals
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close when clicking outside (desktop only)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!isOpen) return;
      const target = event.target as Node;
      
      // Close only if click is outside both desktop modal and the trigger button
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "đ";
  };

  const mobileBottomSheet = mounted && typeof document !== "undefined" ? createPortal(
    <div 
      className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-surface w-full rounded-t-2xl border-t border-border max-h-[90vh] overflow-y-auto pb-6 flex flex-col animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="w-12 h-1 bg-border/60 rounded-full mx-auto my-3 shrink-0" />
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-3 border-b border-border/50 shrink-0 text-left">
          <span className="text-[16px] font-bold text-text-primary">Giỏ hàng ({cartCount})</span>
          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-background flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Mobile Cart Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4 max-h-[42vh] text-left">
          {cartItems.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center gap-2">
              <ShoppingCart size={32} className="text-text-secondary/40" />
              <span className="text-[13px] text-text-secondary">Giỏ hàng trống</span>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-3.5 py-3 border-b border-border/40 last:border-b-0 items-center justify-between">
                {/* Image */}
                <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-border/60 shrink-0 bg-background">
                  <Image 
                    src={item.image} 
                    alt={item.name} 
                    fill 
                    sizes="56px"
                    className="object-cover" 
                  />
                </div>
                
                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-[13px] font-semibold text-text-primary truncate">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-text-secondary mt-0.5">Phân loại: {item.category}</p>
                  <p className="text-[13px] font-bold text-secondary mt-1">
                    {formatPrice(item.price)}
                  </p>
                  
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-border/80 rounded-md max-w-[76px] mt-2 bg-background/50 overflow-hidden">
                    <button 
                      onClick={() => onQtyChange(item.id, -1)}
                      className="px-1.5 py-0.5 text-text-secondary hover:bg-border/40 text-xs font-bold"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center text-[11px] font-bold text-text-primary">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => onQtyChange(item.id, 1)}
                      className="px-1.5 py-0.5 text-text-secondary hover:bg-border/40 text-xs font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Trash Delete button */}
                <button 
                  onClick={() => onRemoveItem(item.id)}
                  className="text-text-secondary/60 hover:text-error p-1.5 rounded-md active:bg-background transition-colors shrink-0"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Mobile Actions and Subtotal */}
        {cartItems.length > 0 && (
          <div className="border-t border-border/60 bg-surface pt-3 px-6 flex flex-col gap-3">
            
            {/* Freeship dynamic banner */}
            {(() => {
              const limit = 700000;
              const remaining = limit - totalPrice;
              return remaining > 0 ? (
                <div className="flex items-center justify-between p-3.5 bg-primary/10 text-secondary border border-primary/20 rounded-lg text-xs font-semibold text-left select-none shrink-0 transition-all">
                  <div className="flex items-center gap-2">
                    <span>Bạn còn <strong className="text-secondary font-bold">{formatPrice(remaining)}</strong> để được freeship</span>
                  </div>
                  <ChevronDown size={14} className="-rotate-90 shrink-0" />
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold text-left select-none shrink-0 transition-all">
                  <span>Đơn hàng của bạn đã được miễn phí vận chuyển!</span>
                </div>
              );
            })()}

            {/* Subtotals table */}
            <div className="flex flex-col gap-2 text-left text-[13px] border-b border-border/50 pb-3">
              <div className="flex justify-between text-text-secondary">
                <span>Tạm tính</span>
                <span className="font-semibold text-text-primary">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Phí vận chuyển</span>
                <span className="font-semibold text-text-primary">{totalPrice >= 700000 ? "0đ" : "30.000đ"}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Giảm giá</span>
                <span className="font-semibold text-text-primary">-0đ</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between py-1 text-left">
              <span className="text-[14px] font-bold text-text-primary">Tổng cộng</span>
              <span className="text-[18px] font-bold text-secondary">
                {formatPrice(totalPrice + (totalPrice >= 700000 ? 0 : 30000))}
              </span>
            </div>

            {/* Buttons stacked */}
            <div className="flex flex-col gap-2 mt-1">
              <Link href="/thanh-toan" onClick={onClose} className="w-full">
                <Button variant="primary" size="md" className="w-full text-[13.5px] font-bold rounded-md py-3.5 justify-center">
                  Tiến hành thanh toán
                </Button>
              </Link>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-text-secondary mt-1">
                <span>Thanh toán an toàn & bảo mật</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      {/* ========================================================================= */}
      {/* DESKTOP POPOVER (no backdrop, absolutely positioned relative to parent) */}
      {/* ========================================================================= */}
      <div 
        ref={desktopModalRef}
        className="absolute right-0 mt-3.5 w-[290px] sm:w-[380px] bg-surface border border-border border-t-4 border-t-primary rounded-xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200 hidden md:block text-left"
      >
        {/* Top Pointer Arrow */}
        <div className="absolute -top-[7px] right-[14px] w-3 h-3 bg-primary rotate-45 z-10" />

        {/* Cart header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-3">
          <span className="text-[13.5px] font-bold text-text-primary">Giỏ hàng của bạn ({cartItems.length})</span>
          <button 
            onClick={onClearAll} 
            className="text-[12px] text-text-secondary hover:text-error transition-colors"
          >
            Xóa tất cả
          </button>
        </div>

        {/* Cart items list */}
        {cartItems.length === 0 ? (
          <div className="py-6 text-center flex flex-col items-center justify-center gap-2">
            <ShoppingCart size={28} className="text-text-secondary/40" />
            <p className="text-[12.5px] text-text-secondary">Giỏ hàng đang trống</p>
          </div>
        ) : (
          <>
            <div className="max-h-60 overflow-y-auto flex flex-col gap-3 pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3 items-center justify-between group">
                  {/* Image */}
                  <div className="relative w-12 h-12 rounded-md overflow-hidden border border-border/60 shrink-0 bg-background">
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill 
                      sizes="48px"
                      className="object-cover" 
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <h4 className="text-[12.5px] font-semibold text-text-primary truncate group-hover:text-secondary transition-colors">
                      {item.name}
                    </h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[12.5px] font-bold text-secondary">{formatPrice(item.price)}</span>
                    </div>
                    {/* Stepper */}
                    <div className="flex items-center border border-border/80 rounded-md max-w-[70px] mt-1.5 bg-background/50 overflow-hidden">
                      <button 
                        onClick={() => onQtyChange(item.id, -1)}
                        className="px-1.5 py-0.5 text-text-secondary hover:bg-border/40 text-xs font-bold"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center text-[10.5px] font-bold text-text-primary">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => onQtyChange(item.id, 1)}
                        className="px-1.5 py-0.5 text-text-secondary hover:bg-border/40 text-xs font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={() => onRemoveItem(item.id)}
                    className="text-text-secondary/60 hover:text-error p-1.5 rounded-md hover:bg-background transition-colors shrink-0"
                    title="Xóa"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary & actions */}
            <div className="border-t border-border/60 mt-3 pt-3 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-text-secondary font-medium">Tạm tính:</span>
                <span className="text-[14.5px] font-bold text-secondary">{formatPrice(totalPrice)}</span>
              </div>
              
              {/* Shipping info */}
              <div className="flex items-center gap-1.5 text-[11px] text-secondary font-medium select-none text-left">
                <Truck size={14} />
                <span>Miễn phí vận chuyển cho đơn từ 700.000đ</span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-1">
                <Link href="/gio-hang" onClick={onClose}>
                  <Button variant="outline" size="sm" className="w-full text-xs font-semibold rounded-md border-primary/50 text-secondary hover:bg-primary-light/50 bg-surface">
                    Giỏ hàng
                  </Button>
                </Link>
                <Link href="/thanh-toan" onClick={onClose}>
                  <Button variant="primary" size="sm" className="w-full text-xs font-semibold rounded-md">
                    Thanh toán
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Mobile Bottom Sheet (teleported) */}
      {mobileBottomSheet}
    </>
  );
}
