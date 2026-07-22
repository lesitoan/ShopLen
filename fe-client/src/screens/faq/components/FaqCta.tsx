import React from "react";
import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";

export default function FaqCta() {
  return (
    <section aria-label="Hỗ trợ trực tiếp" className="pt-4">
      <div className="border border-border rounded-xl bg-primary-light/40 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="flex flex-col gap-1.5 max-w-xl">
          <h2 className="text-[16px] md:text-[18px] font-bold text-text-primary">
            Bạn Chưa Tìm Thấy Câu Hỏi Mong Muốn?
          </h2>
          <p className="text-[13px] text-text-secondary leading-relaxed">
            Đừng ngần ngại liên hệ trực tiếp với Tiệm Len Nhà Kiều. Đội ngũ tư vấn luôn sẵn sàng hỗ trợ bạn 24/7.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto justify-center shrink-0">
          <Link
            href="/lien-he"
            className="bg-primary hover:bg-primary-hover active:bg-primary-active text-white px-5 py-2.5 rounded-lg text-[13px] font-semibold flex items-center justify-center gap-2 w-full sm:w-auto transition-colors"
          >
            <MessageCircle size={15} />
            <span>Gửi tin nhắn</span>
          </Link>
          <a
            href="tel:0987654321"
            className="bg-surface border border-border hover:border-secondary text-text-primary hover:text-secondary px-5 py-2.5 rounded-lg text-[13px] font-semibold flex items-center justify-center gap-2 w-full sm:w-auto transition-colors"
          >
            <Phone size={15} />
            <span>Gọi Hotline: 0987.654.321</span>
          </a>
        </div>
      </div>
    </section>
  );
}
