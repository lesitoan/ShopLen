"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, LogOut } from "lucide-react";
import MobileBottomSheet from "@/components/ui/MobileBottomSheet";

interface UserMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLDivElement | null>;
  onLogout: () => void;
  user?: {
    fullName: string;
    email: string;
    avatar: string;
  };
}

export default function UserMenuModal({
  isOpen,
  onClose,
  triggerRef,
  onLogout,
  user = {
    fullName: "Nguyễn Thị Ngọc Kiều",
    email: "demo@gmail.com",
    avatar: "/logo.png",
  },
}: UserMenuModalProps) {
  const desktopModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!isOpen) return;
      const target = event.target as HTMLElement;

      if (
        window.innerWidth < 768 ||
        target?.closest?.('[data-mobile-bottom-sheet]')
      ) {
        return;
      }

      if (
        desktopModalRef.current &&
        !desktopModalRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <>
      {/* DESKTOP POPOVER MENU */}
      <div
        ref={desktopModalRef}
        className="hidden md:block absolute right-0 top-full mt-3.5 w-56 bg-surface border border-border border-t-4 border-t-primary rounded-xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-left"
      >
        <div className="absolute -top-[7px] right-[14px] w-3 h-3 bg-primary rotate-45 z-10" />

        <div className="px-3 py-2 border-b border-border/60 mb-1 flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-primary/20 shrink-0 bg-background">
            <Image
              src={user.avatar}
              alt={user.fullName}
              fill
              sizes="32px"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col min-w-0 text-left">
            <span className="text-[13px] font-bold text-text-primary truncate">
              {user.fullName}
            </span>
            <span className="text-[11px] text-text-secondary truncate">
              {user.email}
            </span>
          </div>
        </div>

        <Link
          href="/tai-khoan"
          onClick={onClose}
          className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-semibold text-text-primary hover:bg-primary-light hover:text-secondary rounded-lg transition-colors text-left"
        >
          <User size={16} className="text-secondary" />
          <span>Tài khoản cá nhân</span>
        </Link>

        <button
          type="button"
          onClick={() => {
            onClose();
            onLogout();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-semibold text-error hover:bg-error/10 rounded-lg transition-colors text-left"
        >
          <LogOut size={16} />
          <span>Đăng xuất</span>
        </button>
      </div>

      {/* MOBILE BOTTOM SHEET */}
      <MobileBottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title="Tài khoản"
        headerPaddingClass="px-4"
        paddingClass="py-2 pb-6"
      >
        <div className="px-4 flex flex-col gap-3 text-left">
          <div className="px-3 py-2 border-b border-border/60 mb-1 flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-primary/20 shrink-0 bg-background">
              <Image
                src={user.avatar}
                alt={user.fullName}
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0 text-left">
              <span className="text-[14px] font-bold text-text-primary truncate">
                {user.fullName}
              </span>
              <span className="text-[12px] text-text-secondary truncate">
                {user.email}
              </span>
            </div>
          </div>

          <Link
            href="/tai-khoan"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-3 text-[14px] font-semibold text-text-primary hover:bg-primary-light hover:text-secondary rounded-xl transition-colors text-left"
          >
            <User size={18} className="text-secondary" />
            <span>Tài khoản cá nhân</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="w-full flex items-center gap-3 px-3 py-3 text-[14px] font-semibold text-error hover:bg-error/10 rounded-xl transition-colors text-left"
          >
            <LogOut size={18} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </MobileBottomSheet>
    </>
  );
}
