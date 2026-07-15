export interface CartItem {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
}

export const PRODUCT_CATEGORIES = [
  { name: "Móc khóa len", href: "/san-pham?category=moc-khoa" },
  { name: "Thú bông len", href: "/san-pham?category=thu-bong" },
  { name: "Hoa len", href: "/san-pham?category=hoa-len" },
  { name: "Phụ kiện len", href: "/san-pham?category=phu-kien" },
  { name: "Đồ decor trang trí", href: "/san-pham?category=do-decor" },
];

export const HIGHLIGHT_MENU = [
  { name: "Khuyến mãi", href: "/san-pham?sort=promo" },
  { name: "Hàng mới về", href: "/san-pham?sort=newest" },
  { name: "Sản phẩm bán chạy", href: "/san-pham?sort=best-seller" },
];

export const INITIAL_RECENT_SEARCHES = [
  "gấu len",
  "túi len",
  "mũ len",
  "khăn choàng",
];

export const KEYWORD_SUGGESTIONS = [
  "gấu bông",
  "túi len",
  "mũ len",
  "khăn choàng",
  "giỏ len",
  "móc khóa",
  "len sợi",
  "combo len",
];

export const INITIAL_CART_ITEMS: CartItem[] = [
  {
    id: 1,
    name: "Gấu len Momo",
    category: "Nâu nhạt",
    price: 319000,
    quantity: 1,
    image: "/images/products/moc-khoa-gau.png",
  },
  {
    id: 2,
    name: "Túi len hoa cúc",
    category: "Kem",
    price: 269000,
    quantity: 1,
    image: "/images/products/tui-hoa-cuc.png",
  },
];
