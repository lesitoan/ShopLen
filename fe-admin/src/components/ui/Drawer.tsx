"use client";

import React, { useEffect, useState, useRef } from "react";
import { X, GripVertical } from "lucide-react";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  position?: "right" | "left";
  size?: "sm" | "md" | "lg" | "half" | "third" | "full";
  resizable?: boolean;
  className?: string;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  position = "right",
  size = "third",
  resizable = true,
  className = "",
}: DrawerProps) {
  const [mounted, setMounted] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState<number | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const resizerRef = useRef<HTMLDivElement>(null);

  // Preserve content during exit animation
  const [activeContent, setActiveContent] = useState({
    title,
    description,
    children,
    footer,
  });

  // Initialize width & mount lifecycle
  useEffect(() => {
    if (isOpen) {
      setActiveContent({
        title,
        description,
        children,
        footer,
      });
      setMounted(true);

      // Default to 1/3 window width (min 380px, max 85% of screen)
      if (typeof window !== "undefined") {
        const initialThirdWidth = Math.max(400, Math.floor(window.innerWidth / 3));
        setDrawerWidth(initialThirdWidth);
      }

      const timer = setTimeout(() => setAnimateIn(true), 10);
      return () => {
        clearTimeout(timer);
      };
    } else {
      setAnimateIn(false);
      const timer = setTimeout(() => {
        setMounted(false);
        setDrawerWidth(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, title, description, children, footer]);

  // ESC Key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Mouse Drag Resizing Logic
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      let newWidth = window.innerWidth - e.clientX;
      const minWidth = 360;
      const maxWidth = Math.floor(window.innerWidth * 0.85);

      if (newWidth < minWidth) newWidth = minWidth;
      if (newWidth > maxWidth) newWidth = maxWidth;

      setDrawerWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.userSelect = "unset";
      document.body.style.cursor = "unset";
    };

    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "unset";
      document.body.style.cursor = "unset";
    };
  }, [isResizing]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  if (!mounted) return null;

  const currentTitle = activeContent.title;
  const currentDescription = activeContent.description;
  const currentChildren = activeContent.children;
  const currentFooter = activeContent.footer;

  const positionClasses = {
    right: {
      panel: "right-0 border-l border-border",
      translateHidden: "translate-x-full",
      translateVisible: "translate-x-0",
    },
    left: {
      panel: "left-0 border-r border-border",
      translateHidden: "-translate-x-full",
      translateVisible: "translate-x-0",
    },
  };

  const currentPos = positionClasses[position];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ease-in-out ${
          animateIn ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Drawer Panel */}
      <div
        style={drawerWidth ? { width: `${drawerWidth}px` } : undefined}
        className={`fixed inset-y-0 ${currentPos.panel} bg-surface shadow-2xl flex flex-col ${
          isResizing ? "transition-none" : "transition-all duration-300 ease-in-out"
        } ${
          animateIn ? currentPos.translateVisible : currentPos.translateHidden
        } ${className}`}
      >
        {/* Resizer Handle */}
        {resizable && (
          <div
            ref={resizerRef}
            onMouseDown={handleMouseDown}
            className="absolute top-0 bottom-0 -left-2 w-4 cursor-col-resize z-50 group flex items-center justify-center select-none"
            title="Kéo sang trái/phải để điều chỉnh kích thước"
          >
            <div className="w-1.5 h-16 rounded-full bg-border/60 group-hover:bg-primary group-active:bg-primary transition-colors shadow-md flex items-center justify-center">
              <GripVertical className="w-3 h-3 text-text-muted group-hover:text-bg-deep opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-muted/30 shrink-0">
          <div>
            {currentTitle && (
              <h2 className="text-lg font-bold text-text-highlight tracking-tight">
                {currentTitle}
              </h2>
            )}
            {currentDescription && (
              <p className="text-xs text-text-muted mt-0.5">{currentDescription}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-border">
          {currentChildren}
        </div>

        {/* Footer */}
        {currentFooter && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-surface-muted/30 shrink-0">
            {currentFooter}
          </div>
        )}
      </div>
    </div>
  );
}
