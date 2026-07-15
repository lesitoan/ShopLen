import React from "react";
import { Check, X, AlertCircle, Info, Loader2, RotateCcw } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info" | "loading" | "undo";

interface ToastProps {
  type: ToastType;
  message: string;
  onClose?: () => void;
  onUndo?: () => void;
  className?: string;
}

export default function Toast({ type, message, onClose, onUndo, className = "" }: ToastProps) {
  const styles = {
    success: {
      bg: "bg-white",
      border: "border-success/30",
      text: "text-text-primary",
      icon: (
        <div className="w-5 h-5 rounded-full bg-success/15 flex items-center justify-center text-success">
          <Check size={12} className="stroke-[3]" />
        </div>
      ),
    },
    error: {
      bg: "bg-white",
      border: "border-error/30",
      text: "text-text-primary",
      icon: (
        <div className="w-5 h-5 rounded-full bg-error/15 flex items-center justify-center text-error">
          <X size={12} className="stroke-[3]" />
        </div>
      ),
    },
    warning: {
      bg: "bg-white",
      border: "border-warning/30",
      text: "text-text-primary",
      icon: (
        <div className="w-5 h-5 rounded-full bg-warning/15 flex items-center justify-center text-warning">
          <AlertCircle size={12} className="stroke-[3]" />
        </div>
      ),
    },
    info: {
      bg: "bg-white",
      border: "border-info/30",
      text: "text-text-primary",
      icon: (
        <div className="w-5 h-5 rounded-full bg-info/15 flex items-center justify-center text-info">
          <Info size={12} className="stroke-[3]" />
        </div>
      ),
    },
    loading: {
      bg: "bg-white",
      border: "border-primary/30",
      text: "text-text-primary",
      icon: <Loader2 size={18} className="animate-spin text-primary stroke-[3]" />,
    },
    undo: {
      bg: "bg-white",
      border: "border-primary/20",
      text: "text-text-primary",
      icon: (
        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-secondary">
          <RotateCcw size={12} className="stroke-[3]" />
        </div>
      ),
    },
  };

  const currentStyle = styles[type];

  return (
    <div
      className={`flex items-center gap-3 p-3.5 border rounded-lg shadow-md max-w-sm w-full transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${currentStyle.bg} ${currentStyle.border} ${currentStyle.text} ${className}`}
    >
      <div className="shrink-0">{currentStyle.icon}</div>
      <div className="flex-1 text-[13px] font-medium leading-tight select-none">
        {message}
      </div>
      {type === "undo" && onUndo && (
        <button
          onClick={onUndo}
          className="text-secondary hover:text-primary-active font-semibold text-[12px] underline ml-2 shrink-0 transition-colors"
        >
          Hoàn tác
        </button>
      )}
      {onClose && (
        <button
          onClick={onClose}
          className="text-text-secondary hover:text-text-primary transition-colors shrink-0 ml-1.5 focus:outline-none"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
