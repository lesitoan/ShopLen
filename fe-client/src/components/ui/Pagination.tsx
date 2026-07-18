import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className={`flex items-center justify-center gap-1.5 ${className}`}>
      {/* Prev Button */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-8 h-8 rounded-full border border-border bg-surface text-text-primary hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors active:scale-95 duration-150"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Pages */}
      {pages.map((page, index) => {
        if (page === "...") {
          return (
            <span key={`dots-${index}`} className="w-8 h-8 flex items-center justify-center text-text-secondary select-none text-[13px]">
              ...
            </span>
          );
        }

        const isCurrent = page === currentPage;

        return (
          <button
            key={`page-${page}`}
            onClick={() => onPageChange(page as number)}
            className={`w-8 h-8 rounded-full text-[13px] font-medium transition-all active:scale-95 duration-150 flex items-center justify-center ${
              isCurrent
                ? "bg-primary text-white font-bold"
                : "border border-border bg-surface text-text-primary hover:bg-background"
            }`}
          >
            {page}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-8 h-8 rounded-full border border-border bg-surface text-text-primary hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors active:scale-95 duration-150"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
