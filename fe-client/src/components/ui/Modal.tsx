import React, { useEffect } from "react";
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
}: ModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-md rounded-3xl border border-border shadow-2xl z-10 overflow-hidden flex flex-col transition-all duration-300 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="text-[18px] font-bold text-text-primary">{title}</h3>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary hover:bg-background rounded-full p-1 transition-all duration-150 outline-none"
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
              <Button variant="outline" size="md" onClick={onClose} className="rounded-full">
                {cancelLabel}
              </Button>
              {onConfirm && (
                <Button
                  variant={isDestructive ? "danger" : "primary"}
                  size="md"
                  onClick={onConfirm}
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
