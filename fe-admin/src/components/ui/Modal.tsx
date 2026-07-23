"use client";

import React, { useEffect, useState } from "react";
import { X, Ban, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";

export type ModalType =
  | "DEFAULT"
  | "CONFIRM"
  | "CANCEL"
  | "DANGER"
  | "WARNING"
  | "INFO"
  | "PRIMARY";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  type?: ModalType;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  showCloseButton?: boolean;
  icon?: React.ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  onConfirm,
  type = "DEFAULT",
  title,
  description,
  children,
  footer,
  confirmText,
  cancelText,
  isLoading = false,
  size = "md",
  showCloseButton = true,
  icon,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  // Preserve content during exit animation so text doesn't flicker when parent state clears
  const [activeContent, setActiveContent] = useState({
    title,
    description,
    children,
    footer,
    type,
    confirmText,
    cancelText,
    icon,
  });

  useEffect(() => {
    if (isOpen) {
      setActiveContent({
        title,
        description,
        children,
        footer,
        type,
        confirmText,
        cancelText,
        icon,
      });
      setMounted(true);
      const timer = setTimeout(() => setAnimateIn(true), 10);
      return () => clearTimeout(timer);
    } else {
      setAnimateIn(false);
      const timer = setTimeout(() => setMounted(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, title, description, children, footer, type, confirmText, cancelText, icon]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  const currentTitle = activeContent.title;
  const currentDescription = activeContent.description;
  const currentChildren = activeContent.children;
  const currentFooter = activeContent.footer;
  const currentType = activeContent.type;
  const currentConfirmText = activeContent.confirmText;
  const currentCancelText = activeContent.cancelText;
  const currentIcon = activeContent.icon;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  const renderIcon = () => {
    if (currentIcon) return currentIcon;
    switch (currentType) {
      case "CANCEL":
      case "DANGER":
        return <Ban className="w-4 h-4 text-status-danger shrink-0" />;
      case "WARNING":
        return <AlertTriangle className="w-4 h-4 text-status-warning shrink-0" />;
      case "INFO":
        return <Info className="w-4 h-4 text-status-info shrink-0" />;
      case "CONFIRM":
      case "PRIMARY":
        return <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />;
      default:
        return null;
    }
  };

  const getConfirmVariant = (): "danger" | "primary" => {
    if (currentType === "CANCEL" || currentType === "DANGER") return "danger";
    return "primary";
  };

  const defaultConfirmText =
    currentType === "CANCEL" ? "Xác nhận Hủy" : currentType === "DANGER" ? "Xóa" : "Xác nhận";
  const defaultCancelText = currentType === "CANCEL" ? "Bỏ qua" : "Hủy bỏ";

  const defaultFooter = onConfirm ? (
    <>
      <Button variant="secondary" onClick={onClose} disabled={isLoading}>
        {currentCancelText || defaultCancelText}
      </Button>
      <Button
        variant={getConfirmVariant()}
        onClick={onConfirm}
        isLoading={isLoading}
      >
        {currentConfirmText || defaultConfirmText}
      </Button>
    </>
  ) : null;

  const resolvedFooter = currentFooter !== undefined ? currentFooter : defaultFooter;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-bg-deep/80 backdrop-blur-sm transition-opacity duration-200 ease-out ${
          animateIn ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal Content Box */}
      <div
        className={`relative w-full ${sizeClasses[size]} bg-surface border border-border rounded-xl shadow-2xl z-10 overflow-hidden transform transition-all duration-200 ease-out ${
          animateIn ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2"
        }`}
      >
        {(currentTitle || showCloseButton) && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2 text-base font-bold text-text-highlight">
              {renderIcon()}
              {typeof currentTitle === "string" ? <span>{currentTitle}</span> : currentTitle}
            </div>

            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-text-muted hover:text-text-primary p-1 rounded-md hover:bg-surface-hover transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        <div className="p-5 max-h-[75vh] overflow-y-auto space-y-3">
          {currentDescription && (
            <p className="text-xs text-text-secondary leading-relaxed font-medium">
              {currentDescription}
            </p>
          )}
          {currentChildren}
        </div>

        {resolvedFooter && (
          <div className="flex items-center justify-end gap-3 px-5 py-3.5 border-t border-border bg-surface-muted/50">
            {resolvedFooter}
          </div>
        )}
      </div>
    </div>
  );
}
