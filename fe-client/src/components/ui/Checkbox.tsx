import React, { useId } from "react";
import { Check } from "lucide-react";

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export default function Checkbox({ label, className = "", disabled, checked, onChange, id, ...props }: CheckboxProps) {
  const generatedId = useId();
  const checkboxId = id || generatedId;

  return (
    <label
      htmlFor={checkboxId}
      className={`inline-flex items-center gap-2 cursor-pointer select-none ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <div className="relative">
        <input
          type="checkbox"
          id={checkboxId}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only peer"
          {...props}
        />
        {/* Unchecked state style: viền vuông bo nhẹ (radius 2px - rounded-sm), rỗng */}
        <div className="w-5 h-5 rounded-sm border border-border bg-surface transition-all peer-checked:bg-primary peer-checked:border-primary flex items-center justify-center">
          <Check size={14} className="text-white scale-0 peer-checked:scale-100 transition-transform duration-200" />
        </div>
      </div>
      {label && <span className="text-text-primary text-[14px]">{label}</span>}
    </label>
  );
}
