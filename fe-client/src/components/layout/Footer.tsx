"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutGrid,
  ShoppingBag,
  Headphones,
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronDown,
  Send
} from "lucide-react";
import Button from "@/components/ui/Button";

import {
  FOOTER_ABOUT_LINKS,
  FOOTER_PRODUCT_LINKS,
  FOOTER_SUPPORT_LINKS,
  FOOTER_CONTACT_INFO,
  SOCIAL_LINKS
} from "./constants";

export default function Footer() {
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  const toggleAccordion = (section: string) => {
    if (activeAccordion === section) {
      setActiveAccordion(null);
    } else {
      setActiveAccordion(section);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Đăng ký nhận bản tin thành công!");
  };

  const socialLinksData = [
    {
      name: "Facebook",
      href: SOCIAL_LINKS.facebook,
      svg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    {
      name: "Instagram",
      href: SOCIAL_LINKS.instagram,
      svg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
        </svg>
      )
    },
    {
      name: "TikTok",
      href: SOCIAL_LINKS.tiktok,
      svg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.99-1.72-.08-.07-.17-.17-.25-.26V14c0 3.42-1.72 6.67-4.9 7.86-3.89 1.5-8.62-.78-9.4-4.88-.85-4.11 1.83-8.8 6.01-9.45.67-.1 1.34-.11 2.01-.06V11.5c-1.89-.09-3.79.84-4.52 2.58-.91 2.03-.02 4.79 1.94 5.72 2.01.99 4.8-.19 5.27-2.42.06-.31.08-.63.08-.95V0c-.14.02-.27.02-.41.02z"/>
        </svg>
      )
    },
    {
      name: "YouTube",
      href: SOCIAL_LINKS.youtube,
      svg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    },
    {
      name: "Pinterest",
      href: SOCIAL_LINKS.pinterest,
      svg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.965 1.406-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.204 0 1.031.397 2.138.893 2.738.1.12.115.229.085.352-.094.393-.306 1.246-.347 1.417-.056.23-.183.279-.424.167-1.587-.738-2.582-3.057-2.582-4.919 0-4.004 2.91-7.682 8.39-7.682 4.404 0 7.826 3.138 7.826 7.335 0 4.377-2.759 7.902-6.59 7.902-1.287 0-2.497-.669-2.911-1.459 0 0-.637 2.426-.793 3.027-.287 1.103-1.062 2.485-1.581 3.327 1.126.347 2.316.535 3.551.535 6.621 0 11.988-5.367 11.988-11.987C24.005 5.368 18.638 0 12.017 0z"/>
        </svg>
      )
    }
  ];

  return (
    <footer className="w-full bg-[#FCF8F9] border-t border-primary/10 pt-10 pb-6 text-text-primary">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 pb-10 border-b border-border/60">

          <div className="lg:col-span-1 flex flex-col items-center md:items-start text-center md:text-left gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-primary/10">
                <Image
                  src="/logo.png"
                  alt="Tiệm Len Nhà Kiều"
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[15px] font-bold text-secondary tracking-wide leading-tight">
                  Tiệm Len
                </span>
                <span className="text-[12px] font-medium text-text-secondary leading-none">
                  Nhà Kiều
                </span>
              </div>
            </Link>
            <p className="text-[13px] text-text-secondary leading-relaxed">
              Tiệm Len Nhà Kiều chuyên móc len handmade đáng yêu, nhận đặt theo yêu cầu. Mỗi sản phẩm đều được làm bằng cả trái tim.
            </p>
            <div className="flex items-center gap-2 mt-2">
              {socialLinksData.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300"
                  aria-label={social.name}
                >
                  {social.svg}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <button
              onClick={() => toggleAccordion("about")}
              className="w-full flex md:hidden items-center justify-between py-3 border-b border-border/40 text-left font-bold"
            >
              <div className="flex items-center gap-3 text-text-primary">
                <LayoutGrid size={18} className="text-primary shrink-0" />
                <span className="text-[13px] tracking-wide">VỀ CHÚNG TÔI</span>
              </div>
              <ChevronDown size={16} className={`text-text-secondary transition-transform duration-200 ${activeAccordion === "about" ? "rotate-180" : ""}`} />
            </button>
            <h3 className="hidden md:block text-[13px] font-bold text-text-primary uppercase tracking-wider mb-4">
              Về chúng tôi
            </h3>
            <div className={`md:block ${activeAccordion === "about" ? "block animate-in fade-in duration-200" : "hidden"} pt-3 pb-2 md:py-0`}>
              <ul className="flex flex-col gap-2.5 text-left">
                {FOOTER_ABOUT_LINKS.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      className="text-[13.5px] text-text-secondary hover:text-secondary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col">
            <button
              onClick={() => toggleAccordion("products")}
              className="w-full flex md:hidden items-center justify-between py-3 border-b border-border/40 text-left font-bold"
            >
              <div className="flex items-center gap-3 text-text-primary">
                <ShoppingBag size={18} className="text-primary shrink-0" />
                <span className="text-[13px] tracking-wide">SẢN PHẨM</span>
              </div>
              <ChevronDown size={16} className={`text-text-secondary transition-transform duration-200 ${activeAccordion === "products" ? "rotate-180" : ""}`} />
            </button>
            <h3 className="hidden md:block text-[13px] font-bold text-text-primary uppercase tracking-wider mb-4">
              Sản phẩm
            </h3>
            <div className={`md:block ${activeAccordion === "products" ? "block animate-in fade-in duration-200" : "hidden"} pt-3 pb-2 md:py-0`}>
              <ul className="flex flex-col gap-2.5 text-left">
                {FOOTER_PRODUCT_LINKS.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      className="text-[13.5px] text-text-secondary hover:text-secondary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col">
            <button
              onClick={() => toggleAccordion("support")}
              className="w-full flex md:hidden items-center justify-between py-3 border-b border-border/40 text-left font-bold"
            >
              <div className="flex items-center gap-3 text-text-primary">
                <Headphones size={18} className="text-primary shrink-0" />
                <span className="text-[13px] tracking-wide">HỖ TRỢ KHÁCH HÀNG</span>
              </div>
              <ChevronDown size={16} className={`text-text-secondary transition-transform duration-200 ${activeAccordion === "support" ? "rotate-180" : ""}`} />
            </button>
            <h3 className="hidden md:block text-[13px] font-bold text-text-primary uppercase tracking-wider mb-4">
              Hỗ trợ khách hàng
            </h3>
            <div className={`md:block ${activeAccordion === "support" ? "block animate-in fade-in duration-200" : "hidden"} pt-3 pb-2 md:py-0`}>
              <ul className="flex flex-col gap-2.5 text-left">
                {FOOTER_SUPPORT_LINKS.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      className="text-[13.5px] text-text-secondary hover:text-secondary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col">
            <button
              onClick={() => toggleAccordion("contact")}
              className="w-full flex md:hidden items-center justify-between py-3 border-b border-border/40 text-left font-bold"
            >
              <div className="flex items-center gap-3 text-text-primary">
                <MapPin size={18} className="text-primary shrink-0" />
                <span className="text-[13px] tracking-wide">THÔNG TIN LIÊN HỆ</span>
              </div>
              <ChevronDown size={16} className={`text-text-secondary transition-transform duration-200 ${activeAccordion === "contact" ? "rotate-180" : ""}`} />
            </button>
            <h3 className="hidden md:block text-[13px] font-bold text-text-primary uppercase tracking-wider mb-4">
              Thông tin liên hệ
            </h3>
            <div className={`md:block ${activeAccordion === "contact" ? "block animate-in fade-in duration-200" : "hidden"} pt-3 pb-2 md:py-0`}>
              <ul className="flex flex-col gap-3.5 text-left">
                <li className="flex items-start gap-2.5 text-[13.5px] text-text-secondary">
                  <MapPin size={16} className="text-secondary mt-0.5 shrink-0" />
                  <span>{FOOTER_CONTACT_INFO.address}</span>
                </li>
                <li className="flex items-center gap-2.5 text-[13.5px] text-text-secondary">
                  <Phone size={16} className="text-secondary shrink-0" />
                  <a href={`tel:${FOOTER_CONTACT_INFO.phone.replace(/\s+/g, "")}`} className="hover:text-secondary transition-colors">
                    {FOOTER_CONTACT_INFO.phone}
                  </a>
                </li>
                <li className="flex items-center gap-2.5 text-[13.5px] text-text-secondary">
                  <Mail size={16} className="text-secondary shrink-0" />
                  <a href={`mailto:${FOOTER_CONTACT_INFO.email}`} className="hover:text-secondary transition-colors truncate">
                    {FOOTER_CONTACT_INFO.email}
                  </a>
                </li>
                <li className="flex items-start gap-2.5 text-[13.5px] text-text-secondary">
                  <Clock size={16} className="text-secondary mt-0.5 shrink-0" />
                  <span>{FOOTER_CONTACT_INFO.hours}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-1 flex flex-col gap-4 text-left">
            <h3 className="hidden md:block text-[13px] font-bold text-text-primary uppercase tracking-wider">
              Đăng ký nhận tin
            </h3>
            <div className="bg-primary/[0.03] border border-primary/10 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-primary font-bold text-[13px]">
                <Mail size={16} className="shrink-0" />
                <span>ĐĂNG KÝ NHẬN TIN</span>
              </div>
              <p className="text-[12px] text-text-secondary leading-relaxed">
                Nhận thông tin sản phẩm mới, ưu đãi và mẹo móc len hữu ích từ Nhà Kiều
              </p>
              <form onSubmit={handleSubscribe} className="flex items-stretch border border-border/80 rounded-md overflow-hidden bg-white mt-1">
                <input
                  type="email"
                  placeholder="Nhập email của bạn..."
                  className="flex-1 px-3 py-2 bg-transparent text-[13px] text-text-primary outline-none placeholder:text-text-secondary/40 min-w-0"
                  required
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-hover active:bg-primary-active text-white px-3 flex items-center justify-center shrink-0 transition-colors"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          </div>

        </div>

        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start gap-3">
            <span className="text-[12px] font-semibold text-text-secondary uppercase select-none">
              Phương thức thanh toán
            </span>
            <div className="flex items-center gap-2.5 select-none">
              <div className="bg-white border border-border/60 rounded-md px-3 py-1.5 h-8 flex items-center justify-center shrink-0">
                <div className="bg-[#A50064] text-white px-1.5 py-0.5 rounded text-[8px] font-bold tracking-tighter uppercase leading-none">momo</div>
              </div>
              <div className="bg-white border border-border/60 rounded-md px-3 py-1.5 h-8 flex items-center justify-center shrink-0">
                <div className="text-[#008FE5] font-bold text-[10px] tracking-tight leading-none">Zalo<span className="text-[#00A859]">Pay</span></div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2 text-center md:text-right">
            <div className="flex items-center flex-wrap justify-center gap-x-3 gap-y-1.5 text-[12.5px] text-text-secondary font-medium">
              <Link href="/bao-mat" className="hover:text-secondary transition-colors">Chính sách bảo mật</Link>
              <span className="text-border/80 hidden sm:inline">•</span>
              <Link href="/dieu-khoan" className="hover:text-secondary transition-colors">Điều khoản sử dụng</Link>
              <span className="text-border/80 hidden sm:inline">•</span>
              <Link href="/sitemap" className="hover:text-secondary transition-colors">Sitemap</Link>
            </div>
            <p className="text-[12px] text-text-secondary/60 mt-1">
              &copy; 2024 Tiệm Len Nhà Kiều. All rights reserved.
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}
