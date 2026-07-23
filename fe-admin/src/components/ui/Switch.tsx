"use client";

import React from "react";

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

export function Switch({
  checked,
  onChange,
  disabled = false,
  size = "md",
  label,
  className = "",
}: SwitchProps) {
  const sizeClasses = {
    sm: {
      track: "w-7 h-4 p-0.5",
      knob: "w-3 h-3",
      translate: "translate-x-3",
    },
    md: {
      track: "w-9 h-5 p-0.5",
      knob: "w-4 h-4",
      translate: "translate-x-4",
    },
    lg: {
      track: "w-11 h-6 p-0.5",
      knob: "w-5 h-5",
      translate: "translate-x-5",
    },
  };

  const currentSize = sizeClasses[size];

  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <label
      onClick={handleToggle}
      className={`inline-flex items-center gap-2 select-none ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
    >
      <div
        className={`relative inline-flex shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out ${
          currentSize.track
        } ${
          checked
            ? "bg-primary shadow-sm shadow-primary/30"
            : "bg-surface-active border border-border-light"
        }`}
      >
        <span
          className={`inline-block rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
            currentSize.knob
          } ${checked ? currentSize.translate : "translate-x-0"}`}
        />
      </div>
      {label && <span className="text-xs font-medium text-text-primary">{label}</span>}
    </label>
  );
}
