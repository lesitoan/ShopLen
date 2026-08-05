import React from "react";
import type { ProductOption } from "@/types/product.type";

interface OptionSelectorProps {
  option: ProductOption;
  selectedValue: string;
  onSelect: (code: string) => void;
}

export default function OptionSelector({
  option,
  selectedValue,
  onSelect,
}: OptionSelectorProps) {
  const selectedLabel = option.values.find(
    (v) => v.code === selectedValue
  )?.label;

  return (
    <div className="mb-6 select-none">
      <div className="flex items-center gap-2 mb-2.5">
        <h4 className="text-[12px] font-bold text-text-secondary uppercase">
          {option.name}:
        </h4>
        <span className="text-[13px] font-bold text-text-primary">
          {selectedLabel ? (
            <span className="text-secondary">{selectedLabel}</span>
          ) : (
            <span className="text-error font-medium text-[12px] animate-pulse">
              (Chưa chọn)
            </span>
          )}
        </span>
      </div>

      {option.optionType === "COLOR" ? (
        <div className="flex items-center gap-3 py-1 flex-wrap">
          {option.values.map((val) => {
            const isSelected = selectedValue === val.code;
            const isLight =
              val.colorHex?.toUpperCase() === "#FFFFFF" ||
              val.colorHex?.toUpperCase() === "#FEF3C7";
            return (
              <button
                key={val.code}
                type="button"
                onClick={() => onSelect(val.code)}
                className={`relative w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-200 ${
                  isSelected
                    ? "border-primary ring-2 ring-primary/40 scale-110 shadow-sm"
                    : "border-border/80 hover:scale-105 hover:border-primary/40"
                }`}
                style={{ backgroundColor: val.colorHex || "#E5E7EB" }}
                title={val.label}
              >
                {isSelected && (
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      isLight ? "bg-text-primary" : "bg-white"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center gap-2.5 py-1 flex-wrap">
          {option.values.map((val) => {
            const isSelected = selectedValue === val.code;
            return (
              <button
                key={val.code}
                type="button"
                onClick={() => onSelect(val.code)}
                className={`px-4 py-1.5 rounded-md text-[13px] font-medium border transition-all duration-200 ${
                  isSelected
                    ? "border-primary bg-primary-light/60 text-secondary font-bold shadow-sm"
                    : "border-border/80 bg-surface text-text-secondary hover:border-primary/40 hover:text-text-primary"
                }`}
              >
                {val.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
