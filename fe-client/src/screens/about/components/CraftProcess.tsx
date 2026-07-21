import React from "react";
import Image from "next/image";
import { CRAFT_STEPS } from "../constants";

export default function CraftProcess() {
  return (
    <section aria-label="Quy trình làm sản phẩm" className="py-6 md:py-8 border-b border-border">
      <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-col gap-6">
        <div className="flex flex-col text-left gap-1.5">
          <h2 className="text-[18px] md:text-[22px] font-bold text-text-primary uppercase tracking-wider border-l-4 border-primary pl-3">
            Quy Trình Tạo Nên Món Quà Len
          </h2>
          <p className="text-[13px] text-text-secondary max-w-xl">
            Từng bước tỉ mỉ biến những cuộn len mềm mịn thành những món quà đong đầy cảm xúc.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CRAFT_STEPS.map((item) => (
            <div
              key={item.step}
              className="border border-border rounded-lg bg-surface overflow-hidden flex flex-col hover:border-primary/40 transition-colors"
            >
              <div className="relative w-full aspect-[16/10] bg-background">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 360px"
                  className="object-cover"
                />
                <span className="absolute top-3 left-3 bg-secondary text-white font-bold text-[12px] px-2.5 py-0.5 rounded">
                  Bước {item.step}
                </span>
              </div>

              <div className="p-4 flex flex-col gap-2">
                <h3 className="text-[15px] font-bold text-text-primary">
                  {item.title}
                </h3>
                <p className="text-[13px] text-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
