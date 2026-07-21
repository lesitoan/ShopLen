import React from "react";
import Link from "next/link";
import { POLICY_NAV_ITEMS } from "../constants";

interface PolicySidebarProps {
  currentPath: string;
}

export default function PolicySidebar({ currentPath }: PolicySidebarProps) {
  return (
    <>
      <aside className="hidden md:block w-[260px] shrink-0 self-start sticky top-[80px]">
        <div className="border border-border rounded-lg overflow-hidden bg-surface">
          <div className="bg-primary-light px-4 py-3 border-b border-border">
            <h3 className="text-[13px] font-bold text-secondary uppercase tracking-wider">
              Danh mục chính sách
            </h3>
          </div>

          <nav aria-label="Danh mục chính sách" className="flex flex-col divide-y divide-border">
            {POLICY_NAV_ITEMS.map((item) => {
              const isActive = item.href === currentPath;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-3 text-[13.5px] transition-colors flex items-center justify-between ${
                    isActive
                      ? "bg-primary text-secondary font-semibold border-l-4 border-secondary pl-3"
                      : "text-text-primary hover:bg-primary-light/40 hover:text-secondary font-medium"
                  }`}
                >
                  <span className="line-clamp-1">{item.label}</span>
                  <span aria-hidden="true" className="text-[12px] opacity-60">›</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      <div className="md:hidden relative w-full">
        <nav aria-label="Danh mục chính sách di động" className="flex gap-2 overflow-x-auto no-scrollbar pb-1 w-full">
          {POLICY_NAV_ITEMS.map((item) => {
            const isActive = item.href === currentPath;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`border rounded-md px-3 py-1.5 text-[13px] whitespace-nowrap transition-colors shrink-0 ${
                  isActive
                    ? "bg-primary text-secondary font-semibold border-primary"
                    : "bg-surface text-text-secondary border-border hover:border-primary/40 hover:text-text-primary"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
      </div>
    </>
  );
}
