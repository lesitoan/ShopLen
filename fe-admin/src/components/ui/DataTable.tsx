"use client";

import React from "react";
import { Inbox } from "lucide-react";
import { Pagination } from "./Pagination";

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  render?: (row: T, index: number) => React.ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  pagination?: PaginationProps;
  keyExtractor: (item: T, index: number) => string | number;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  emptyMessage = "Không có dữ liệu hiển thị",
  pagination,
  keyExtractor,
  className = "",
}: DataTableProps<T>) {
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div
      className={`w-full bg-surface border border-border rounded-lg overflow-hidden shadow-sm ${className}`}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-surface-muted text-text-secondary text-xs uppercase font-medium border-b border-border">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className={`px-4 py-3.5 ${alignClasses[col.align || "left"]}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, rowIndex) => (
                <tr key={`skeleton-${rowIndex}`} className="animate-pulse">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-4">
                      <div className="h-4 bg-surface-hover rounded w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-text-muted"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Inbox className="w-10 h-10 stroke-1 text-border-light" />
                    <p className="text-sm font-medium">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={keyExtractor(row, index)}
                  className="hover:bg-surface-hover transition-colors duration-150"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3.5 text-text-primary ${
                        alignClasses[col.align || "left"]
                      }`}
                    >
                      {col.render
                        ? col.render(row, index)
                        : (row as Record<string, unknown>)[col.key] !== undefined
                        ? String((row as Record<string, unknown>)[col.key])
                        : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-border bg-surface-muted text-xs text-text-secondary">
          <div>
            Hiển thị{" "}
            <span className="font-medium text-text-primary">
              {Math.min(
                (pagination.currentPage - 1) * pagination.pageSize + 1,
                pagination.totalItems
              )}
            </span>{" "}
            -{" "}
            <span className="font-medium text-text-primary">
              {Math.min(
                pagination.currentPage * pagination.pageSize,
                pagination.totalItems
              )}
            </span>{" "}
            trong tổng số{" "}
            <span className="font-medium text-text-primary">
              {pagination.totalItems}
            </span>{" "}
            bản ghi
          </div>

          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages || 1}
            onPageChange={pagination.onPageChange}
          />
        </div>
      )}
    </div>
  );
}
