import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import Button from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  onConfirm?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  loadingText?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  onConfirm,
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy",
  isDestructive = false,
  isLoading = false,
  loadingText,
}: ModalProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      setShouldRender(true);
      timer = setTimeout(() => {
        setIsVisible(true);
      }, 15);
    } else {
      setIsVisible(false);
      timer = setTimeout(() => {
        setShouldRender(false);
      }, 200);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [isOpen]);

  if (!shouldRender) return null;

  const handleClose = () => {
    if (isLoading) return;
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 transition-opacity duration-200 ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Modal Card */}
      <div
        className={`relative bg-surface w-full max-w-md rounded-3xl border border-border/40 shadow-2xl z-10 overflow-hidden flex flex-col transition-all duration-200 ease-out ${
          isVisible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-75 translate-y-2"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="text-[18px] font-bold text-text-primary">{title}</h3>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-text-secondary hover:text-text-primary hover:bg-background rounded-full p-1 transition-all duration-150 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[60vh] text-[14px] text-text-secondary leading-relaxed">
          {description && <p className="mb-4">{description}</p>}
          {children}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-border bg-background/50 flex items-center justify-end gap-3">
          {footer ? (
            footer
          ) : (
            <>
              <Button
                variant="outline"
                size="md"
                onClick={handleClose}
                disabled={isLoading}
                className="rounded-full"
              >
                {cancelLabel}
              </Button>
              {onConfirm && (
                <Button
                  variant={isDestructive ? "danger" : "primary"}
                  size="md"
                  onClick={onConfirm}
                  isLoading={isLoading}
                  loadingText={loadingText}
                  className="rounded-full font-bold px-6 shadow-sm"
                >
                  {confirmLabel}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
