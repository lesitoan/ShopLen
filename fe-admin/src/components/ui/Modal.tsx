"use client";

import React, { useEffect } from "react";
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
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  const renderIcon = () => {
    if (icon) return icon;
    switch (type) {
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
    if (type === "CANCEL" || type === "DANGER") return "danger";
    return "primary";
  };

  const defaultConfirmText =
    type === "CANCEL" ? "Xác nhận Hủy" : type === "DANGER" ? "Xóa" : "Xác nhận";
  const defaultCancelText = type === "CANCEL" ? "Bỏ qua" : "Hủy bỏ";

  const defaultFooter = onConfirm ? (
    <>
      <Button variant="secondary" onClick={onClose} disabled={isLoading}>
        {cancelText || defaultCancelText}
      </Button>
      <Button
        variant={getConfirmVariant()}
        onClick={onConfirm}
        isLoading={isLoading}
      >
        {confirmText || defaultConfirmText}
      </Button>
    </>
  ) : null;

  const activeFooter = footer !== undefined ? footer : defaultFooter;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-bg-deep/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div
        className={`relative w-full ${sizeClasses[size]} bg-surface border border-border rounded-xl shadow-2xl z-10 overflow-hidden transform transition-all`}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2 text-base font-bold text-text-highlight">
              {renderIcon()}
              {typeof title === "string" ? <span>{title}</span> : title}
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
          {description && (
            <p className="text-xs text-text-secondary leading-relaxed font-medium">
              {description}
            </p>
          )}
          {children}
        </div>

        {activeFooter && (
          <div className="flex items-center justify-end gap-3 px-5 py-3.5 border-t border-border bg-surface-muted/50">
            {activeFooter}
          </div>
        )}
      </div>
    </div>
  );
}
