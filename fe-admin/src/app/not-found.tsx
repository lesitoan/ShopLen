"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] mt-20 sm:mt-24 pb-12">
      <div className="max-w-md w-full text-center space-y-6 bg-surface p-8 rounded-2xl border border-border shadow-2xl shadow-black/50">
        <div className="relative mx-auto w-24 h-24 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
          <FileQuestion className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <div className="text-4xl font-extrabold text-primary tracking-wider font-mono">
            404
          </div>
          <h1 className="text-xl font-bold text-text-highlight">
            Không tìm thấy trang
          </h1>
          <p className="text-xs text-text-muted leading-relaxed">
            Trang bạn đang tìm kiếm không tồn tại, đã bị di chuyển hoặc địa chỉ URL không chính xác.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => router.back()}
            className="w-full sm:w-auto"
          >
            Quay lại trang trước
          </Button>

          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Home className="w-4 h-4" />}
              className="w-full"
            >
              Về Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

