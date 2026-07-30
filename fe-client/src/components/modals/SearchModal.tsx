"use client";

import React, { useRef, useEffect } from "react";
import { Search, Clock, X } from "lucide-react";
import MobileBottomSheet from "@/components/ui/MobileBottomSheet";

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

  // Close when clicking outside (desktop only)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!isOpen) return;
      const target = event.target as HTMLElement;

      // Ignore mobile bottom sheet clicks or mobile viewport
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <>
      {/* DESKTOP POPOVER */}
      <div
        ref={desktopModalRef}
        className="absolute right-0 mt-3.5 w-[500px] bg-surface border border-border border-t-4 border-t-primary rounded-xl p-5 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 hidden md:block text-left"
      >
        <div className="absolute -top-[7px] right-[14px] w-3 h-3 bg-primary rotate-45 z-10" />

        <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-3">
          <span className="text-[13.5px] font-bold text-text-primary">Tìm kiếm sản phẩm</span>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors p-0.5"
            aria-label="Đóng"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={onSearchSubmit} className="border border-primary rounded-md overflow-hidden flex items-center w-full bg-surface mb-4">
          <div className="flex-1 flex items-center px-3 relative">
            <input
              type="text"
              placeholder="Gõ và nhấn nút enter"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full py-2 bg-transparent text-text-primary text-[13.5px] outline-none placeholder:text-text-secondary/50 pr-6"
              autoFocus
            />
            {searchValue && (
              <button
                type="button"
                onClick={() => setSearchValue("")}
                className="absolute right-2 text-text-secondary/50 hover:text-text-primary transition-colors p-1 rounded-full hover:bg-background"
                title="Xóa từ khóa"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-[12px] font-bold px-4 py-2.5 transition-all shrink-0 uppercase tracking-wider"
          >
            TÌM KIẾM
          </button>
        </form>

        <div className="grid grid-cols-2 gap-5 text-left">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider select-none">
                Tìm kiếm gần đây
              </span>
              {recentSearches.length > 0 && (
                <button
                  type="button"
                  onClick={onClearRecentSearches}
                  className="text-[11px] text-secondary font-bold hover:underline"
                >
                  Xóa tất cả
                </button>
              )}
            </div>
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
                    <div className="flex items-center gap-2 truncate" title={search}>
                      <Clock size={13} className="text-text-secondary/60 group-hover:text-secondary shrink-0" />
                      <span className="truncate">{search}</span>
                    </div>
                    <button
                      type="button"
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

      {/* MOBILE BOTTOM SHEET */}
      <MobileBottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title="Tìm kiếm"
        maxHeightClass="max-h-[85vh]"
        headerPaddingClass="px-4"
        paddingClass="py-2 pb-6"
      >
        <div className="px-4 flex flex-col gap-6 text-left">
          <form onSubmit={onSearchSubmit} className="border border-primary rounded-md overflow-hidden flex items-center w-full bg-surface">
            <div className="flex-1 flex items-center pl-3 pr-2 relative">
              <Search size={18} className="text-text-secondary shrink-0 mr-1.5" />
              <input
                type="text"
                placeholder="Bạn muốn tìm gì?"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full py-2.5 bg-transparent text-text-primary text-[13.5px] outline-none placeholder:text-text-secondary/50 pr-6"
                autoFocus
              />
              {searchValue && (
                <button
                  type="button"
                  onClick={() => setSearchValue("")}
                  className="absolute right-2 text-text-secondary/50 hover:text-text-primary transition-colors p-1 rounded-full hover:bg-background"
                  title="Xóa từ khóa"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-[12px] font-bold px-4 py-3 transition-all shrink-0 uppercase tracking-wider"
            >
              TÌM KIẾM
            </button>
          </form>

          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[12px] font-bold text-text-secondary uppercase tracking-wider select-none">
                Tìm kiếm gần đây
              </span>
              {recentSearches.length > 0 && (
                <button
                  type="button"
                  onClick={onClearRecentSearches}
                  className="text-[11px] text-secondary font-bold hover:underline"
                >
                  Xóa tất cả
                </button>
              )}
            </div>

            {recentSearches.length === 0 ? (
              <span className="text-[12px] text-text-secondary/60">Trống</span>
            ) : (
              <div className="flex flex-col gap-2.5">
                {recentSearches.map((search, idx) => (
                  <div
                    key={idx}
                    onClick={() => onRecentSearchClick(search)}
                    className="flex items-center justify-between py-1 border-b border-border/40 text-[13px] text-text-primary font-medium cursor-pointer"
                  >
                    <div className="flex items-center gap-2 truncate" title={search}>
                      <Clock size={14} className="text-text-secondary/60 shrink-0" />
                      <span className="truncate">{search}</span>
                    </div>
                    <button
                      type="button"
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
            )}
          </div>

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
        </div>
      </MobileBottomSheet>
    </>
  );
}
