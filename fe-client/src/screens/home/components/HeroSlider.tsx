"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import type { Swiper as SwiperClass } from "swiper";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { HERO_SLIDES } from "../constants";
import Button from "@/components/ui/Button";

export default function HeroSlider() {
  const swiperRef = useRef<SwiperClass | null>(null);

  return (
    <section className="relative w-full max-w-6xl mx-auto px-4 md:px-6 mb-12">
      <div className="relative group overflow-hidden rounded-lg border border-border bg-primary-light">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            bulletClass: "inline-block w-2.5 h-2.5 rounded-full bg-primary/40 mx-1 cursor-pointer transition-all duration-200",
            bulletActiveClass: "!bg-primary !w-6",
            el: ".custom-swiper-pagination",
          }}
          loop={true}
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          className="h-[340px] md:h-[420px]"
        >
          {HERO_SLIDES.map((slide) => (
            <SwiperSlide key={slide.id} className="relative h-full w-full">
              <div className="absolute inset-0 w-full h-full z-0">
                <Image
                  src={slide.image}
                  alt={slide.titleBold}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover select-none pointer-events-none transition-transform duration-700 hover:scale-[1.02]"
                />
                
                <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-10" />
              </div>

              <div className="hidden md:grid grid-cols-12 h-full items-center md:p-12 relative w-full z-20">
                <div className="col-span-7 flex flex-col justify-center items-start text-left">
                  <div className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary uppercase tracking-wider mb-4">
                    <span>Handmade with love</span>
                    <Heart size={12} className="fill-primary text-primary" />
                  </div>
                  <h2 className="text-[32px] md:text-[36px] font-bold text-white leading-tight mb-4">
                    {slide.titleLight} <br />
                    <span className="text-primary">{slide.titleBold}</span>
                  </h2>
                  <p className="text-[14px] text-white/95 max-w-md mb-8 leading-relaxed font-medium">
                    {slide.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <Link href={slide.primaryBtnLink}>
                      <Button variant="primary" className="rounded-md px-6 py-2.5 font-semibold text-sm">
                        {slide.primaryBtnText}
                      </Button>
                    </Link>
                    <Link href={slide.secondaryBtnLink}>
                      <Button variant="secondary" className="rounded-md px-6 py-2.5 font-semibold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm">
                        {slide.secondaryBtnText}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-background active:bg-border transition-all duration-200"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-background active:bg-border transition-all duration-200"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        <div className="custom-swiper-pagination absolute bottom-4 left-0 right-0 z-20 flex justify-center items-center pointer-events-auto" />
      </div>
    </section>
  );
}
