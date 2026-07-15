import React, { useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info as InfoIcon, X } from "lucide-react";

type AlertType = "success" | "warning" | "error" | "info";

interface AlertProps {
  type: AlertType;
  title?: string;
  description: string;
  onClose?: () => void;
  className?: string;
}

export default function Alert({ type, title, description, onClose, className = "" }: AlertProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const styles = {
    success: {
      container: "bg-success/10 border-success/30 text-success",
      icon: <CheckCircle2 size={18} className="shrink-0" />,
      defaultTitle: "Thành công!",
    },
    warning: {
      container: "bg-warning/10 border-warning/30 text-warning-active",
      // Note: warning colors are typically custom yellow/orange. Let's use a nice warning text style
      icon: <AlertTriangle size={18} className="shrink-0" />,
      defaultTitle: "Cảnh báo!",
    },
    error: {
      container: "bg-error/10 border-error/30 text-error",
      icon: <XCircle size={18} className="shrink-0" />,
      defaultTitle: "Lỗi!",
    },
    info: {
      container: "bg-info/10 border-info/30 text-info",
      icon: <InfoIcon size={18} className="shrink-0" />,
      defaultTitle: "Thông tin!",
    },
  };

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  const currentStyle = styles[type];

  // Specific warning text class to ensure readability
  const textColorClass = type === "warning" ? "text-amber-800" : currentStyle.container;

  return (
    <div
      className={`flex items-start gap-3 p-3 border rounded-lg transition-all duration-300 ${currentStyle.container} ${textColorClass} ${className}`}
    >
      <div className="mt-0.5">{currentStyle.icon}</div>
      <div className="flex-1 text-[13px] leading-relaxed">
        <strong className="font-semibold mr-1">{title || currentStyle.defaultTitle}</strong>
        <span>{description}</span>
      </div>
      {onClose && (
        <button
          onClick={handleClose}
          className="hover:opacity-70 transition-opacity focus:outline-none ml-2 mt-0.5 shrink-0"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
