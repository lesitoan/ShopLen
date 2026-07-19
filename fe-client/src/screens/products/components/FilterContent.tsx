import React, { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import Checkbox from "@/components/ui/Checkbox";
import { CATEGORY_FILTERS, COLOR_FILTERS, SUGGESTED_TAGS } from "../constants";

interface FilterContentProps {
  search: string;
  setSearch: (val: string) => void;
  minPrice: number;
  setMinPrice: (val: number) => void;
  maxPrice: number;
  setMaxPrice: (val: number) => void;
  selectedCategories: string[];
  toggleCategory: (slug: string) => void;
  selectedColors: string[];
  toggleColor: (name: string) => void;
  selectedTags: string[];
  toggleTag: (tag: string) => void;
}

export default function FilterContent({
  search,
  setSearch,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  selectedCategories,
  toggleCategory,
  selectedColors,
  toggleColor,
  selectedTags,
  toggleTag,
}: FilterContentProps) {
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isColorOpen, setIsColorOpen] = useState(true);
  const [isTagsOpen, setIsTagsOpen] = useState(true);

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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-text-primary text-[13px] bg-surface border border-border outline-none transition-all duration-200 rounded-md py-1.5 pl-8 pr-3 focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
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
              {/* Background Track */}
              <div className="absolute h-1 w-full bg-border rounded-lg pointer-events-none" />

              {/* Active Range Highlight */}
              <div
                className="absolute h-1 bg-primary rounded-lg pointer-events-none"
                style={{
                  left: `${(minPrice / 300000) * 100}%`,
                  right: `${100 - (maxPrice / 300000) * 100}%`,
                }}
              />

              {/* Min Range Slider */}
              <input
                type="range"
                min={0}
                max={300000}
                step={10000}
                value={minPrice}
                onChange={(e) => {
                  const val = Math.min(Number(e.target.value), maxPrice - 10000);
                  setMinPrice(val);
                }}
                className={`absolute w-full h-1 pointer-events-none appearance-none bg-transparent outline-none accent-primary [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:cursor-pointer ${minPrice > 150000 ? "z-30" : "z-20"}`}
              />

              <input
                type="range"
                min={0}
                max={300000}
                step={10000}
                value={maxPrice}
                onChange={(e) => {
                  const val = Math.max(Number(e.target.value), minPrice + 10000);
                  setMaxPrice(val);
                }}
                className={`absolute w-full h-1 pointer-events-none appearance-none bg-transparent outline-none accent-primary [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:cursor-pointer ${minPrice > 150000 ? "z-20" : "z-30"}`}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-text-secondary font-medium">
              <span>{minPrice.toLocaleString("vi-VN")}đ</span>
              <span className="text-secondary font-bold text-[12px]">
                {maxPrice.toLocaleString("vi-VN")}đ
              </span>
            </div>
          </div>
        )}
      </div>

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
            {CATEGORY_FILTERS.map((cat) => (
              <label
                key={cat.slug}
                className="flex items-center gap-2 cursor-pointer py-0.5 select-none"
              >
                <Checkbox
                  checked={selectedCategories.includes(cat.slug)}
                  onChange={() => toggleCategory(cat.slug)}
                />
                <span className="text-[13px] text-text-secondary hover:text-text-primary transition-colors font-medium">
                  {cat.name}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

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
                key={col.name}
                className="flex items-center gap-2 cursor-pointer py-0.5 select-none"
              >
                <Checkbox
                  checked={selectedColors.includes(col.name)}
                  onChange={() => toggleColor(col.name)}
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

      <div>
        <h4 
          onClick={() => setIsTagsOpen(!isTagsOpen)}
          className="text-[12px] font-bold text-text-secondary uppercase mb-2 select-none flex items-center justify-between cursor-pointer hover:text-text-primary transition-colors"
        >
          <span>Trang gợi ý</span>
          <ChevronDown 
            size={14} 
            className={`text-text-secondary/70 transition-transform duration-200 ${isTagsOpen ? "" : "-rotate-90"}`} 
          />
        </h4>
        {isTagsOpen && (
          <div className="flex flex-col gap-1.5 animate-in fade-in duration-200">
            {SUGGESTED_TAGS.map((tag) => (
              <label
                key={tag}
                className="flex items-center gap-2 cursor-pointer py-0.5 select-none"
              >
                <Checkbox
                  checked={selectedTags.includes(tag)}
                  onChange={() => toggleTag(tag)}
                />
                <span className="text-[13px] text-text-secondary hover:text-text-primary transition-colors font-medium">
                  {tag}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
