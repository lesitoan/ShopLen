"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronRight, LogIn, UserPlus, LogOut } from "lucide-react";
import Button from "@/components/ui/Button";
import { NAV_ITEMS } from "../constants";
import type { CustomerSession } from "@/types/auth.type";

interface MobileHeaderProps {
  isLoggedIn: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (val: boolean) => void;
  mobileMenuRef: React.RefObject<HTMLDivElement | null>;
  handleLogout: () => void;
  customer: CustomerSession | null;
}

export default function MobileHeader({
  isLoggedIn,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  mobileMenuRef,
  handleLogout,
  customer,
}: MobileHeaderProps) {
  const [mounted, setMounted] = useState(false);
  const [renderMobileMenu, setRenderMobileMenu] = useState(false);
  const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let animFrame: number;
    let timer: NodeJS.Timeout;

    if (isMobileMenuOpen) {
      setRenderMobileMenu(true);
      animFrame = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsMobileMenuVisible(true);
        });
      });
    } else {
      setIsMobileMenuVisible(false);
      setActiveDropdown(null);
      timer = setTimeout(() => {
        setRenderMobileMenu(false);
      }, 350);
    }

    return () => {
      cancelAnimationFrame(animFrame);
      clearTimeout(timer);
    };
  }, [isMobileMenuOpen]);

  const toggleDropdown = (id: string) => {
    setActiveDropdown((prev) => (prev === id ? null : id));
  };

  return (
    <>
      {mounted && renderMobileMenu && typeof document !== "undefined" && createPortal(
        <div
          className={`fixed inset-0 top-[66px] bg-black/45 z-40 md:hidden touch-none pointer-events-auto select-none transition-opacity duration-350 ease-out ${
            isMobileMenuVisible ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
          onTouchMove={(e) => e.preventDefault()}
        />,
        document.body
      )}

      {renderMobileMenu && (
        <div
          ref={mobileMenuRef}
          className={`md:hidden bg-surface border-t border-border p-4 flex flex-col gap-4 z-50 absolute top-full left-0 right-0 shadow-2xl transition-all duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] transform ${
            isMobileMenuVisible
              ? "translate-y-0 opacity-100"
              : "-translate-y-6 opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex flex-col gap-1 text-left">
            <div className="border-b border-border/60 pb-2 mb-2">
              <p className="text-[12px] font-semibold text-text-secondary uppercase tracking-wider px-2">
                Danh mục
              </p>
            </div>

            {NAV_ITEMS.map((item) => {
              if (item.children) {
                const isOpen = activeDropdown === item.id;
                return (
                  <div key={item.id}>
                    <button
                      type="button"
                      onClick={() => toggleDropdown(item.id)}
                      className="w-full flex items-center justify-between px-2 py-2 text-[15px] font-medium text-text-primary hover:text-secondary rounded-md"
                    >
                      {item.name}
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {isOpen && (
                      <div className="ml-3 pl-3 border-l border-border/60 flex flex-col gap-1 mt-1 mb-2 animate-in fade-in duration-200">
                        {item.children.map((child, idx) => (
                          <Link
                            key={idx}
                            href={child.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="py-2 text-[14px] text-text-secondary hover:text-secondary block"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={item.href || "#"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-2 py-2 text-[15px] font-medium text-text-primary hover:text-secondary rounded-md block"
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {isLoggedIn ? (
            <div className="flex flex-col gap-2 pt-3 border-t border-border">
              <Link
                href="/tai-khoan"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 bg-background hover:bg-surface border border-border/80 rounded-xl transition-all"
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-primary/20 shrink-0 bg-surface">
                  <Image
                    src={customer?.avatar || "/logo.png"}
                    alt={customer?.fullName || "Tài khoản cá nhân"}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col min-w-0 text-left flex-1">
                  <span className="text-[13.5px] font-bold text-text-primary truncate">
                    {customer?.fullName || "Tài khoản cá nhân"}
                  </span>
                  <span className="text-[11.5px] text-text-secondary truncate">
                    {customer?.email || ""}
                  </span>
                </div>
                <ChevronRight size={16} className="text-text-secondary shrink-0" />
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold text-error hover:bg-error/10 border border-error/20 transition-all mt-1"
              >
                <LogOut size={16} />
                <span>Đăng xuất</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              <Link href="/dang-nhap" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                <Button variant="secondary" size="md" className="w-full rounded-md gap-2 text-text-primary justify-center">
                  <LogIn size={16} />
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/dang-ky" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                <Button variant="primary" size="md" className="w-full rounded-md gap-2 justify-center">
                  <UserPlus size={16} />
                  Đăng ký
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
}
