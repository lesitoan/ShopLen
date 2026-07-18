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
}

export default function Select({
  options,
  value,
  onChange,
  placeholder = "Chọn danh mục",
  disabled = false,
  error = false,
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

  return (
    <div ref={dropdownRef} className="relative w-full text-[14px]">
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        className={`w-full flex items-center justify-between border bg-surface py-2 px-3 rounded-md transition-all duration-200 outline-none select-none text-left ${
          isOpen ? "border-primary ring-1 ring-primary/20" : "border-border"
        } ${error ? "border-error focus:ring-error/20" : ""} ${
          disabled ? "bg-background text-text-secondary/50 cursor-not-allowed border-border" : "text-text-primary"
        }`}
      >
        <span className={!selectedOption ? "text-text-secondary" : ""}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-text-secondary transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Options Dropdown */}
      {isOpen && (
        <ul className="absolute z-10 w-full mt-1.5 bg-surface border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto py-1 animate-in fade-in slide-in-from-top-1 duration-150">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`px-3 py-2 cursor-pointer transition-colors duration-150 text-[14px] ${
                option.value === value
                  ? "bg-primary-light text-secondary font-medium"
                  : "hover:bg-primary-light text-text-primary"
              }`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
