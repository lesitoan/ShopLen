import React from "react";
import { Compass } from "lucide-react";

interface PlaceholderScreenProps {
  title: string;
}

export default function PlaceholderScreen({ title }: PlaceholderScreenProps) {
  return (
    <div className="bg-white border border-border p-8 rounded-2xl shadow-sm text-center max-w-md mx-auto my-12">
      <div className="text-secondary/30 mb-4 p-4 rounded-full bg-primary-light inline-block shrink-0">
        <Compass size={40} className="animate-spin duration-1000" />
      </div>
      <h2 className="text-[18px] font-bold text-text-primary mb-2">
        Phân Hệ {title}
      </h2>
      <p className="text-[13px] text-text-secondary leading-relaxed">
        Phân hệ quản trị <strong>{title}</strong> đang trong quá trình thiết lập cấu trúc và kết nối API backend. Vui lòng quay lại sau.
      </p>
    </div>
  );
}
