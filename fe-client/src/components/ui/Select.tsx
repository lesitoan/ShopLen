import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string | boolean;
  fullWidth?: boolean;
  align?: "left" | "right";
  className?: string;
}

export default function Select({
  options,
  value,
  onChange,
  placeholder = "Chọn danh mục",
  disabled = false,
  error = false,
  fullWidth = true,
  align = "left",
  className = "",
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!disabled) setIsOpen(!isOpen);
  };

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  const dropdownAlignClass = align === "right" ? "right-0" : "left-0";

  return (
    <div
      ref={dropdownRef}
      className={`relative text-[14px] ${fullWidth ? "w-full" : "inline-block"} ${isOpen ? "z-40" : ""} ${className}`}
    >
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        className={`${fullWidth ? "w-full justify-between" : "w-auto justify-start"} flex items-center gap-2 border bg-surface py-2 px-3.5 rounded-md transition-all duration-200 outline-none select-none text-left ${
          isOpen ? "border-primary ring-1 ring-primary/20" : "border-border"
        } ${error ? "border-error focus:ring-error/20" : ""} ${
          disabled ? "bg-background text-text-secondary/50 cursor-not-allowed border-border" : "text-text-primary"
        }`}
      >
        <span
          className={`whitespace-nowrap ${!selectedOption ? "text-text-secondary" : ""}`}
          title={selectedOption ? selectedOption.label : placeholder}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={15}
          className={`text-text-secondary transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Options Dropdown */}
      {isOpen && (
        <ul
          className={`absolute z-50 ${dropdownAlignClass} mt-1.5 ${
            fullWidth ? "w-full" : "min-w-full w-max"
          } bg-surface border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto py-1 animate-in fade-in slide-in-from-top-1 duration-150`}
        >
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`px-3.5 py-2 cursor-pointer transition-colors duration-150 text-[13.5px] whitespace-nowrap ${
                option.value === value
                  ? "bg-primary-light text-secondary font-semibold"
                  : "hover:bg-primary-light text-text-primary font-medium"
              }`}
              title={option.label}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
