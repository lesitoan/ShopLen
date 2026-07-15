import React, { useId } from "react";

interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export default function Radio({ label, className = "", disabled, checked, onChange, id, ...props }: RadioProps) {
  const generatedId = useId();
  const radioId = id || generatedId;

  return (
    <label
      htmlFor={radioId}
      className={`inline-flex items-center gap-2 cursor-pointer select-none ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <div className="relative">
        <input
          type="radio"
          id={radioId}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only peer"
          {...props}
        />
        {/* Unchecked state style: viền tròn rỗng */}
        <div className="w-5 h-5 rounded-full border border-border bg-white transition-all peer-checked:border-primary flex items-center justify-center">
          {/* Checked state: chấm tròn primary ở giữa */}
          <div className="w-2.5 h-2.5 rounded-full bg-primary scale-0 peer-checked:scale-100 transition-transform duration-200" />
        </div>
      </div>
      {label && <span className="text-text-primary text-[14px]">{label}</span>}
    </label>
  );
}
