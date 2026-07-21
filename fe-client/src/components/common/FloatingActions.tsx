"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowUp } from "lucide-react";

export default function FloatingActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed right-4 bottom-6 z-40 flex flex-col items-center gap-1.5">
      {/* Zalo */}
      <a
        href="https://zalo.me/0987654321"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Liên hệ Zalo"
        className="group relative w-12 h-12 rounded-full bg-white shadow-lg overflow-hidden hover:scale-110 active:scale-95 transition-transform duration-200"
        title="Chat Zalo"
      >
        <Image
          src="/images/social-icons/icon-zalo.png"
          alt="Zalo"
          fill
          sizes="48px"
          className="object-contain drop-shadow-md"
        />
        <span className="absolute right-full mr-2.5 top-1/2 -translate-y-1/2 whitespace-nowrap bg-text-primary text-background text-[11px] font-semibold px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-md">
          Chat Zalo
        </span>
      </a>

      {/* Messenger */}
      <a
        href="https://m.me/tiemlenNhaKieu"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Liên hệ Messenger"
        className="group relative w-12 h-12 rounded-full bg-white shadow-lg overflow-hidden hover:scale-110 active:scale-95 transition-transform duration-200"
        title="Chat Messenger"
      >
        <Image
          src="/images/social-icons/icon-messenger.png"
          alt="Messenger"
          fill
          sizes="48px"
          className="object-contain drop-shadow-md"
        />
        <span className="absolute right-full mr-2.5 top-1/2 -translate-y-1/2 whitespace-nowrap bg-text-primary text-background text-[11px] font-semibold px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-md">
          Chat Messenger
        </span>
      </a>

      {/* Scroll to top */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Lên đầu trang"
        title="Lên đầu trang"
        className={`group relative w-11 h-11 rounded-full bg-primary hover:bg-primary-hover active:bg-primary-active text-white shadow-lg flex items-center justify-center transition-all duration-300 ${
          showScrollTop
            ? "opacity-100 translate-y-0 pointer-events-auto scale-100"
            : "opacity-0 translate-y-4 pointer-events-none scale-90"
        }`}
      >
        <ArrowUp size={20} strokeWidth={2.5} />
        <span className="absolute right-full mr-2.5 top-1/2 -translate-y-1/2 whitespace-nowrap bg-text-primary text-background text-[11px] font-semibold px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-md">
          Lên đầu trang
        </span>
      </button>
    </div>
  );
}
