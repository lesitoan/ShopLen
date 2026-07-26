"use client";

import React, {
  forwardRef,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

export interface DatePickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "max" | "min"> {
  error?: string | boolean;
  leftIcon?: React.ReactNode;
  value?: string;
  defaultValue?: string;
  max?: string | number;
  min?: string | number;
  disableFutureDates?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onValueChange?: (val: string) => void;
}

const MONTH_NAMES_VI = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

const WEEKDAYS_VI = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

function parseFormattedDate(dateStr?: string | null): Date | null {
  if (!dateStr) return null;
  const str = dateStr.trim();
  if (!str) return null;

  const cleanStr = str.includes("T") ? str.split("T")[0] : str;

  if (cleanStr.includes("-")) {
    const parts = cleanStr.split("-");
    if (parts.length >= 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        return new Date(year, month, day);
      }
    }
  }

  if (cleanStr.includes("/")) {
    const parts = cleanStr.split("/");
    if (parts.length >= 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        return new Date(year, month, day);
      }
    }
  }

  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
}

function formatDateToIsoString(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDateDisplay(d: Date | null): string {
  if (!d) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${day}/${month}/${year}`;
}

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      error,
      leftIcon,
      className = "",
      disabled,
      value,
      defaultValue,
      max,
      disableFutureDates = false,
      onChange,
      onValueChange,
      placeholder = "Chọn ngày (DD/MM/YYYY)",
      name,
      ...props
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const hiddenInputRef = useRef<HTMLInputElement | null>(null);

    const initialDate =
      parseFormattedDate(
        typeof value === "string" ? value : (defaultValue as string)
      ) || null;

    const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate);
    const [viewDate, setViewDate] = useState<Date>(initialDate || new Date());
    const [isOpen, setIsOpen] = useState(false);

    const today = new Date();
    const endOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
      999
    );

    const maxStr = typeof max !== "undefined" && max !== null ? String(max) : "";
    const maxLimitDate = maxStr
      ? parseFormattedDate(maxStr)
      : disableFutureDates
      ? endOfToday
      : null;

    useEffect(() => {
      if (typeof value !== "undefined") {
        const parsed = parseFormattedDate(value);
        setSelectedDate(parsed);
        if (parsed) {
          setViewDate(parsed);
        }
      }
    }, [value]);

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
        }
      };
      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen]);

    const setRefs = (element: HTMLInputElement | null) => {
      hiddenInputRef.current = element;
      if (typeof ref === "function") {
        ref(element);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLInputElement | null>).current = element;
      }
    };

    const triggerInputChange = useCallback(
      (isoValue: string) => {
        if (hiddenInputRef.current) {
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            "value"
          )?.set;
          if (nativeInputValueSetter) {
            nativeInputValueSetter.call(hiddenInputRef.current, isoValue);
          } else {
            hiddenInputRef.current.value = isoValue;
          }

          const event = new Event("change", { bubbles: true });
          hiddenInputRef.current.dispatchEvent(event);
        }

        if (onValueChange) {
          onValueChange(isoValue);
        }
      },
      [onValueChange]
    );

    const handleSelectDate = (date: Date) => {
      if (maxLimitDate && date > maxLimitDate) return;

      setSelectedDate(date);
      const isoStr = formatDateToIsoString(date);
      triggerInputChange(isoStr);
      setIsOpen(false);
    };

    const handleClear = () => {
      setSelectedDate(null);
      triggerInputChange("");
      setIsOpen(false);
    };

    const handleSelectToday = () => {
      const now = new Date();
      if (maxLimitDate && now > maxLimitDate) return;

      setSelectedDate(now);
      setViewDate(now);
      triggerInputChange(formatDateToIsoString(now));
      setIsOpen(false);
    };

    const currentYear = viewDate.getFullYear();
    const currentMonth = viewDate.getMonth();

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const prevMonthDaysToShow = firstDayOfMonth;
    const totalGridCells = 42;

    const prevMonthDays = Array.from(
      { length: prevMonthDaysToShow },
      (_, i) => daysInPrevMonth - prevMonthDaysToShow + i + 1
    );
    const currentMonthDays = Array.from(
      { length: daysInMonth },
      (_, i) => i + 1
    );
    const nextMonthDaysToShow =
      totalGridCells - (prevMonthDays.length + currentMonthDays.length);
    const nextMonthDays = Array.from(
      { length: nextMonthDaysToShow },
      (_, i) => i + 1
    );

    const isNextMonthDisabled = maxLimitDate
      ? new Date(currentYear, currentMonth + 1, 1) > maxLimitDate
      : false;

    const handlePrevMonth = () => {
      setViewDate(new Date(currentYear, currentMonth - 1, 1));
    };

    const handleNextMonth = () => {
      if (isNextMonthDisabled) return;
      setViewDate(new Date(currentYear, currentMonth + 1, 1));
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newYear = parseInt(e.target.value, 10);
      setViewDate(new Date(newYear, currentMonth, 1));
    };

    const yearsOptions: number[] = [];
    const maxYear = maxLimitDate
      ? maxLimitDate.getFullYear()
      : today.getFullYear();

    for (let y = maxYear; y >= maxYear - 100; y--) {
      yearsOptions.push(y);
    }

    const baseClasses =
      "w-full text-text-primary text-[14px] bg-surface border outline-none transition-all duration-200 ease-out rounded-md py-2 px-3 pr-3 cursor-pointer select-none flex items-center justify-between";

    let stateClasses =
      "border-border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20";

    if (error) {
      stateClasses =
        "border-error focus-within:border-error focus-within:ring-1 focus-within:ring-error/20";
    } else if (disabled) {
      stateClasses =
        "bg-background border-border text-text-secondary/50 cursor-not-allowed";
    }

    const iconToRender = leftIcon ?? <CalendarIcon size={16} />;

    return (
      <div ref={containerRef} className="relative w-full text-left">
        <input
          type="text"
          ref={setRefs}
          name={name}
          disabled={disabled}
          value={selectedDate ? formatDateToIsoString(selectedDate) : ""}
          onChange={onChange ?? (() => {})}
          readOnly={!onChange}
          className="hidden"
          {...props}
        />

        <div
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          className={`${baseClasses} ${stateClasses} ${className}`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="text-text-secondary shrink-0">{iconToRender}</div>
            <span
              className={`truncate ${
                selectedDate ? "text-text-primary font-medium" : "text-text-secondary/70"
              }`}
            >
              {selectedDate ? formatDateDisplay(selectedDate) : placeholder}
            </span>
          </div>

          {selectedDate && !disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="p-1 text-text-secondary hover:text-error rounded-full hover:bg-background transition-colors"
              title="Xóa ngày"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {isOpen && !disabled && (
          <div className="absolute left-0 top-full mt-2 z-50 bg-surface border border-border rounded-2xl shadow-xl p-4 w-[300px] animate-in fade-in zoom-in-95 duration-150 text-left">
            <div className="flex items-center justify-between gap-2 pb-3 mb-2 border-b border-border/60">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-[14px] font-bold text-text-primary">
                  {MONTH_NAMES_VI[currentMonth]}
                </span>
                <select
                  value={currentYear}
                  onChange={handleYearChange}
                  className="bg-background border border-border/80 rounded-md px-1.5 py-0.5 text-[13px] font-bold text-secondary cursor-pointer outline-none hover:border-primary/50"
                >
                  {yearsOptions.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1.5 text-text-secondary hover:text-text-primary rounded-lg hover:bg-background transition-colors"
                  title="Tháng trước"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  disabled={isNextMonthDisabled}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isNextMonthDisabled
                      ? "text-text-secondary/30 cursor-not-allowed"
                      : "text-text-secondary hover:text-text-primary hover:bg-background"
                  }`}
                  title="Tháng sau"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center mb-1">
              {WEEKDAYS_VI.map((day, idx) => (
                <span
                  key={day}
                  className={`text-[11.5px] font-bold py-1 ${
                    idx === 0 ? "text-error/80" : "text-text-secondary"
                  }`}
                >
                  {day}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {prevMonthDays.map((d, i) => (
                <div
                  key={`prev-${i}`}
                  className="text-[12.5px] text-text-secondary/30 py-1.5 flex items-center justify-center pointer-events-none"
                >
                  {d}
                </div>
              ))}

              {currentMonthDays.map((day) => {
                const dateObj = new Date(
                  currentYear,
                  currentMonth,
                  day,
                  23,
                  59,
                  59
                );
                const isFutureDate = maxLimitDate ? dateObj > maxLimitDate : false;

                const isSelected =
                  selectedDate &&
                  selectedDate.getDate() === day &&
                  selectedDate.getMonth() === currentMonth &&
                  selectedDate.getFullYear() === currentYear;

                const isToday =
                  today.getDate() === day &&
                  today.getMonth() === currentMonth &&
                  today.getFullYear() === currentYear;

                if (isFutureDate) {
                  return (
                    <button
                      key={`curr-${day}`}
                      type="button"
                      disabled
                      title="Không thể chọn ngày trong tương lai"
                      className="relative text-[13px] py-1.5 rounded-lg font-medium text-text-secondary/30 bg-transparent cursor-not-allowed opacity-40 select-none flex items-center justify-center"
                    >
                      {day}
                    </button>
                  );
                }

                return (
                  <button
                    key={`curr-${day}`}
                    type="button"
                    onClick={() =>
                      handleSelectDate(new Date(currentYear, currentMonth, day))
                    }
                    className={`relative text-[13px] py-1.5 rounded-lg font-medium transition-all duration-150 flex items-center justify-center ${
                      isSelected
                        ? "bg-secondary text-white font-bold shadow-xs scale-105"
                        : "text-text-primary hover:bg-primary-light hover:text-secondary"
                    }`}
                  >
                    {day}
                    {isToday && !isSelected && (
                      <span className="absolute bottom-1 w-1 h-1 rounded-full bg-secondary" />
                    )}
                  </button>
                );
              })}

              {nextMonthDays.map((d, i) => (
                <div
                  key={`next-${i}`}
                  className="text-[12.5px] text-text-secondary/30 py-1.5 flex items-center justify-center pointer-events-none"
                >
                  {d}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 mt-2 border-t border-border/60 text-[12.5px]">
              <button
                type="button"
                onClick={handleClear}
                className="text-text-secondary hover:text-error font-medium transition-colors"
              >
                Xóa ngày
              </button>
              <button
                type="button"
                onClick={handleSelectToday}
                className="text-secondary hover:underline font-bold"
              >
                Hôm nay
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";
export default DatePicker;
