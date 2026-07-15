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

export const FOOTER_ABOUT_LINKS = [
  { name: "Giới thiệu", href: "/gioi-thieu" },
  { name: "Câu chuyện thương hiệu", href: "/cau-chuyen" },
  { name: "Chính sách chất lượng", href: "/chat-luong" },
  { name: "Tuyển dụng", href: "/tuyen-dung" },
  { name: "Liên hệ", href: "/lien-he" },
];

export const FOOTER_PRODUCT_LINKS = [
  { name: "Móc khóa len", href: "/san-pham?category=moc-khoa" },
  { name: "Gấu bông len", href: "/san-pham?category=thu-bong" },
  { name: "Đồ trang trí", href: "/san-pham?category=do-decor" },
  { name: "Phụ kiện len", href: "/san-pham?category=phu-kien" },
  { name: "Sản phẩm khác", href: "/san-pham?category=khac" },
  { name: "Quà tặng handmade", href: "/san-pham?category=qua-tang" },
];

export const FOOTER_SUPPORT_LINKS = [
  { name: "Hướng dẫn đặt hàng", href: "/ho-tro/dat-hang" },
  { name: "Chính sách thanh toán", href: "/ho-tro/thanh-toan" },
  { name: "Chính sách vận chuyển", href: "/ho-tro/van-chuyen" },
  { name: "Chính sách đổi trả", href: "/ho-tro/doi-tra" },
  { name: "Câu hỏi thường gặp (FAQ)", href: "/ho-tro/faq" },
  { name: "Hướng dẫn bảo quản", href: "/ho-tro/bao-quan" },
];

export const FOOTER_CONTACT_INFO = {
  address: "Đà Nẵng, Việt Nam",
  phone: "Đang cập nhật",
  email: "Đang cập nhật",
  hours: "08:00 - 22:00 (T2 - CN)",
};

export const SOCIAL_LINKS = {
  facebook: "https://facebook.com",
  instagram: "https://instagram.com",
  tiktok: "https://tiktok.com",
  youtube: "https://youtube.com",
  pinterest: "https://pinterest.com",
};

