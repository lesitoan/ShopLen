"use client";

import React, { useState } from "react";
import { List, ChevronDown, ChevronUp } from "lucide-react";
import type { TocItem } from "@/types/blog.type";

interface TableOfContentsProps {
  toc: TocItem[];
  className?: string;
}

export default function TableOfContents({ toc, className = "my-4" }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!toc || toc.length === 0) return null;

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const targetEl = document.getElementById(id);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={`border border-border bg-primary-light/30 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[13px] font-bold text-text-primary uppercase tracking-wider">
          <List size={15} className="text-secondary shrink-0" />
          <span className="line-clamp-1">Mục lục nội dung</span>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-text-secondary hover:text-text-primary text-[12px] flex items-center gap-1 font-medium transition-colors shrink-0 ml-2"
        >
          <span>{isOpen ? "Thu gọn" : "Mở rộng"}</span>
          {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {isOpen && (
        <nav aria-label="Mục lục bài viết" className="mt-3 pt-3 border-t border-border/60">
          <ul className="flex flex-col gap-2">
            {toc.map((item) => (
              <li
                key={item.id}
                className={item.level === 3 ? "pl-3 text-[12.5px]" : "text-[13px] font-medium"}
              >
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleScrollTo(e, item.id)}
                  className="text-text-primary hover:text-secondary transition-colors line-clamp-1 leading-snug"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
