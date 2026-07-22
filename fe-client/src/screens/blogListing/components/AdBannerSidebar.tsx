"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { AD_BANNERS, BANNER_AUTOPLAY_INTERVAL } from "../constants";

interface AdBannerSidebarProps {
  className?: string;
}

export default function AdBannerSidebar({
  className = "hidden md:block w-[270px] shrink-0 sticky top-[80px] self-start",
}: AdBannerSidebarProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % AD_BANNERS.length);
    }, BANNER_AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={className}>
      <div className="relative rounded-lg border border-border overflow-hidden bg-background">
        <div className="relative w-full">
          {AD_BANNERS.map((banner, idx) => (
            <Link
              key={banner.id}
              href={banner.href}
              className={`block w-full transition-opacity duration-500 ${
                idx === activeIndex
                  ? "opacity-100 relative"
                  : "opacity-0 absolute inset-0"
              }`}
              tabIndex={idx === activeIndex ? 0 : -1}
              aria-hidden={idx !== activeIndex}
            >
              <Image
                src={banner.src}
                alt={banner.alt}
                width={540}
                height={304}
                style={{ width: "100%", height: "auto" }}
                sizes="270px"
                className="block"
                priority={idx === 0}
              />
            </Link>
          ))}
        </div>

        <div className="absolute bottom-2.5 left-0 right-0 flex justify-center gap-1.5 z-10">
          {AD_BANNERS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Banner ${idx + 1}`}
              onClick={(e) => { e.preventDefault(); goTo(idx); }}
              className={`h-1.5 rounded-full transition-all duration-300 bg-white/80 ${
                idx === activeIndex ? "w-5 opacity-100" : "w-1.5 opacity-50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
