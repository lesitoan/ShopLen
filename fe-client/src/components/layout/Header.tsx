"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkIsLoggedIn, deleteCookie } from "@/utils/cookieUtils";
import DesktopHeader from "./components/DesktopHeader";
import MobileHeader from "./components/MobileHeader";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Close all modals and re-check login on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = "";
    setIsLoggedIn(checkIsLoggedIn());
  }, [pathname]);

  const handleLogout = () => {
    deleteCookie("isLogin");
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false);
    router.push("/");
  };

  return (
    <div className="w-full flex flex-col sticky top-0 z-50 bg-surface">
      <header className="w-full relative">
        <DesktopHeader
          isLoggedIn={isLoggedIn}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          handleLogout={handleLogout}
        />

        <MobileHeader
          isLoggedIn={isLoggedIn}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          mobileMenuRef={mobileMenuRef}
          handleLogout={handleLogout}
        />
      </header>
    </div>
  );
}
