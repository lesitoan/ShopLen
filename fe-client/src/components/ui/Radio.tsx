import React, { useId } from "react";
import { Check } from "lucide-react";

interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export default function Radio({ label, className = "", disabled, checked, onChange, id, ...props }: RadioProps) {
  const generatedId = useId();
  const radioId = id || generatedId;

  return (
    <label
      htmlFor={radioId}
      className={`inline-flex items-center gap-2 cursor-pointer select-none ${disabled ? "cursor-not-allowed opacity-50" : ""} ${className}`}
    >
      <div className="relative flex items-center justify-center">
        <input
          type="radio"
          id={radioId}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only peer"
          {...props}
        />
        <div
          className={`w-5 h-5 rounded-full border transition-all flex items-center justify-center shrink-0 ${
            checked
              ? "border-primary bg-primary"
              : "border-border bg-surface peer-checked:border-primary peer-checked:bg-primary"
          } peer-checked:[&_svg]:opacity-100 peer-checked:[&_svg]:scale-100`}
        >
          <Check
            size={11}
            strokeWidth={3}
            className={`text-white transition-all duration-200 ${
              checked ? "opacity-100 scale-100" : "opacity-0 scale-0"
            }`}
          />
        </div>
      </div>
      {label && <span className="text-text-primary text-[14px] font-medium">{label}</span>}
    </label>
  );
}
