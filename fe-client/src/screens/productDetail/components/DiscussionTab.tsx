import React from "react";
import { MessageSquareDashed } from "lucide-react";

export default function DiscussionTab() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center select-none animate-in fade-in duration-200">
      <div className="w-14 h-14 rounded-full bg-surface border border-border/80 flex items-center justify-center text-text-secondary/70 mb-4 shadow-sm">
        <MessageSquareDashed size={28} />
      </div>
      <h3 className="text-[16px] font-bold text-text-primary mb-1">
        Tính năng Thảo luận đang được phát triển
      </h3>
      <p className="text-[13px] text-text-secondary max-w-md mb-3">
        Tính năng thảo luận và đánh giá sản phẩm sẽ sớm ra mắt. Cảm ơn bạn đã quan tâm đến các sản phẩm handmade của Tiệm Len Nhà Kiều!
      </p>
      <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-primary-light text-secondary border border-primary/20">
        Coming Soon
      </span>
    </div>
  );
}
