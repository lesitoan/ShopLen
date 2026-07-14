import React from "react";
import Button from "@/components/ui/button";

export default function HomeScreen() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border py-4 px-6 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-secondary">🌸 Tiệm Len Nhà Kiều</span>
          </div>
          <a href="/ui-demo">
            <Button variant="outline" size="sm">
              Xem UI Catalog
            </Button>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12 flex flex-col items-center justify-center text-center">
        <div className="max-w-xl">
          <span className="text-sm font-semibold text-secondary uppercase tracking-widest bg-primary-light px-3 py-1 rounded-full">
            Handmade with Love
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mt-6 mb-4 leading-tight">
            Móc Khóa Len Handmade Xinh Xắn
          </h1>
          <p className="text-base text-text-secondary mb-8 leading-relaxed">
            Chào mừng bạn đến với Tiệm Len Nhà Kiều. Chúng tôi cung cấp các sản phẩm móc khóa len, hoa len và đồ decor đan tay tỉ mỉ, giúp bạn có những món quà tuyệt vời nhất cho người thân yêu.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a href="/ui-demo">
              <Button variant="primary" size="lg" className="rounded-full px-8 shadow-md">
                Khám phá UI System Demo
              </Button>
            </a>
            <Button variant="secondary" size="lg" className="rounded-full px-8">
              Xem sản phẩm
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-border py-6 text-center text-[13px] text-text-secondary">
        <p>© 2026 Tiệm Len Nhà Kiều. Cửa hàng móc khóa len handmade.</p>
      </footer>
    </div>
  );
}
