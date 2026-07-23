"use client";

import React, { SelectHTMLAttributes, forwardRef } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = "", id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-medium text-text-secondary"
          >
            {label}
          </label>
        )}

        <select
          ref={ref}
          id={selectId}
          className={`w-full bg-surface-muted text-text-primary text-sm rounded-md border border-border px-3 py-2 transition-all duration-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer ${
            error ? "border-status-danger focus:border-status-danger" : ""
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="bg-surface text-text-primary py-1"
            >
              {opt.label}
            </option>
          ))}
        </select>

        {error && <p className="text-xs text-status-danger font-medium">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
