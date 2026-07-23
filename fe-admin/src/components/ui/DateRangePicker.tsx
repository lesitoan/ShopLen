"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Calendar as CalendarIcon, X, ChevronLeft, ChevronRight } from "lucide-react";

export interface DateRange {
  startDate: string; // "YYYY-MM-DD"
  endDate: string;   // "YYYY-MM-DD"
}

export interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  placeholder?: string;
  className?: string;
  align?: "left" | "right";
  size?: "sm" | "md" | "lg";
}

const MONTH_NAMES = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
  "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
];

const WEEK_DAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

const formatDateISO = (d: Date): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function DateRangePicker({
  value,
  onChange,
  placeholder,
  className = "",
  align = "left",
  size = "md",
}: DateRangePickerProps) {
  const sizeStyles = {
    sm: { h: "h-[30px]", text: "text-xs", icon: "w-3.5 h-3.5", px: "px-2.5" },
    md: { h: "h-[38px]", text: "text-sm", icon: "w-4 h-4", px: "px-3" },
    lg: { h: "h-[46px]", text: "text-base", icon: "w-4 h-4", px: "px-4" },
  };
  const sz = sizeStyles[size];
  const [isOpen, setIsOpen] = useState(false);

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const [startDate, setStartDate] = useState(value?.startDate || "");
  const [endDate, setEndDate] = useState(value?.endDate || "");
  const [hoverDate, setHoverDate] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setStartDate(value.startDate || "");
      setEndDate(value.endDate || "");
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    if (!year || !month || !day) return dateStr;
    return `${day}/${month}/${year}`;
  };

  const displayText = useMemo(() => {
    if (startDate && endDate) {
      return `${formatDateDisplay(startDate)} - ${formatDateDisplay(endDate)}`;
    }
    if (startDate) {
      return `${formatDateDisplay(startDate)} - ...`;
    }
    return "";
  }, [startDate, endDate]);

  const calendarCells = useMemo(() => {
    const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const cells = [];

    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(viewYear, viewMonth - 1, daysInPrevMonth - i);
      cells.push({
        dateStr: formatDateISO(prevDate),
        dayNum: daysInPrevMonth - i,
        isCurrentMonth: false,
      });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const currDate = new Date(viewYear, viewMonth, d);
      cells.push({
        dateStr: formatDateISO(currDate),
        dayNum: d,
        isCurrentMonth: true,
      });
    }

    const remaining = (7 - (cells.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(viewYear, viewMonth + 1, i);
      cells.push({
        dateStr: formatDateISO(nextDate),
        dayNum: i,
        isCurrentMonth: false,
      });
    }

    return cells;
  }, [viewYear, viewMonth]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const handleDayClick = (dateStr: string) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(dateStr);
      setEndDate("");
    } else if (startDate && !endDate) {
      if (dateStr < startDate) {
        setStartDate(dateStr);
        setEndDate("");
      } else {
        setEndDate(dateStr);
        const newRange = { startDate, endDate: dateStr };
        if (onChange) onChange(newRange);
        setIsOpen(false);
      }
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStartDate("");
    setEndDate("");
    if (onChange) onChange({ startDate: "", endDate: "" });
  };

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Trigger Button */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="cursor-pointer select-none"
      >
        {!displayText ? (
          <button
            type="button"
            title="Chọn khoảng ngày"
            className={`${sz.h} ${sz.px} rounded-md bg-surface-muted hover:bg-surface-hover text-text-secondary hover:text-text-primary border border-border transition-colors flex items-center justify-center gap-1.5`}
          >
            <CalendarIcon className={sz.icon} />
            {placeholder && <span className={`${sz.text} font-medium`}>{placeholder}</span>}
          </button>
        ) : (
          <div className={`relative flex items-center bg-surface-muted text-text-primary ${sz.text} ${sz.px} pr-7 ${sz.h} rounded-md border border-primary/50 hover:border-primary font-semibold shadow-sm transition-all`}>
            <CalendarIcon className={`${sz.icon} mr-2 text-primary shrink-0`} />
            <span>{displayText}</span>
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 p-0.5 rounded-full hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
              title="Xóa khoảng ngày"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {isOpen && (
        <div className={`absolute z-50 mt-1.5 w-72 rounded-lg bg-surface border border-border shadow-2xl shadow-black/70 p-3 text-xs select-none space-y-3 ${
          align === "right" ? "right-0" : "left-0"
        }`}>
          <div className="flex items-center justify-between font-semibold text-text-highlight px-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 rounded-md hover:bg-surface-hover text-text-secondary hover:text-text-primary transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1 text-sm font-bold">
              <span>{MONTH_NAMES[viewMonth]}</span>
              <span className="text-text-muted font-normal">{viewYear}</span>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded-md hover:bg-surface-hover text-text-secondary hover:text-text-primary transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 text-center font-bold text-text-muted text-[10px] uppercase">
            {WEEK_DAYS.map((day) => (
              <div key={day} className="py-1">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1 text-center">
            {calendarCells.map((cell, idx) => {
              const { dateStr, dayNum, isCurrentMonth } = cell;

              const isStart = startDate === dateStr;
              const isEnd = endDate === dateStr;
              const isSingle = isStart && isEnd;

              const effectiveEnd = endDate || hoverDate;
              const isInRange =
                startDate &&
                effectiveEnd &&
                startDate < effectiveEnd &&
                dateStr > startDate &&
                dateStr < effectiveEnd;

              return (
                <div
                  key={`${dateStr}-${idx}`}
                  onMouseEnter={() => {
                    if (startDate && !endDate) {
                      setHoverDate(dateStr);
                    }
                  }}
                  onClick={() => isCurrentMonth && handleDayClick(dateStr)}
                  className={`relative flex items-center justify-center h-8 font-medium transition-all ${
                    !isCurrentMonth
                      ? "text-text-muted/30 cursor-not-allowed"
                      : "cursor-pointer text-text-primary hover:text-text-highlight"
                  } ${
                    isInRange && isCurrentMonth
                      ? "bg-primary/20 text-primary"
                      : ""
                  } ${
                    isStart && !isEnd
                      ? "bg-primary text-bg-deep font-bold rounded-l-md shadow-sm"
                      : ""
                  } ${
                    isEnd && !isStart
                      ? "bg-primary text-bg-deep font-bold rounded-r-md shadow-sm"
                      : ""
                  } ${
                    isSingle || (isStart && isEnd)
                      ? "bg-primary text-bg-deep font-bold rounded-md shadow-sm"
                      : ""
                  } ${
                    !isStart && !isEnd && !isInRange && isCurrentMonth
                      ? "hover:bg-surface-hover rounded-md"
                      : ""
                  }`}
                >
                  {dayNum}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/60 text-[11px]">
            <button
              type="button"
              onClick={() => {
                const todayStr = formatDateISO(new Date());
                setStartDate(todayStr);
                setEndDate(todayStr);
                if (onChange) onChange({ startDate: todayStr, endDate: todayStr });
                setIsOpen(false);
              }}
              className="text-primary hover:underline font-semibold"
            >
              Hôm nay
            </button>

            {startDate && !endDate && (
              <span className="text-text-muted italic text-[10px]">
                Chọn ngày kết thúc...
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
