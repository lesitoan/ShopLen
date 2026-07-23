"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export interface SwiperImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
}

export function SwiperImageModal({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
}: SwiperImageModalProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  if (!isOpen || images.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/90 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Header Bar */}
      <div className="absolute top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-2 text-white">
          <Maximize2 className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold tracking-wide">
            Hình ảnh sản phẩm ({activeIndex + 1} / {images.length})
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          title="Đóng xem ảnh (Esc)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Swiper Lightbox Container */}
      <div className="relative z-40 w-full max-w-4xl h-[75vh] px-4">
        <Swiper
          initialSlide={initialIndex}
          modules={[Navigation, Pagination, Keyboard]}
          navigation={{
            prevEl: ".swiper-button-prev-custom",
            nextEl: ".swiper-button-next-custom",
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          keyboard={{ enabled: true }}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          className="w-full h-full rounded-2xl overflow-hidden shadow-2xl"
        >
          {images.map((url, idx) => (
            <SwiperSlide
              key={`${url.slice(0, 30)}-${idx}`}
              className="flex items-center justify-center bg-black/40 relative"
            >
              <div className="relative w-full h-full flex items-center justify-center p-4">
                <Image
                  src={url}
                  alt={`Product Image ${idx + 1}`}
                  fill
                  unoptimized
                  className="object-contain max-h-full"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              className="swiper-button-prev-custom absolute left-2 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-surface/80 hover:bg-primary text-text-primary hover:text-bg-deep border border-border shadow-xl transition-all"
              title="Ảnh trước"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              className="swiper-button-next-custom absolute right-2 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-surface/80 hover:bg-primary text-text-primary hover:text-bg-deep border border-border shadow-xl transition-all"
              title="Ảnh tiếp"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
