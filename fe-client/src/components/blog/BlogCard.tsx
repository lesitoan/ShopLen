import React from "react";
import { Calendar, Clock } from "lucide-react";

interface BlogCardProps {
  id: number;
  title: string;
  description: string;
  image: string;
  tag: string;
  date: string;
  readTime: string;
  href?: string;
}

export default function BlogCard({
  id,
  title,
  description,
  image,
  tag,
  date,
  readTime,
  href,
}: BlogCardProps) {
  const targetHref = href || `/blog/post-${id}`;

  return (
    <a
      href={targetHref}
      className="flex flex-col h-full bg-surface border border-border rounded-lg overflow-hidden group hover:border-primary transition-all duration-300 cursor-pointer"
    >
      <div className="relative aspect-[16/10] w-full bg-background overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute left-3 bottom-3">
          <span className="text-[9px] font-bold text-secondary bg-primary-light border border-primary/20 px-2.5 py-1 rounded-md tracking-wider">
            {tag}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-[14px] font-bold text-text-primary leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-[12px] text-text-secondary leading-relaxed mb-4 line-clamp-2">
            {description}
          </p>
        </div>

        <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] text-text-secondary">
          <div className="flex items-center gap-1.5">
            <Calendar size={12} className="text-text-secondary/70" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="text-text-secondary/70" />
            <span>{readTime}</span>
          </div>
        </div>
      </div>
    </a>
  );
}
