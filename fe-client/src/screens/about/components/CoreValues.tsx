import React from "react";
import { CORE_VALUES } from "../constants";

export default function CoreValues() {
  return (
    <section aria-label="Giá trị cốt lõi" className="py-6 md:py-8 border-b border-border bg-background">
      <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-col gap-6">
        <div className="flex flex-col text-left gap-1.5">
          <h2 className="text-[18px] md:text-[22px] font-bold text-text-primary uppercase tracking-wider border-l-4 border-primary pl-3">
            Tại Sao Chọn Tiệm Len Nhà Kiều?
          </h2>
          <p className="text-[13px] text-text-secondary max-w-xl">
            4 lời cam kết chất lượng hàng đầu làm nên uy tín của thương hiệu len móc thủ công.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {CORE_VALUES.map((item) => (
            <div
              key={item.id}
              className="border border-border border-l-4 border-l-primary rounded-lg bg-surface p-4 flex flex-col gap-1.5 hover:border-primary/50 transition-colors"
            >
              <h3 className="text-[14px] font-bold text-text-primary">
                {item.title}
              </h3>
              <p className="text-[12.5px] text-text-secondary leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
