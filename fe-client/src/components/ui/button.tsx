import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  iconOnly?: boolean;
  children?: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  iconOnly = false,
  className = "",
  disabled,
  children,
  ...props
}: ButtonProps) {
  // Base classes for transitions, rounded corners, flex items alignment
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 outline-none focus:outline-none focus-visible:outline-none select-none active:scale-[0.98]";

  // Variant classes mapped from designSystem.md
  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primary-hover active:bg-primary-active disabled:bg-primary-light disabled:text-text-secondary/40 disabled:active:scale-100",
    outline: "border border-primary text-primary bg-transparent hover:bg-primary-light active:bg-primary-light/50 active:border-primary-active disabled:border-border disabled:text-text-secondary/40 disabled:active:scale-100",
    secondary: "bg-white border border-border text-text-primary hover:bg-background active:bg-border/40 disabled:opacity-50 disabled:active:scale-100",
    ghost: "bg-transparent text-primary hover:bg-primary-light active:bg-primary-light/50 disabled:text-text-secondary/40 disabled:bg-transparent disabled:active:scale-100",
    danger: "bg-error text-white hover:bg-error/90 active:bg-error/80 disabled:opacity-50 disabled:active:scale-100",
  };

  // Size classes mapped to spacing & typography scale
  const sizeClasses = iconOnly
    ? {
        sm: "w-8 h-8 rounded-sm text-[12px] p-0",
        md: "w-10 h-10 rounded-md text-[14px] p-0",
        lg: "w-12 h-12 rounded-lg text-[16px] p-0",
      }
    : {
        sm: "px-3 py-1 rounded-sm text-[12px] gap-1",
        md: "px-4 py-2 rounded-md text-[14px] gap-2",
        lg: "px-5 py-3 rounded-lg text-[16px] gap-3",
      };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
