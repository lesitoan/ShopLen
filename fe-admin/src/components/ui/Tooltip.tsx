"use client";

import React from "react";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export function Tooltip({
  content,
  children,
  position = "top",
  className = "",
}: TooltipProps) {
  if (!content) return <>{children}</>;

  const positionStyles = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowStyles = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-surface-active border-x-transparent border-b-transparent border-t-4 border-x-4",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-surface-active border-x-transparent border-t-transparent border-b-4 border-x-4",
    left: "left-full top-1/2 -translate-y-1/2 border-l-surface-active border-y-transparent border-r-transparent border-l-4 border-y-4",
    right: "right-full top-1/2 -translate-y-1/2 border-r-surface-active border-y-transparent border-l-transparent border-r-4 border-y-4",
  };

  return (
    <div className={`relative group inline-flex max-w-full ${className}`}>
      {children}
      <div
        className={`absolute ${positionStyles[position]} opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out scale-95 group-hover:scale-100 z-50 pointer-events-none`}
      >
        <div className="bg-surface-active text-text-highlight text-[11px] font-medium px-2.5 py-1.5 rounded-md border border-border-light shadow-xl shadow-black/50 whitespace-nowrap max-w-xs">
          {content}
        </div>
        <div className={`absolute w-0 h-0 ${arrowStyles[position]}`} />
      </div>
    </div>
  );
}
