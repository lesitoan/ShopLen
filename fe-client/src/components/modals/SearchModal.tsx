"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Search, Clock, X } from "lucide-react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLDivElement | null>;
  searchValue: string;
  setSearchValue: (val: string) => void;
  recentSearches: string[];
  onSearchSubmit: (e: React.FormEvent) => void;
  onRecentSearchClick: (val: string) => void;
  onRemoveRecentSearch: (idx: number) => void;
  onClearRecentSearches: () => void;
  keywordSuggestions: string[];
}

export default function SearchModal({
  isOpen,
  onClose,
  triggerRef,
  searchValue,
  setSearchValue,
  recentSearches,
  onSearchSubmit,
  onRecentSearchClick,
  onRemoveRecentSearch,
  onClearRecentSearches,
  keywordSuggestions
}: SearchModalProps) {
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

  const mobileBottomSheet = mounted && typeof document !== "undefined" ? createPortal(
    <div 
      className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-surface w-full rounded-t-2xl border-t border-border max-h-[85vh] overflow-y-auto pb-6 flex flex-col animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="w-12 h-1 bg-border/60 rounded-full mx-auto my-3 shrink-0" />
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-3 border-b border-border/50 shrink-0 text-left">
          <span className="text-[16px] font-bold text-text-primary">Tìm kiếm</span>
          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-background flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-4 flex flex-col gap-6 text-left">
          {/* Input container */}
          <form onSubmit={onSearchSubmit} className="border border-primary rounded-md overflow-hidden flex items-stretch w-full bg-surface">
            <div className="flex items-center pl-3 text-text-secondary">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Bạn muốn tìm gì?"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="flex-1 px-3 py-2.5 bg-transparent text-text-primary text-[13.5px] outline-none placeholder:text-text-secondary/50"
              autoFocus
            />
          </form>

          {/* Lịch sử tìm kiếm */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[12px] font-bold text-text-secondary uppercase tracking-wider select-none">
                Tìm kiếm gần đây
              </span>
              <button 
                onClick={onClearRecentSearches} 
                className="text-[11px] text-secondary font-bold hover:underline"
              >
                Xóa tất cả
              </button>
            </div>
            
            <div className="flex flex-col gap-2.5">
              {recentSearches.map((search, idx) => (
                <div 
                  key={idx}
                  onClick={() => onRecentSearchClick(search)}
                  className="flex items-center justify-between py-1 border-b border-border/40 text-[13px] text-text-primary font-medium cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Clock size={14} className="text-text-secondary/60 shrink-0" />
                    <span className="truncate">{search}</span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveRecentSearch(idx);
                    }}
                    className="text-text-secondary/40 hover:text-error p-0.5"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Từ khóa phổ biến */}
          <div className="flex flex-col">
            <span className="text-[12px] font-bold text-text-secondary uppercase tracking-wider mb-3 select-none">
              Từ khóa phổ biến
            </span>
            <div className="flex flex-wrap gap-2">
              {keywordSuggestions.map((tag, idx) => (
                <span
                  key={idx}
                  onClick={() => onRecentSearchClick(tag)}
                  className="px-3.5 py-2 bg-background text-[12.5px] font-medium text-text-primary border border-border/40 rounded-md transition-all cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Gợi ý sản phẩm */}
          <div className="flex flex-col">
            <span className="text-[12px] font-bold text-text-secondary uppercase tracking-wider mb-3 select-none">
              Gợi ý sản phẩm
            </span>
            {/* Horizontal scroll grid */}
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {[
                { id: 1, name: "Gấu len Momo", price: 319000, image: "/images/products/moc-khoa-gau.png" },
                { id: 2, name: "Túi len hoa cúc", price: 269000, image: "/images/products/tui-hoa-cuc.png" },
                { id: 3, name: "Mũ len tai thỏ", price: 189000, image: "/images/products/gau-bong-tho.png" },
                { id: 4, name: "Khăn choàng basic", price: 289000, image: "/images/products/binh-hoa-tulip.png" }
              ].map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onClose();
                    window.location.href = `/san-pham/sp-${product.id}`;
                  }}
                  className="flex flex-col bg-background/50 border border-border/30 p-2 rounded-xl shrink-0 w-36 cursor-pointer"
                >
                  <div className="relative aspect-square w-full rounded-md overflow-hidden bg-surface border border-border/50">
                    <Image 
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </div>
                  <div className="mt-2 flex flex-col min-w-0">
                    <span className="text-[12px] font-semibold text-text-primary truncate">
                      {product.name}
                    </span>
                    <span className="text-[12.5px] font-bold text-secondary mt-0.5">
                      {(product.price).toLocaleString("vi-VN") + "đ"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
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
        className="absolute right-0 mt-3.5 w-[500px] bg-surface border border-border border-t-4 border-t-primary rounded-xl p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-200 hidden md:block text-left"
      >
        {/* Top Pointer Arrow */}
        <div className="absolute -top-[7px] right-[14px] w-3 h-3 bg-primary rotate-45 z-10" />

        {/* Header Title */}
        <div className="flex items-center justify-between pb-3">
          <span className="text-[12px] font-bold text-text-secondary uppercase select-none">Tìm kiếm</span>
          <button 
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary p-0.5"
          >
            <X size={16} />
          </button>
        </div>

        {/* Input field */}
        <form onSubmit={onSearchSubmit} className="border border-primary rounded-md overflow-hidden flex items-stretch w-full bg-surface">
          <input
            type="text"
            placeholder="Gõ và nhấn nút enter"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="flex-1 px-3 py-2 bg-transparent text-text-primary text-[13.5px] outline-none placeholder:text-text-secondary/50"
            autoFocus
          />
          <button 
            type="submit" 
            className="bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-[12px] font-bold px-4 transition-all shrink-0 uppercase tracking-wider"
          >
            TÌM KIẾM
          </button>
        </form>

        <div className="h-px bg-border/50 my-4" />

        {/* 2 columns suggestions */}
        <div className="grid grid-cols-2 gap-5 text-left">
          {/* Recent searches */}
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-2.5 select-none">
              Tìm kiếm gần đây
            </span>
            {recentSearches.length === 0 ? (
              <span className="text-[12px] text-text-secondary/60">Trống</span>
            ) : (
              <div className="flex flex-col gap-2">
                {recentSearches.map((search, idx) => (
                  <div 
                    key={idx}
                    onClick={() => onRecentSearchClick(search)}
                    className="flex items-center justify-between text-[12.5px] text-text-primary hover:text-secondary font-medium transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Clock size={13} className="text-text-secondary/60 group-hover:text-secondary shrink-0" />
                      <span className="truncate">{search}</span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveRecentSearch(idx);
                      }}
                      className="text-text-secondary/40 hover:text-error ml-1 p-0.5"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Keywords suggestions */}
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-2.5 select-none">
              Gợi ý từ khóa
            </span>
            <div className="flex flex-wrap gap-1.5">
              {keywordSuggestions.slice(0, 6).map((tag, idx) => (
                <span
                  key={idx}
                  onClick={() => onRecentSearchClick(tag)}
                  className="px-2.5 py-1 bg-background hover:bg-primary-light hover:text-secondary hover:border-primary/20 text-[12px] font-medium text-text-primary border border-border/40 rounded-md transition-all cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Sheet (teleported) */}
      {mobileBottomSheet}
    </>
  );
}
