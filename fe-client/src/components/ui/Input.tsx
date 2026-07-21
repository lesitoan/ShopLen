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
    // Base styling mapping from designSystem.md (radius, border, text colors)
    const baseClasses = "w-full text-text-primary text-[14px] bg-surface border outline-none transition-all duration-200 ease-out";
    
    // Normal input is rounded-md, search is pill rounded-full
    const shapeClasses = isSearch ? "rounded-full py-2 px-10" : "rounded-md py-2 px-3";
    
    // Border classes based on state: Default, Focus, Error, Disabled
    let stateClasses = "border-border placeholder-text-secondary focus:border-primary focus:ring-1 focus:ring-primary/20";
    
    if (error) {
      stateClasses = "border-error focus:border-error focus:ring-1 focus:ring-error/20";
    } else if (disabled) {
      stateClasses = "bg-background border-border text-text-secondary/50 cursor-not-allowed placeholder-text-secondary/35";
    }

    return (
      <div className="relative w-full">
        {/* Render Search icon if isSearch is true */}
        {isSearch && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none transition-colors duration-200">
            <Search size={18} />
          </div>
        )}

        {/* Custom left icon */}
        {!isSearch && leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none transition-colors duration-200">
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

        {/* Custom right icon (với animation active:scale-90 mượt mà khi nhấp chuột) */}
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary flex items-center justify-center z-10 transition-transform duration-150 active:scale-90 cursor-pointer">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
