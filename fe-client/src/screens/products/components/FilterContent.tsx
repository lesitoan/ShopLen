import React, { useState, useEffect } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import Checkbox from "@/components/ui/Checkbox";
import { CATEGORY_FILTERS, COLOR_FILTERS } from "../constants";
import { useGetCategoriesQuery, Category } from "@/services/api/categoryApi";
import type { ProductFiltersState } from "../hooks/useProductFilters";

interface FilterContentProps {
  filters: ProductFiltersState;
  actions: {
    setSearch: (val: string) => void;
    toggleCategory: (slug: string) => void;
    toggleColor: (value: string) => void;
    setPriceRange: (min: number, max: number) => void;
  };
}

export default function FilterContent({ filters, actions }: FilterContentProps) {
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isColorOpen, setIsColorOpen] = useState(true);

  // Local state cho thanh trượt giá mượt mà trước khi thả chuột (onMouseUp)
  const [localMinPrice, setLocalMinPrice] = useState(filters.minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(filters.maxPrice);

  useEffect(() => {
    setLocalMinPrice(filters.minPrice);
    setLocalMaxPrice(filters.maxPrice);
  }, [filters.minPrice, filters.maxPrice]);

  const { data: apiCategories = [], isLoading: isCategoriesLoading } = useGetCategoriesQuery();

  const categoryOptions =
    apiCategories.length > 0
      ? apiCategories.map((c: Category) => ({ name: c.name, slug: c.slug }))
      : CATEGORY_FILTERS;

  const selectedCategoriesList = filters.category ? filters.category.split(",") : [];
  const selectedColorsList = filters.color ? filters.color.split(",") : [];

  return (
    <div className="flex flex-col gap-6 text-left">
      <div>
        <h4 className="text-[12px] font-bold text-text-secondary uppercase mb-2 select-none">
          Tìm kiếm
        </h4>
        <div className="relative w-full">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
            <Search size={14} />
          </div>
          <input
            type="text"
            placeholder="Tìm mẫu mèo, gấu, hoa..."
            value={filters.search}
            onChange={(e) => actions.setSearch(e.target.value)}
            className="w-full text-text-primary text-[13px] bg-surface border border-border outline-none transition-all duration-200 rounded-md py-1.5 pl-8 pr-8 focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => actions.setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary/50 hover:text-text-primary transition-colors p-1 rounded-full hover:bg-background"
              title="Xóa từ khóa"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div>
        <h4
          onClick={() => setIsPriceOpen(!isPriceOpen)}
          className="text-[12px] font-bold text-text-secondary uppercase mb-2 select-none flex items-center justify-between cursor-pointer hover:text-text-primary transition-colors"
        >
          <span>Lọc theo giá</span>
          <ChevronDown
            size={14}
            className={`text-text-secondary/70 transition-transform duration-200 ${isPriceOpen ? "" : "-rotate-90"}`}
          />
        </h4>
        {isPriceOpen && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-200 mt-2">
            <div className="relative w-full h-4 flex items-center select-none">
              <div className="absolute h-1 w-full bg-border rounded-lg pointer-events-none" />

              <div
                className="absolute h-1 bg-primary rounded-lg pointer-events-none"
                style={{
                  left: `${(localMinPrice / 300000) * 100}%`,
                  right: `${100 - (localMaxPrice / 300000) * 100}%`,
                }}
              />

              <input
                type="range"
                min={0}
                max={300000}
                step={10000}
                value={localMinPrice}
                onChange={(e) => {
                  const val = Math.min(Number(e.target.value), localMaxPrice - 10000);
                  setLocalMinPrice(val);
                }}
                onMouseUp={() => actions.setPriceRange(localMinPrice, localMaxPrice)}
                onTouchEnd={() => actions.setPriceRange(localMinPrice, localMaxPrice)}
                className={`absolute w-full h-1 pointer-events-none appearance-none bg-transparent outline-none accent-primary [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:cursor-pointer ${localMinPrice > 150000 ? "z-30" : "z-20"}`}
              />

              <input
                type="range"
                min={0}
                max={300000}
                step={10000}
                value={localMaxPrice}
                onChange={(e) => {
                  const val = Math.max(Number(e.target.value), localMinPrice + 10000);
                  setLocalMaxPrice(val);
                }}
                onMouseUp={() => actions.setPriceRange(localMinPrice, localMaxPrice)}
                onTouchEnd={() => actions.setPriceRange(localMinPrice, localMaxPrice)}
                className={`absolute w-full h-1 pointer-events-none appearance-none bg-transparent outline-none accent-primary [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:cursor-pointer ${localMinPrice > 150000 ? "z-20" : "z-30"}`}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-text-secondary font-medium">
              <span>{localMinPrice.toLocaleString("vi-VN")}đ</span>
              <span className="text-secondary font-bold text-[12px]">
                {localMaxPrice.toLocaleString("vi-VN")}đ
              </span>
            </div>
          </div>
        )}
      </div>

      {!isCategoriesLoading && categoryOptions.length > 0 && (
        <div>
          <h4
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="text-[12px] font-bold text-text-secondary uppercase mb-2 select-none flex items-center justify-between cursor-pointer hover:text-text-primary transition-colors"
          >
            <span>Loại sản phẩm</span>
            <ChevronDown
              size={14}
              className={`text-text-secondary/70 transition-transform duration-200 ${isCategoryOpen ? "" : "-rotate-90"}`}
            />
          </h4>
          {isCategoryOpen && (
            <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto no-scrollbar pr-1 animate-in fade-in duration-200">
              {categoryOptions.map((cat) => (
                <label
                  key={cat.slug}
                  className="flex items-center gap-2 cursor-pointer py-0.5 select-none"
                >
                  <Checkbox
                    checked={selectedCategoriesList.includes(cat.slug)}
                    onChange={() => actions.toggleCategory(cat.slug)}
                  />
                  <span className="text-[13px] text-text-secondary hover:text-text-primary transition-colors font-medium">
                    {cat.name}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      <div>
        <h4
          onClick={() => setIsColorOpen(!isColorOpen)}
          className="text-[12px] font-bold text-text-secondary uppercase mb-2 select-none flex items-center justify-between cursor-pointer hover:text-text-primary transition-colors"
        >
          <span>Màu sắc</span>
          <ChevronDown
            size={14}
            className={`text-text-secondary/70 transition-transform duration-200 ${isColorOpen ? "" : "-rotate-90"}`}
          />
        </h4>
        {isColorOpen && (
          <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto no-scrollbar pr-1 animate-in fade-in duration-200">
            {COLOR_FILTERS.map((col) => (
              <label
                key={col.value}
                className="flex items-center gap-2 cursor-pointer py-0.5 select-none"
              >
                <Checkbox
                  checked={selectedColorsList.includes(col.value)}
                  onChange={() => actions.toggleColor(col.value)}
                />
                <div
                  className="w-3.5 h-3.5 rounded-full border border-border/80 shrink-0"
                  style={{ backgroundColor: col.hex }}
                />
                <span className="text-[13px] text-text-secondary hover:text-text-primary transition-colors font-medium">
                  {col.name}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
