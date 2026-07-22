"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { FAQ_CATEGORIES, FAQ_LIST } from "../constants";

export default function FaqAccordionList() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [openId, setOpenId] = useState<string | null>(FAQ_LIST[0]?.id || null);

  const filteredList = activeCategory === "all"
    ? FAQ_LIST
    : FAQ_LIST.filter((item) => item.categoryId === activeCategory);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="border-b border-border flex gap-6 overflow-x-auto no-scrollbar w-full">
        {FAQ_CATEGORIES.map((cat) => {
          const isActive = cat.id === activeCategory;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setActiveCategory(cat.id);
                const firstOfCat = cat.id === "all" ? FAQ_LIST[0] : FAQ_LIST.find((i) => i.categoryId === cat.id);
                setOpenId(firstOfCat?.id || null);
              }}
              className={`pb-3 text-[14px] whitespace-nowrap transition-colors shrink-0 border-b-2 -mb-px ${
                isActive
                  ? "border-secondary text-secondary font-bold"
                  : "border-transparent text-text-secondary hover:text-text-primary font-medium"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      <div className="border-b border-border divide-y divide-border/70 w-full">
        {filteredList.length === 0 ? (
          <div className="py-8 text-center text-[14px] text-text-secondary">
            Không tìm thấy câu hỏi trong danh mục này.
          </div>
        ) : (
          filteredList.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className="flex flex-col w-full">
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  className="w-full py-4 text-left flex items-center justify-between gap-4 group transition-colors"
                >
                  <h2 className="text-[14.5px] md:text-[16px] font-bold text-text-primary group-hover:text-secondary transition-colors leading-snug">
                    {item.question}
                  </h2>
                  <div
                    className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                      isOpen
                        ? "border-secondary bg-primary-light text-secondary"
                        : "border-border text-text-secondary group-hover:border-secondary group-hover:text-secondary"
                    }`}
                  >
                    {isOpen ? <Minus size={15} /> : <Plus size={15} />}
                  </div>
                </button>

                {isOpen && (
                  <div className="pb-5 pr-4 md:pr-10 flex flex-col gap-3 text-[13.5px] text-text-secondary leading-relaxed animate-in fade-in duration-200">
                    <p>{item.answer}</p>
                    {item.bullets && item.bullets.length > 0 && (
                      <ul className="list-disc pl-5 flex flex-col gap-1 text-[13.5px] text-text-primary">
                        {item.bullets.map((b, bIdx) => (
                          <li key={bIdx}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
