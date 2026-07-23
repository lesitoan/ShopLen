"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface ComingSoonScreenProps {
  title: string;
  description: string;
  expectedDate?: string;
}

export function ComingSoonScreen({
  title,
  description,
  expectedDate = "Q3 / 2026",
}: ComingSoonScreenProps) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full bg-surface border border-border rounded-2xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />

        <h1 className="text-2xl sm:text-3xl font-bold text-text-highlight tracking-tight mb-3">
          {title}
        </h1>

        <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto leading-relaxed mb-6">
          {description}
        </p>

        {/* Expected Completion */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-muted border border-border text-xs text-text-muted mb-8">
          <Clock className="w-4 h-4 text-status-warning" />
          <span>Dự kiến hoàn thiện: <strong className="text-text-primary">{expectedDate}</strong></span>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <Link href="/">
            <Button variant="primary" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Quay về Trang Tổng Quan
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
