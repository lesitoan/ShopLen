"use client";

import React, { InputHTMLAttributes, forwardRef } from "react";
import { X } from "lucide-react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClear?: () => void;
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
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

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
            <div className="absolute left-3 text-text-muted pointer-events-none shrink-0">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            value={value}
            className={`w-full bg-surface-muted text-text-primary placeholder:text-text-muted text-sm rounded-md border border-border px-3 py-2 transition-colors duration-200 outline-none focus:outline-none focus-visible:outline-none focus:border-primary focus:ring-1 focus:ring-primary ${
              leftIcon ? "pl-9" : ""
            } ${rightIcon || onClear || value ? "pr-9" : ""} ${
              error ? "border-status-danger focus:border-status-danger focus:ring-status-danger" : ""
            } ${className}`}
            {...props}
          />

          {onClear && value ? (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-3 text-text-muted hover:text-text-primary p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            rightIcon && (
              <div className="absolute right-3 text-text-muted pointer-events-none shrink-0">
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
