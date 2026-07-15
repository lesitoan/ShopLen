import React, { useId } from "react";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  id?: string;
}

export default function Switch({ checked, onChange, disabled = false, label, id }: SwitchProps) {
  const generatedId = useId();
  const switchId = id || generatedId;

  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <label
      htmlFor={switchId}
      className={`inline-flex items-center gap-3 cursor-pointer select-none ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <div className="relative">
        <input
          type="checkbox"
          id={switchId}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        {/* Track */}
        <div
          onClick={handleToggle}
          className={`w-10 h-6 bg-border peer-checked:bg-primary rounded-full transition-all duration-200`}
        />
        {/* Thumb */}
        <div
          onClick={handleToggle}
          className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full shadow transition-all duration-200 ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </div>
      {label && <span className="text-text-primary text-[14px]">{label}</span>}
    </label>
  );
}
