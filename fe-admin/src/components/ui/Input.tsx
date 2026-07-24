"use client";

import React, { InputHTMLAttributes, forwardRef, useRef, useImperativeHandle } from "react";
import { X, ChevronUp, ChevronDown } from "lucide-react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClear?: () => void;
  showCustomSpinner?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      onClear,
      className = "",
      value,
      id,
      type,
      showCustomSpinner = true,
      ...props
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    const isNumberInput = type === "number" && showCustomSpinner;

    const handleIncrement = () => {
      if (inputRef.current && !props.disabled) {
        inputRef.current.stepUp();
        inputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
        inputRef.current.dispatchEvent(new Event("input", { bubbles: true }));
      }
    };

    const handleDecrement = () => {
      if (inputRef.current && !props.disabled) {
        inputRef.current.stepDown();
        inputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
        inputRef.current.dispatchEvent(new Event("input", { bubbles: true }));
      }
    };

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-text-secondary"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 inset-y-0 flex items-center text-text-muted pointer-events-none shrink-0">
              {leftIcon}
            </div>
          )}

          <input
            ref={inputRef}
            id={inputId}
            value={value}
            type={type}
            className={`w-full bg-surface-muted text-text-primary placeholder:text-text-muted text-sm rounded-md border border-border px-3 py-2 transition-colors duration-200 outline-none focus:outline-none focus-visible:outline-none focus:border-primary focus:ring-1 focus:ring-primary ${
              leftIcon ? "pl-9" : ""
            } ${rightIcon || onClear || value || isNumberInput ? "pr-9" : ""} ${
              error ? "border-status-danger focus:border-status-danger focus:ring-status-danger" : ""
            } ${className}`}
            {...props}
          />

          {onClear && value ? (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-3 inset-y-0 flex items-center text-text-muted hover:text-text-primary p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : isNumberInput ? (
            <div className="absolute right-1.5 inset-y-1.5 flex flex-col items-center justify-center text-text-muted divide-y divide-border/40 bg-surface/80 rounded border border-border/60 overflow-hidden select-none">
              <button
                type="button"
                tabIndex={-1}
                onClick={handleIncrement}
                className="p-0.5 hover:text-primary hover:bg-surface-hover transition-colors"
                title="Tăng"
              >
                <ChevronUp className="w-3 h-3" />
              </button>
              <button
                type="button"
                tabIndex={-1}
                onClick={handleDecrement}
                className="p-0.5 hover:text-primary hover:bg-surface-hover transition-colors"
                title="Giảm"
              >
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          ) : (
            rightIcon && (
              <div className="absolute right-3 inset-y-0 flex items-center text-text-muted shrink-0">
                {rightIcon}
              </div>
            )
          )}
        </div>

        {error && <p className="text-xs text-status-danger font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
