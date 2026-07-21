import React from "react";
import type { BlogTag } from "@/types/blog.type";

interface TagFilterBarProps {
  tags: BlogTag[];
  activeTag: string;
  onTagChange: (key: string) => void;
}

export default function TagFilterBar({ tags, activeTag, onTagChange }: TagFilterBarProps) {
  return (
    <div className="relative border-b border-border">
      <div className="flex gap-6 overflow-x-auto no-scrollbar -mb-px">
        {tags.map((tag) => (
          <button
            key={tag.key}
            type="button"
            role="tab"
            aria-selected={activeTag === tag.key}
            onClick={() => onTagChange(tag.key)}
            className={`pb-2.5 text-[14px] whitespace-nowrap transition-colors border-b-2 shrink-0 ${
              activeTag === tag.key
                ? "border-primary text-secondary font-semibold"
                : "border-transparent text-text-secondary hover:text-text-primary hover:border-border font-medium"
            }`}
          >
            {tag.label}
          </button>
        ))}
      </div>
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none md:hidden" />
    </div>
  );
}
