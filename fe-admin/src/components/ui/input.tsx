import React, { forwardRef } from "react";
import { Search } from "lucide-react";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  error?: string | boolean;
  isSearch?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, isSearch = false, leftIcon, rightIcon, className = "", disabled, value, defaultValue, ...props }, ref) => {
    const baseClasses = "w-full text-text-primary text-[14px] bg-white border outline-none transition-all duration-200";
    const shapeClasses = isSearch ? "rounded-full py-2 px-10" : "rounded-md py-2 px-3";
    
    let stateClasses = "border-border placeholder-text-secondary focus:border-primary focus:ring-1 focus:ring-primary/20";
    
    if (error) {
      stateClasses = "border-error focus:border-error focus:ring-1 focus:ring-error/20";
    } else if (disabled) {
      stateClasses = "bg-background border-border text-text-secondary/50 cursor-not-allowed placeholder-text-secondary/35";
    }

    return (
      <div className="relative w-full">
        {isSearch && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
            <Search size={18} />
          </div>
        )}

        {!isSearch && leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          className={`${baseClasses} ${shapeClasses} ${stateClasses} ${!isSearch && leftIcon ? "pl-9" : ""} ${rightIcon ? "pr-9" : ""} ${className}`}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
