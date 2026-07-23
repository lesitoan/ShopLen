"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, X } from "lucide-react";

export interface MultiSelectOption {
  key: string;
  label: string;
  badge?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface MultiSelectDropdownProps {
  /** Nhãn hiển thị mặc định (ví dụ: "Trạng thái") */
  label?: string;
  /** Icon đứng trước nhãn trên nút bấm */
  triggerIcon?: React.ReactNode;
  /** Variant giao diện nút bấm */
  variant?: "primary" | "secondary" | "surface" | "outline" | "ghost";
  /** Danh sách các tùy chọn */
  options: MultiSelectOption[];
  /** Mảng các key đang được chọn */
  selectedKeys: string[];
  /** Callback khi bấm Áp dụng để thay đổi danh sách được chọn */
  onChange: (selectedKeys: string[]) => void;
  /** Tùy chọn hiển thị nút "Chọn tất cả" */
  showSelectAll?: boolean;
  /** Căn lề menu: left | right */
  align?: "left" | "right";
  /** Chiều rộng menu tùy chỉnh, ví dụ: "w-56" */
  width?: string;
  /** Chiều cao tối đa tùy chỉnh cho danh sách cuộn */
  maxHeight?: string;
  className?: string;
}

export function MultiSelectDropdown({
  label = "Chọn nhiều",
  triggerIcon,
  variant = "surface",
  options,
  selectedKeys,
  onChange,
  showSelectAll = true,
  align = "left",
  width = "w-60",
  maxHeight = "max-h-56",
  className = "",
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempSelectedKeys, setTempSelectedKeys] = useState<string[]>(selectedKeys);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync tempSelectedKeys when opening menu or selectedKeys prop changes
  useEffect(() => {
    setTempSelectedKeys(selectedKeys);
  }, [selectedKeys, isOpen]);

  // Close on outside click
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

  const isAllTempSelected =
    options.length > 0 && options.every((opt) => tempSelectedKeys.includes(opt.key));

  const handleToggleOption = (key: string) => {
    if (tempSelectedKeys.includes(key)) {
      setTempSelectedKeys((prev) => prev.filter((k) => k !== key));
    } else {
      setTempSelectedKeys((prev) => [...prev, key]);
    }
  };

  const handleToggleAll = () => {
    if (isAllTempSelected) {
      setTempSelectedKeys([]);
    } else {
      setTempSelectedKeys(options.map((opt) => opt.key));
    }
  };

  const handleReset = () => {
    setTempSelectedKeys([]);
  };

  const handleApply = () => {
    onChange(tempSelectedKeys);
    setIsOpen(false);
  };

  const handleClearTrigger = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
    setTempSelectedKeys([]);
  };

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

  const triggerLabelDisplay = React.useMemo(() => {
    if (selectedKeys.length === 0) return label;
    if (selectedKeys.length === 1) {
      const selectedItem = options.find((opt) => opt.key === selectedKeys[0]);
      return selectedItem?.label || label;
    }
    return `${label} (${selectedKeys.length})`;
  }, [label, selectedKeys, options]);

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      {/* Trigger Button */}
      <div onClick={() => setIsOpen((prev) => !prev)} className="cursor-pointer select-none">
        <button
          type="button"
          className={`inline-flex items-center gap-2 px-3.5 h-[38px] text-xs rounded-md transition-all duration-200 ${variantStyles[variant]}`}
        >
          {triggerIcon && <span className="shrink-0">{triggerIcon}</span>}
          <span className="font-semibold">{triggerLabelDisplay}</span>

          {selectedKeys.length > 0 && (
            <span
              onClick={handleClearTrigger}
              className="p-0.5 rounded-full hover:bg-surface-active text-text-muted hover:text-text-primary transition-colors ml-1"
              title="Xóa lựa chọn"
            >
              <X className="w-3 h-3" />
            </span>
          )}

          <ChevronDown
            className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Popper Box */}
      {isOpen && (
        <div
          className={`absolute z-50 mt-1.5 ${width} rounded-xl bg-surface border border-border shadow-2xl shadow-black/60 p-2 text-xs transition-all ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {/* Options List */}
          <div className={`${maxHeight} overflow-y-auto space-y-0.5 pr-1 scrollbar-thin scrollbar-thumb-border`}>
            {/* Select All Option */}
            {showSelectAll && options.length > 0 && (
              <div
                onClick={handleToggleAll}
                className="flex items-center gap-2.5 px-2.5 py-1.5 cursor-pointer hover:bg-surface-hover rounded-lg transition-colors text-text-secondary hover:text-text-primary font-semibold select-none border-b border-border/50 pb-2 mb-1"
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    isAllTempSelected
                      ? "bg-primary border-primary text-bg-deep font-bold"
                      : "border-border-light bg-surface-muted"
                  }`}
                >
                  {isAllTempSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span>Tất cả</span>
              </div>
            )}

            {options.map((opt) => {
              const isChecked = tempSelectedKeys.includes(opt.key);

              return (
                <div
                  key={opt.key}
                  onClick={() => !opt.disabled && handleToggleOption(opt.key)}
                  className={`flex items-center justify-between gap-2.5 px-2.5 py-1.5 rounded-lg transition-colors select-none ${
                    opt.disabled
                      ? "opacity-40 cursor-not-allowed"
                      : "cursor-pointer hover:bg-surface-hover"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        isChecked
                          ? "bg-primary border-primary text-bg-deep font-bold"
                          : "border-border-light bg-surface-muted"
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>

                    {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                    <span
                      className={`truncate font-medium ${
                        isChecked ? "text-text-highlight font-bold" : "text-text-primary"
                      }`}
                    >
                      {opt.label}
                    </span>
                  </div>

                  {opt.badge && <div className="shrink-0">{opt.badge}</div>}
                </div>
              );
            })}
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-2 mt-2 border-t border-border">
            <button
              type="button"
              onClick={handleReset}
              className="px-2.5 py-1 rounded text-[11px] font-semibold text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
            >
              Đặt lại
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="px-3 py-1 rounded-lg text-xs font-bold bg-primary hover:bg-primary-hover text-bg-deep transition-all shadow-md shadow-primary/20"
            >
              Áp dụng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
