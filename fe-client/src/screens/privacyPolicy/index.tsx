import React from "react";
import Link from "next/link";
import PolicySidebar from "./components/PolicySidebar";
import PolicyContent from "./components/PolicyContent";
import type { PolicySection } from "./constants";

export interface PolicyScreenProps {
  currentPath: string;
  pageTitle: string;
  subtitle?: string;
  sections: PolicySection[];
  commitmentTitle?: string;
  commitmentDesc?: string;
}

export default function PolicyScreen({
  currentPath,
  pageTitle,
  subtitle = "Cập nhật lần cuối: 20 tháng 7, 2025 · Tiệm Len Nhà Kiều cam kết bảo vệ tuyệt đối thông tin và quyền lợi khách hàng.",
  sections,
  commitmentTitle,
  commitmentDesc,
}: PolicyScreenProps) {
  return (
    <main className="flex-1">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-6 w-full">
        <div className="flex flex-col gap-2 pb-4 border-b border-border w-full">
          <nav aria-label="Breadcrumb" className="text-[12px] text-text-secondary flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-text-primary transition-colors">
              Trang chủ
            </Link>
            <span>›</span>
            <span className="text-text-primary font-medium">{pageTitle}</span>
          </nav>

          <h1 className="text-[22px] md:text-[28px] font-bold text-text-primary uppercase tracking-wider">
            {pageTitle}
          </h1>

          {subtitle && (
            <p className="text-[13px] text-text-secondary">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:items-start w-full">
          <PolicySidebar currentPath={currentPath} />
          <PolicyContent
            sections={sections}
            commitmentTitle={commitmentTitle}
            commitmentDesc={commitmentDesc}
          />
        </div>
      </div>
    </main>
  );
}
