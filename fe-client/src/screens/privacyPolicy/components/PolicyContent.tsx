import React from "react";
import { ShieldCheck } from "lucide-react";
import type { PolicySection } from "../constants";

interface PolicyContentProps {
  sections: PolicySection[];
  commitmentTitle?: string;
  commitmentDesc?: string;
}

export default function PolicyContent({
  sections,
  commitmentTitle = "Cam kết bảo vệ dữ liệu khách hàng",
  commitmentDesc = "Tiệm Len Nhà Kiều cam kết bảo vệ thông tin riêng tư và dữ liệu cá nhân của quý khách. Mọi dữ liệu thu thập đều tuân thủ các quy định pháp luật và chính sách bảo mật của Google.",
}: PolicyContentProps) {
  return (
    <div className="w-full flex-1 min-w-0 border-0 md:border md:border-border rounded-none md:rounded-lg bg-transparent md:bg-surface p-0 md:p-7 flex flex-col gap-6">
      {commitmentTitle && (
        <div className="bg-primary-light/40 border border-border rounded-lg p-4 flex items-start gap-3">
          <ShieldCheck size={24} className="text-secondary shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1 text-[13px] text-text-primary">
            <span className="font-bold text-[14px] text-secondary">
              {commitmentTitle}
            </span>
            <p className="text-text-secondary leading-relaxed">
              {commitmentDesc}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6 divide-y divide-border/60">
        {sections.map((section, idx) => (
          <div key={section.id} className={idx > 0 ? "pt-5 flex flex-col gap-3" : "flex flex-col gap-3"}>
            <h2 className="text-[16px] md:text-[18px] font-bold text-text-primary border-l-4 border-primary pl-3">
              {section.title}
            </h2>

            {section.paragraphs.map((para, pIdx) => (
              <p key={pIdx} className="text-[14px] text-text-primary leading-relaxed">
                {para}
              </p>
            ))}

            {section.bullets && section.bullets.length > 0 && (
              <ul className="list-disc pl-6 flex flex-col gap-1.5 text-[14px] text-text-primary leading-relaxed">
                {section.bullets.map((bullet, bIdx) => (
                  <li key={bIdx}>{bullet}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
