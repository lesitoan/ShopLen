"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-text-muted">
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-text-primary transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={item.label}>
            <ChevronRight className="w-3.5 h-3.5 text-border-light shrink-0" />
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:text-text-primary transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-text-primary">{item.label}</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
