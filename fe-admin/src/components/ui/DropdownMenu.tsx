"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export interface DropdownMenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  disabled?: boolean;
  divider?: boolean;
}

export interface DropdownMenuProps {
  /** Nút trigger tùy chỉnh. Nếu được truyền, sẽ ghi đè nút bấm mặc định */
  trigger?: React.ReactNode;
  /** Nhãn hiển thị cho nút bấm mặc định (nếu không dùng trigger tùy chỉnh) */
  label?: string;
  /** Icon đứng trước nhãn trên nút bấm mặc định */
  triggerIcon?: React.ReactNode;
  /** Tùy chọn ẩn/hiện icon mũi tên Chevron xoay xoay ở nút bấm (mặc định: true) */
  showChevron?: boolean;
  /** Variant màu sắc cho nút bấm mặc định */
  variant?: "primary" | "secondary" | "surface" | "outline" | "ghost";

  /** Danh sách các phần tử menu */
  items: DropdownMenuItem[];
  /** Key của item đang được chọn */
  selectedKey?: string;
  /** Callback khi chọn một phần tử */
  onSelect?: (key: string, item: DropdownMenuItem) => void;

  /** Căn lề menu xổ xuống: left (bên trái) hoặc right (bên phải) */
  align?: "left" | "right";
  /** Chiều rộng menu tùy chỉnh, ví dụ: "w-56", "w-48", "w-full" */
  width?: string;
  /** Chiều cao tối đa tùy chỉnh để bật cuộn (scroll), ví dụ: "max-h-48", "max-h-60", "200px" */
  maxHeight?: string;
  /** Class CSS bổ sung cho container ngoài */
  className?: string;
}

export function DropdownMenu({
  trigger,
  label = "Dropdown",
  triggerIcon,
  showChevron = true,
  variant = "primary",
  items,
  selectedKey,
  onSelect,
  align = "left",
  width = "w-48",
  maxHeight = "max-h-60",
  className = "",
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const variantStyles = {
    primary:
      "bg-primary hover:bg-primary-hover active:bg-primary-active text-bg-deep font-bold shadow-md shadow-primary/20",
    secondary:
      "bg-surface-active hover:bg-surface-hover text-text-highlight font-semibold border border-border-light",
    surface:
      "bg-surface-muted hover:bg-surface-hover text-text-primary border border-border font-medium",
    outline:
      "border-2 border-primary text-primary hover:bg-primary hover:text-bg-deep font-bold",
    ghost:
      "text-text-primary hover:bg-surface-hover font-medium",
  };

  const getMaxHeightStyle = (): React.CSSProperties | undefined => {
    if (!maxHeight) return undefined;
    if (maxHeight.startsWith("max-h-")) return undefined;
    return { maxHeight };
  };

  const maxHeightClass = maxHeight?.startsWith("max-h-") ? maxHeight : "";

  const isFullWidth = className.includes("w-full");

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      <div onClick={() => setIsOpen((prev) => !prev)} className={`cursor-pointer ${isFullWidth ? "w-full" : ""}`}>
        {trigger ? (
          trigger
        ) : (
          <button
            type="button"
            className={`inline-flex items-center gap-2 px-3.5 h-[38px] text-xs rounded-md transition-all duration-200 select-none ${
              isFullWidth ? "w-full justify-between" : ""
            } ${variantStyles[variant]}`}
          >
            <div className="flex items-center gap-2 min-w-0">
              {triggerIcon && <span className="shrink-0">{triggerIcon}</span>}
              <span className="font-semibold truncate">{label}</span>
            </div>
            {showChevron && (
              <ChevronDown
                className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            )}
          </button>
        )}
      </div>

      {/* Dropdown Menu Popper Box */}
      {isOpen && (
        <div
          style={getMaxHeightStyle()}
          className={`absolute z-50 mt-1.5 ${width} ${maxHeightClass} overflow-y-auto rounded-md bg-surface border border-border shadow-2xl shadow-black/50 py-1 text-xs scrollbar-thin scrollbar-thumb-border transition-all ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {items.map((item) => {
            const isSelected = selectedKey === item.key;

            return (
              <React.Fragment key={item.key}>
                {item.divider && (
                  <div className="my-1 h-px bg-border/60" />
                )}
                <button
                  type="button"
                  disabled={item.disabled}
                  onClick={() => {
                    if (item.onClick) item.onClick();
                    if (onSelect) onSelect(item.key, item);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-left font-medium transition-colors ${
                    isSelected
                      ? "bg-primary/20 text-primary font-semibold"
                      : item.danger
                      ? "text-status-danger hover:bg-status-danger/10"
                      : "text-text-primary hover:bg-surface-hover hover:text-text-highlight"
                  } ${item.disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {item.icon && <span className="shrink-0">{item.icon}</span>}
                  <span className="truncate">{item.label}</span>
                </button>
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}
