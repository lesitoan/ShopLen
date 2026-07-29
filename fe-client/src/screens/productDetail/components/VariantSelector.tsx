import React from "react";

interface ColorOption {
  name: string;
  hex: string;
}

interface VariantSelectorProps {
  availableColors: ColorOption[];
  selectedColor: string;
  setSelectedColor: (color: string) => void;
}

export default function VariantSelector({
  availableColors,
  selectedColor,
  setSelectedColor,
}: VariantSelectorProps) {
  return (
    <div className="mb-6 select-none">
      <div className="flex items-center gap-2 mb-2.5">
        <h4 className="text-[12px] font-bold text-text-secondary uppercase">
          Màu sắc chọn lựa:
        </h4>
        <span className="text-[13px] font-bold text-text-primary">
          {selectedColor ? (
            <span className="text-secondary">{selectedColor}</span>
          ) : (
            <span className="text-error font-medium text-[12px] animate-pulse">
              (Chưa chọn màu)
            </span>
          )}
        </span>
      </div>

      <div className="flex items-center gap-3 py-1">
        {availableColors.map((color) => {
          const isSelected = selectedColor === color.name;
          return (
            <button
              key={color.name}
              type="button"
              onClick={() => setSelectedColor(color.name)}
              className={`relative w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-200 ${
                isSelected
                  ? "border-primary ring-2 ring-primary/40 scale-110 shadow-sm"
                  : "border-border/80 hover:scale-105 hover:border-primary/40"
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            >
              {isSelected && (
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    color.name === "Trắng" || color.name === "Kem"
                      ? "bg-text-primary"
                      : "bg-white"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
