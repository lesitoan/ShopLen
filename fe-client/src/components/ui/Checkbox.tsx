import React, { forwardRef, useId } from "react";
import { Check } from "lucide-react";

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = "", disabled, checked, defaultChecked, onChange, id, value, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;

    const isChecked = typeof checked === "boolean" ? checked : (typeof value === "boolean" ? value : undefined);

    return (
      <label
        htmlFor={checkboxId}
        className={`inline-flex items-center gap-2.5 cursor-pointer select-none group ${
          disabled ? "cursor-not-allowed opacity-50" : ""
        } ${className}`}
      >
        <div className="relative w-5 h-5 shrink-0 flex items-center justify-center transition-transform duration-150 active:scale-90">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            checked={checked}
            defaultChecked={defaultChecked}
            onChange={onChange}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer peer"
            {...props}
          />
          <div
            className={`w-5 h-5 rounded-md border transition-colors duration-200 ease-out flex items-center justify-center peer-checked:bg-primary peer-checked:border-primary peer-checked:[&_svg]:opacity-100 peer-checked:[&_svg]:scale-100 peer-checked:[&_svg]:rotate-0 ${
              isChecked === true ? "bg-primary border-primary" : "bg-surface border-border group-hover:border-primary/50"
            }`}
          >
            <Check
              size={14}
              className={`text-white transition-all duration-200 ease-out transform ${
                isChecked === true ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50 -rotate-12"
              }`}
            />
          </div>
        </div>
        {label && (
          <span className="text-text-secondary group-hover:text-text-primary text-[13px] font-medium leading-none transition-colors duration-200">
            {label}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
export default Checkbox;
