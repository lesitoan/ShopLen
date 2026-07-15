"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Search, 
  ShoppingCart, 
  Moon, 
  Sun, 
  ChevronDown, 
  Menu, 
  X, 
  LogIn, 
  UserPlus
} from "lucide-react";
import Button from "@/components/ui/Button";

import SearchModal from "@/components/modals/SearchModal";
import CartModal from "@/components/modals/CartModal";

import { 
  CartItem, 
  PRODUCT_CATEGORIES as productCategories, 
  HIGHLIGHT_MENU as highlightMenu, 
  INITIAL_RECENT_SEARCHES, 
  KEYWORD_SUGGESTIONS, 
  INITIAL_CART_ITEMS 
} from "./constants";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  
  const [recentSearches, setRecentSearches] = useState<string[]>(INITIAL_RECENT_SEARCHES);
  const keywordSuggestions = KEYWORD_SUGGESTIONS;
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART_ITEMS);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (name: string) => {
    if (activeDropdown === name) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(name);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      if (!recentSearches.includes(searchValue.trim())) {
        setRecentSearches(prev => [searchValue.trim(), ...prev.slice(0, 4)]);
      }
      setIsSearchOpen(false);
      window.location.href = `/san-pham?search=${encodeURIComponent(searchValue.trim())}`;
    }
  };

  const handleRecentSearchClick = (searchVal: string) => {
    setSearchValue(searchVal);
    window.location.href = `/san-pham?search=${encodeURIComponent(searchVal)}`;
    setIsSearchOpen(false);
  };

  const removeRecentSearch = (index: number) => {
    setRecentSearches(prev => prev.filter((_, idx) => idx !== index));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleQtyChange = (id: number, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="w-full flex flex-col bg-background">
      <header className="w-full bg-surface/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between transition-all duration-300">
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
              <span className="text-[15px] font-bold text-secondary tracking-wide leading-tight">
                Tiệm Len
              </span>
              <span className="text-[12px] font-medium text-text-secondary leading-none">
                Nhà Kiều
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 lg:gap-3" ref={dropdownRef}>
            <div className="relative">
              <button 
                onClick={() => toggleDropdown("products")}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-[14px] font-medium transition-colors duration-200 rounded-md hover:bg-primary-light hover:text-secondary ${
                  activeDropdown === "products" ? "bg-primary-light text-secondary" : "text-text-primary"
                }`}
              >
                Sản phẩm
                <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === "products" ? "rotate-180" : ""}`} />
              </button>

              {activeDropdown === "products" && (
                <div className="absolute left-0 mt-2 w-56 bg-surface border border-border rounded-md py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  {productCategories.map((cat, idx) => (
                    <Link 
                      key={idx} 
                      href={cat.href}
                      className="block px-4 py-2.5 text-[14px] text-text-primary hover:bg-primary-light hover:text-secondary transition-colors"
                      onClick={() => setActiveDropdown(null)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link 
              href="/dat-theo-anh" 
              className="px-3.5 py-2 text-[14px] font-medium text-text-primary hover:bg-primary-light hover:text-secondary transition-colors duration-200 rounded-md"
            >
              Đặt theo ảnh
            </Link>

            <Link 
              href="/blog" 
              className="px-3.5 py-2 text-[14px] font-medium text-text-primary hover:bg-primary-light hover:text-secondary transition-colors duration-200 rounded-md"
            >
              Bài viết
            </Link>

            <div className="relative">
              <button 
                onClick={() => toggleDropdown("highlights")}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-[14px] font-medium transition-colors duration-200 rounded-md hover:bg-primary-light hover:text-secondary ${
                  activeDropdown === "highlights" ? "bg-primary-light text-secondary" : "text-text-primary"
                }`}
              >
                Nổi bật
                <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === "highlights" ? "rotate-180" : ""}`} />
              </button>

              {activeDropdown === "highlights" && (
                <div className="absolute left-0 mt-2 w-52 bg-surface border border-border rounded-md py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  {highlightMenu.map((item, idx) => (
                    <Link 
                      key={idx} 
                      href={item.href}
                      className="block px-4 py-2.5 text-[14px] text-text-primary hover:bg-primary-light hover:text-secondary transition-colors"
                      onClick={() => setActiveDropdown(null)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-2 lg:gap-3">
            <div className="relative" ref={searchRef}>
              <Button
                variant="secondary"
                size="md"
                iconOnly
                onClick={() => {
                  setIsSearchOpen(!isSearchOpen);
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
                  setIsCartOpen(!isCartOpen);
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
                cartItems={cartItems}
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

            <div className="hidden md:flex items-center gap-2">
              <Link href="/dang-nhap">
                <Button variant="secondary" size="sm" className="rounded-md border-border/80 font-medium px-4 text-text-primary hover:text-secondary">
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/dang-ky">
                <Button variant="primary" size="sm" className="rounded-md font-medium px-4">
                  Đăng ký
                </Button>
              </Link>
            </div>

            <Button
              variant="secondary"
              size="md"
              iconOnly
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden !rounded-full border border-border text-text-primary hover:bg-background"
              title="Menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>

          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-surface border-t border-border p-4 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-300 z-40">
            <div className="flex flex-col gap-1 text-left">
              <div className="border-b border-border/60 pb-2 mb-2">
                <p className="text-[12px] font-semibold text-text-secondary uppercase tracking-wider px-2">
                  Danh mục
                </p>
              </div>

              <div>
                <button
                  onClick={() => toggleDropdown("mobile-products")}
                  className="w-full flex items-center justify-between px-2 py-2 text-[15px] font-medium text-text-primary hover:text-secondary rounded-md"
                >
                  Sản phẩm
                  <ChevronDown size={16} className={`transition-transform duration-200 ${activeDropdown === "mobile-products" ? "rotate-180" : ""}`} />
                </button>
                
                {activeDropdown === "mobile-products" && (
                  <div className="ml-3 pl-3 border-l border-border/60 flex flex-col gap-1 mt-1 mb-2 animate-in fade-in duration-200">
                    {productCategories.map((cat, idx) => (
                      <Link
                        key={idx}
                        href={cat.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="py-2 text-[14px] text-text-secondary hover:text-secondary block"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link 
                href="/dat-theo-anh" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-2 py-2 text-[15px] font-medium text-text-primary hover:text-secondary rounded-md block"
              >
                Đặt theo ảnh
              </Link>

              <Link 
                href="/blog" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-2 py-2 text-[15px] font-medium text-text-primary hover:text-secondary rounded-md block"
              >
                Bài viết
              </Link>

              <div>
                <button
                  onClick={() => toggleDropdown("mobile-highlights")}
                  className="w-full flex items-center justify-between px-2 py-2 text-[15px] font-medium text-text-primary hover:text-secondary rounded-md"
                >
                  Nổi bật
                  <ChevronDown size={16} className={`transition-transform duration-200 ${activeDropdown === "mobile-highlights" ? "rotate-180" : ""}`} />
                </button>

                {activeDropdown === "mobile-highlights" && (
                  <div className="ml-3 pl-3 border-l border-border/60 flex flex-col gap-1 mt-1 mb-2 animate-in fade-in duration-200">
                    {highlightMenu.map((item, idx) => (
                      <Link
                        key={idx}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="py-2 text-[14px] text-text-secondary hover:text-secondary block"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

            </div>

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

          </div>
        )}

      </header>

    </div>
  );
}
