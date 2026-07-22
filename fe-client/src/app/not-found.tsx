import React from "react";
import Link from "next/link";
import { Home } from "lucide-react";
import Button from "@/components/ui/Button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/common/FloatingActions";

export const metadata = {
  title: "404 - Không tìm thấy trang | Tiệm Len Nhà Kiều",
  description: "Trang bạn đang truy cập không tồn tại hoặc đã được di chuyển sang đường dẫn mới.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 w-full flex flex-col items-center justify-center py-12 md:py-16 px-4">
        <div className="max-w-md w-full border border-border rounded-xl bg-surface p-6 md:p-8 flex flex-col items-center text-center gap-5 shadow-none my-auto">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[54px] md:text-[64px] font-extrabold text-primary select-none leading-none tracking-tight">
              404
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-[18px] md:text-[20px] font-bold text-text-primary">
              Trang không tồn tại
            </h1>
            <p className="text-[13px] text-text-secondary leading-relaxed">
              Trang bạn đang tìm kiếm không tồn tại, đã bị gỡ bỏ hoặc thay đổi địa chỉ đường dẫn.
            </p>
          </div>

          <div className="w-full pt-2">
            <Link href="/" className="w-full block">
              <Button variant="primary" className="w-full text-[13.5px]">
                <Home size={16} />
                <span>Về trang chủ</span>
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
