"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const totalNumbers = siblingCount * 2 + 5;
    if (totalNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, "DOTS_RIGHT", totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [firstPageIndex, "DOTS_LEFT", ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [firstPageIndex, "DOTS_LEFT", ...middleRange, "DOTS_RIGHT", lastPageIndex];
    }

    return [];
  };

  const pages = getPageNumbers();

  return (
    <ol className={`flex items-center space-x-1 border-0 ${className}`}>
      {/* Prev Button */}
      <li>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          title="Trang trước"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed border border-border/60"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </li>

      {/* Page Items & Dots */}
      {pages.map((page, index) => {
        if (page === "DOTS_LEFT") {
          return (
            <li key={`dots-left-${index}`}>
              <button
                onClick={() => onPageChange(Math.max(1, currentPage - 3))}
                title="Lùi 3 trang"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors border border-border/60 text-xs font-semibold"
              >
                …
              </button>
            </li>
          );
        }

        if (page === "DOTS_RIGHT") {
          return (
            <li key={`dots-right-${index}`}>
              <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 3))}
                title="Tiến 3 trang"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors border border-border/60 text-xs font-semibold"
              >
                …
              </button>
            </li>
          );
        }

        const pageNum = page as number;
        const isActive = pageNum === currentPage;

        return (
          <li key={pageNum}>
            <button
              onClick={() => onPageChange(pageNum)}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold leading-none transition-all border ${
                isActive
                  ? "bg-primary text-bg-deep font-bold border-primary shadow-sm shadow-primary/20"
                  : "bg-surface-muted text-text-secondary hover:bg-surface-hover hover:text-text-primary border-border/60"
              }`}
            >
              {pageNum}
            </button>
          </li>
        );
      })}

      {/* Next Button */}
      <li>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          title="Trang tiếp"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed border border-border/60"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </li>
    </ol>
  );
}
