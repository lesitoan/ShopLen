"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingCart,
  Moon,
  Sun,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import Button from "@/components/ui/Button";
import SearchModal from "@/components/modals/SearchModal";
import CartModal from "@/components/modals/CartModal";
import UserMenuModal from "@/components/modals/UserMenuModal";
import { NAV_ITEMS, INITIAL_RECENT_SEARCHES, KEYWORD_SUGGESTIONS } from "../constants";
import type { CustomerSession } from "@/types/auth.type";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateQuantity, removeFromCart, clearCart } from "@/store/slices/cartSlice";

interface DesktopHeaderProps {
  isLoggedIn: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogout: () => void;
  customer: CustomerSession | null;
}

export default function DesktopHeader({
  isLoggedIn,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  handleLogout,
  customer,
}: DesktopHeaderProps) {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const [mounted, setMounted] = useState(false);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>(INITIAL_RECENT_SEARCHES);
  const keywordSuggestions = KEYWORD_SUGGESTIONS;

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = mounted ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0;

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (!userMenuRef.current?.contains(target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      if (!recentSearches.includes(searchValue.trim())) {
        setRecentSearches((prev) => [searchValue.trim(), ...prev.slice(0, 4)]);
      }
      setIsSearchOpen(false);
      router.push(`/san-pham?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const handleRecentSearchClick = (searchVal: string) => {
    setSearchValue(searchVal);
    router.push(`/san-pham?search=${encodeURIComponent(searchVal)}`);
    setIsSearchOpen(false);
  };

  const removeRecentSearch = (index: number) => {
    setRecentSearches((prev) => prev.filter((_, idx) => idx !== index));
  };

  const clearRecentSearches = () => setRecentSearches([]);

  const handleRemoveItem = (id: number | string) => {
    dispatch(removeFromCart(id));
  };

  const handleQtyChange = (id: number | string, delta: number) => {
    dispatch(updateQuantity({ id, delta }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between transition-all duration-300">
      <Link href="/" className="flex items-center gap-3 group shrink-0">
        <div className="relative w-11 h-11 md:w-12 md:h-12 rounded-full overflow-hidden border border-primary/10 group-hover:border-primary transition-all duration-300">
          <Image
            src="/logo.png"
            alt="Tiệm Len Nhà Kiều"
            fill
            sizes="(max-width: 768px) 44px, 48px"
            priority
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="hidden lg:flex flex-col">
          <span className="text-[14px] font-bold text-secondary tracking-wide leading-tight">
            Tiệm Len
          </span>
          <span className="text-[14px] font-bold text-secondary tracking-wide leading-tight">
            Nhà Kiều
          </span>
        </div>
      </Link>

      <nav className="hidden md:flex items-center gap-1 lg:gap-3" ref={dropdownRef}>
        {NAV_ITEMS.map((item) => {
          if (item.children) {
            return (
              <div key={item.id} className="relative group">
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-3.5 py-2 text-[14px] font-medium transition-colors duration-200 rounded-md hover:bg-primary-light hover:text-secondary text-text-primary group-hover:bg-primary-light group-hover:text-secondary"
                >
                  {item.name}
                  <ChevronDown size={14} className="transition-transform duration-200 group-hover:rotate-180" />
                </button>
                <div className="absolute left-0 top-full pt-2 w-56 hidden group-hover:block z-50">
                  <div className="bg-surface border border-border rounded-md py-2 shadow-md animate-in fade-in slide-in-from-top-2 duration-200 text-left">
                    {item.children.map((child, idx) => (
                      <Link
                        key={idx}
                        href={child.href}
                        className="block px-4 py-2.5 text-[14px] text-text-primary hover:bg-primary-light hover:text-secondary transition-colors"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.href || "#"}
              className="px-3.5 py-2 text-[14px] font-medium text-text-primary hover:bg-primary-light hover:text-secondary transition-colors duration-200 rounded-md"
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-2 lg:gap-3">
        <div className="relative" ref={searchRef}>
          <Button
            variant="secondary"
            size="md"
            iconOnly
            onClick={() => {
              setIsSearchOpen((prev) => !prev);
              setIsCartOpen(false);
            }}
            className={`!rounded-full border border-border text-text-primary hover:bg-background hover:border-primary/40 relative z-20 ${
              isSearchOpen ? "bg-primary-light text-secondary border-primary/40" : ""
            }`}
            title="Tìm kiếm"
          >
            <Search size={18} />
          </Button>
          <SearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            triggerRef={searchRef}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            recentSearches={recentSearches}
            onSearchSubmit={handleSearchSubmit}
            onRecentSearchClick={handleRecentSearchClick}
            onRemoveRecentSearch={removeRecentSearch}
            onClearRecentSearches={clearRecentSearches}
            keywordSuggestions={keywordSuggestions}
          />
        </div>

        <div className="relative" ref={cartRef}>
          <Button
            variant="secondary"
            size="md"
            iconOnly
            onClick={() => {
              setIsCartOpen((prev) => !prev);
              setIsSearchOpen(false);
            }}
            className={`!rounded-full border border-border text-text-primary hover:bg-background hover:border-primary/40 relative z-20 ${
              isCartOpen ? "bg-primary-light text-secondary border-primary/40" : ""
            }`}
            title="Giỏ hàng"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-surface">
                {cartCount}
              </span>
            )}
          </Button>
          <CartModal
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            triggerRef={cartRef}
            cartItems={mounted ? cartItems : []}
            onQtyChange={handleQtyChange}
            onRemoveItem={handleRemoveItem}
            onClearAll={handleClearCart}
          />
        </div>

        <Button
          variant="secondary"
          size="md"
          iconOnly
          onClick={toggleDarkMode}
          className="!rounded-full border border-border text-text-primary hover:bg-background hover:border-primary/40"
          title="Giao diện"
        >
          {isDarkMode ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} />}
        </Button>

        {isLoggedIn ? (
          <div className="relative hidden md:block" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              className={`w-10 h-10 rounded-full border overflow-hidden transition-all flex items-center justify-center bg-surface shrink-0 outline-none focus:outline-none p-0 relative ${
                isUserMenuOpen
                  ? "border-primary/50 bg-primary-light/20"
                  : "border-border hover:border-primary/40"
              }`}
              title="Tài khoản cá nhân"
            >
              <Image
                src={customer?.avatar || "/logo.png"}
                alt={customer?.fullName || "Tài khoản cá nhân"}
                fill
                sizes="40px"
                className="object-cover"
              />
            </button>
            <UserMenuModal
              isOpen={isUserMenuOpen}
              onClose={() => setIsUserMenuOpen(false)}
              triggerRef={userMenuRef}
              onLogout={handleLogout}
              user={
                customer
                  ? {
                      fullName: customer.fullName,
                      email: customer.email,
                      avatar: customer.avatar || "/logo.png",
                    }
                  : undefined
              }
            />
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-2">
            <Link href="/dang-nhap">
              <Button
                variant="secondary"
                size="sm"
                className="rounded-md border-border/80 font-medium px-4 text-text-primary hover:text-secondary"
              >
                Đăng nhập
              </Button>
            </Link>
            <Link href="/dang-ky">
              <Button variant="primary" size="sm" className="rounded-md font-medium px-4">
                Đăng ký
              </Button>
            </Link>
          </div>
        )}

        <Button
          variant="secondary"
          size="md"
          iconOnly
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="md:hidden !rounded-full border border-border text-text-primary hover:bg-background"
          title="Menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>
    </div>
  );
}
