"use client";

import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  label?: string;
  error?: string;
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, value, onChange, className = "", id, placeholder = "-- Chọn --", disabled, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const selectRef = useRef<HTMLSelectElement>(null);

    useImperativeHandle(ref, () => selectRef.current as HTMLSelectElement);

    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    const selectedOption = options.find((opt) => opt.value === value) || options[0];

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectOption = (optValue: string) => {
      if (disabled) return;
      setIsOpen(false);

      if (selectRef.current) {
        selectRef.current.value = optValue;
        const event = new Event("change", { bubbles: true });
        selectRef.current.dispatchEvent(event);
      }

      if (onChange) {
        const syntheticEvent = {
          target: { value: optValue, name: props.name },
        } as React.ChangeEvent<HTMLSelectElement>;
        onChange(syntheticEvent);
      }
    };

    return (
      <div className="w-full space-y-1.5" ref={containerRef}>
        {label && (
          <label htmlFor={selectId} className="block text-xs font-medium text-text-secondary">
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={selectRef}
            id={selectId}
            value={value}
            onChange={onChange}
            className="sr-only"
            tabIndex={-1}
            disabled={disabled}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className={`w-full bg-surface-muted text-text-primary text-xs font-medium rounded-md border border-border px-3 py-2.5 flex items-center justify-between transition-colors duration-200 outline-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer ${
              isOpen ? "border-primary ring-1 ring-primary" : ""
            } ${error ? "border-status-danger focus:border-status-danger" : ""} ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
            } ${className}`}
          >
            <span className="truncate text-left pr-2">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown className={`w-4 h-4 text-text-muted shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-primary" : ""}`} />
          </button>

          {isOpen && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-surface border border-border rounded-lg shadow-2xl z-50 py-1.5 max-h-60 overflow-y-auto space-y-0.5">
              {options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelectOption(opt.value)}
                    className={`w-full px-3.5 py-2 text-xs text-left flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-primary/15 text-primary font-semibold"
                        : "text-text-primary hover:bg-surface-hover hover:text-text-highlight"
                    }`}
                  >
                    <span className="truncate pr-2">{opt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {error && <p className="text-xs text-status-danger font-medium">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
