export interface CartItem {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
}

export interface NavMenuItem {
  id: string;
  name: string;
  href?: string;
  children?: { name: string; href: string }[];
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

export const NAV_ITEMS: NavMenuItem[] = [
  {
    id: "products",
    name: "Sản phẩm",
    children: PRODUCT_CATEGORIES,
  },
  {
    id: "custom-order",
    name: "Đặt theo ảnh",
    href: "/dat-theo-anh",
  },
  {
    id: "blog",
    name: "Bài viết",
    href: "/bai-viet",
  },
  {
    id: "highlights",
    name: "Nổi bật",
    children: HIGHLIGHT_MENU,
  },
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

export const FOOTER_ABOUT_LINKS = [
  { name: "Giới thiệu thương hiệu", href: "/gioi-thieu" },
  { name: "Bài viết & Mẹo hay", href: "/bai-viet" },
  { name: "Liên hệ hỗ trợ", href: "/lien-he" },
];

export const FOOTER_PRODUCT_LINKS = [
  { name: "Móc khóa len", href: "/san-pham?category=moc-khoa" },
  { name: "Thú bông len", href: "/san-pham?category=thu-bong" },
  { name: "Hoa len", href: "/san-pham?category=hoa-len" },
  { name: "Phụ kiện len", href: "/san-pham?category=phu-kien" },
  { name: "Đặt theo ảnh yêu cầu", href: "/dat-theo-anh" },
];

export const FOOTER_SUPPORT_LINKS = [
  { name: "Chính sách bảo mật", href: "/chinh-sach-bao-mat" },
  { name: "Điều khoản sử dụng", href: "/dieu-khoan-su-dung" },
  { name: "Chính sách thanh toán", href: "/chinh-sach-thanh-toan" },
  { name: "Chính sách vận chuyển", href: "/chinh-sach-van-chuyen" },
  { name: "Chính sách đổi trả & hoàn tiền", href: "/chinh-sach-doi-tra" },
  { name: "Câu hỏi thường gặp (FAQ)", href: "/faq" },
];

export const FOOTER_CONTACT_INFO = {
  address: "Đà Nẵng, Việt Nam",
  phone: "0987.654.321",
  email: "hotro@tiemlennhakieu.com",
  hours: "08:00 - 21:00 (T2 - CN)",
};

export const SOCIAL_LINKS = {
  facebook: "https://facebook.com",
  instagram: "https://instagram.com",
  tiktok: "https://tiktok.com",
  youtube: "https://youtube.com",
  pinterest: "https://pinterest.com",
};
