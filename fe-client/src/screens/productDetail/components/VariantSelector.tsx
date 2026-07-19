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
    <div className="mb-6">
      <h4 className="text-[12px] font-bold text-text-secondary uppercase mb-2.5 select-none">
        Màu sắc chọn lựa
      </h4>
      <div className="flex items-center gap-3 py-1 select-none">
        {availableColors.map((color) => (
          <button
            key={color.name}
            onClick={() => setSelectedColor(color.name)}
            className={`relative w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-200 ${
              selectedColor === color.name
                ? "border-primary ring-2 ring-primary/30 scale-110"
                : "border-border/80 hover:scale-105"
            }`}
            style={{ backgroundColor: color.hex }}
            title={color.name}
          >
            {selectedColor === color.name && (
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  color.name === "Trắng" || color.name === "Kem"
                    ? "bg-text-primary"
                    : "bg-white"
                }`}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
