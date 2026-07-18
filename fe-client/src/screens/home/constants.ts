export interface HeroSlide {
  id: number;
  titleLight: string;
  titleBold: string;
  description: string;
  image: string;
  primaryBtnText: string;
  primaryBtnLink: string;
  secondaryBtnText: string;
  secondaryBtnLink: string;
}

export interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  image: string;
}

export interface ProductItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: "new" | "bestSeller" | "hotTiktok" | "sale" | "limited" | "soldOut";
  badgeLabel?: string;
}

export interface BlogPostItem {
  id: number;
  tag: string;
  title: string;
  description: string;
  image: string;
  date: string;
  readTime: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    titleLight: "Len nhỏ xinh",
    titleBold: "Yêu thương to lớn",
    description: "Những món đồ len handmade được móc bằng tình yêu, dành tặng những người bạn thương.",
    image: "/images/hero/img-1.png",
    primaryBtnText: "Mua ngay",
    primaryBtnLink: "/san-pham",
    secondaryBtnText: "Xem bộ sưu tập",
    secondaryBtnLink: "/san-pham?sort=best_seller",
  },
  {
    id: 2,
    titleLight: "Móc khóa đôi",
    titleBold: "Gắn kết yêu thương",
    description: "Bộ sưu tập móc khóa cặp dễ thương, thích hợp làm quà tặng ý nghĩa cho người đặc biệt.",
    image: "/images/hero/img-2.png",
    primaryBtnText: "Mua ngay",
    primaryBtnLink: "/san-pham?category=moc-khoa-doi",
    secondaryBtnText: "Xem bộ sưu tập",
    secondaryBtnLink: "/san-pham",
  },
  {
    id: 3,
    titleLight: "Hoa len trang trí",
    titleBold: "Tươi màu theo năm tháng",
    description: "Những bó hoa len handmade rực rỡ sắc màu, bền bỉ cùng thời gian mà không bao giờ phai tàn.",
    image: "/images/hero/img-3.png",
    primaryBtnText: "Mua ngay",
    primaryBtnLink: "/san-pham?category=hoa-len",
    secondaryBtnText: "Xem bộ sưu tập",
    secondaryBtnLink: "/san-pham",
  },
];

export const CATEGORIES: CategoryItem[] = [
  {
    id: 1,
    name: "MÓC KHÓA ĐỘNG VẬT",
    slug: "moc-khoa-dong-vat",
    image: "/images/products/moc-khoa-gau.png",
  },
  {
    id: 2,
    name: "QUÀ SINH NHẬT",
    slug: "qua-sinh-nhat",
    image: "/images/products/binh-hoa-tulip.png",
  },
  {
    id: 3,
    name: "GẤU BÔNG LEN",
    slug: "gau-bong-len",
    image: "/images/products/gau-bong-tho.png",
  },
  {
    id: 4,
    name: "HOA LEN",
    slug: "hoa-len",
    image: "/images/products/hoa-tulip.png",
  },
  {
    id: 5,
    name: "TÚI LEN HANDMADE",
    slug: "tui-len-handmade",
    image: "/images/products/tui-hoa-cuc.png",
  },
  {
    id: 6,
    name: "QUÀ TẶNG THEO YÊU CẦU",
    slug: "qua-tang-theo-yeu-cau",
    image: "/images/products/moc-khoa-meo.png",
  },
];

export const BEST_SELLERS_PRODUCTS: ProductItem[] = [
  {
    id: 1,
    name: "Móc khóa Cún bông len handmade",
    price: 99000,
    originalPrice: 120000,
    rating: 5,
    reviews: 48,
    image: "/images/products/moc-khoa-gau.png",
    badge: "bestSeller",
    badgeLabel: "Bán chạy",
  },
  {
    id: 2,
    name: "Gấu bông len Teddy hồng pastel",
    price: 299000,
    originalPrice: 350000,
    rating: 5,
    reviews: 36,
    image: "/images/products/moc-khoa-meo.png",
    badge: "bestSeller",
    badgeLabel: "Bán chạy",
  },
  {
    id: 3,
    name: "Bó hoa Tulip len 3 bông",
    price: 199000,
    originalPrice: 250000,
    rating: 4.8,
    reviews: 52,
    image: "/images/products/hoa-tulip.png",
    badge: "bestSeller",
    badgeLabel: "Bán chạy",
  },
  {
    id: 4,
    name: "Thỏ bông len Tai dài Sweetie",
    price: 249000,
    originalPrice: 300000,
    rating: 5,
    reviews: 29,
    image: "/images/products/gau-bong-tho.png",
    badge: "bestSeller",
    badgeLabel: "Bán chạy",
  },
  {
    id: 5,
    name: "Chậu hoa Hướng Dương len handmade",
    price: 139000,
    originalPrice: 180000,
    rating: 4.9,
    reviews: 15,
    image: "/images/products/binh-hoa-tulip.png",
    badge: "bestSeller",
    badgeLabel: "Bán chạy",
  },
  {
    id: 6,
    name: "Túi len Hoa Cúc xinh xắn",
    price: 240000,
    originalPrice: 300000,
    rating: 5,
    reviews: 22,
    image: "/images/products/tui-hoa-cuc.png",
    badge: "bestSeller",
    badgeLabel: "Bán chạy",
  },
];

export const TODAY_OFFERS_PRODUCTS: ProductItem[] = [
  {
    id: 7,
    name: "Chó bông len Bông Mây",
    price: 199000,
    originalPrice: 250000,
    rating: 5,
    reviews: 18,
    image: "/images/products/moc-khoa-gau.png",
    badge: "sale",
    badgeLabel: "-20%",
  },
  {
    id: 8,
    name: "Chậu hoa Hướng Dương len",
    price: 153000,
    originalPrice: 180000,
    rating: 4.8,
    reviews: 12,
    image: "/images/products/binh-hoa-tulip.png",
    badge: "sale",
    badgeLabel: "-15%",
  },
  {
    id: 9,
    name: "Móc khóa Ếch xanh",
    price: 99000,
    originalPrice: 110000,
    rating: 5,
    reviews: 24,
    image: "/images/products/moc-khoa-meo.png",
    badge: "sale",
    badgeLabel: "-10%",
  },
  {
    id: 10,
    name: "Túi len Hoa Đào",
    price: 240000,
    originalPrice: 300000,
    rating: 5,
    reviews: 31,
    image: "/images/products/tui-hoa-cuc.png",
    badge: "sale",
    badgeLabel: "-20%",
  },
  {
    id: 11,
    name: "Móc khóa Thỏ hồng",
    price: 102000,
    originalPrice: 120000,
    rating: 4.9,
    reviews: 45,
    image: "/images/products/gau-bong-tho.png",
    badge: "sale",
    badgeLabel: "-15%",
  },
];

export const BLOG_POSTS: BlogPostItem[] = [
  {
    id: 1,
    tag: "HƯỚNG DẪN",
    title: "Hướng dẫn móc len cơ bản cho người mới bắt đầu",
    description: "Bắt đầu hành trình móc len thật dễ dàng với những mũi móc cơ bản nhất.",
    image: "/images/products/hoa-tulip.png",
    date: "20/05/2024",
    readTime: "5 phút đọc",
  },
  {
    id: 2,
    tag: "GỢI Ý QUÀ TẶNG",
    title: "7 món quà sinh nhật handmade ý nghĩa cho người thân",
    description: "Tuyển chọn những món quà len xinh xắn, độc đáo và đầy yêu thương.",
    image: "/images/products/binh-hoa-tulip.png",
    date: "18/05/2024",
    readTime: "4 phút đọc",
  },
  {
    id: 3,
    tag: "CẨM NANG",
    title: "Vì sao đồ handmade luôn mang giá trị đặc biệt?",
    description: "Khám phá câu chuyện đằng sau mỗi sản phẩm len handmade.",
    image: "/images/products/moc-khoa-gau.png",
    date: "15/05/2024",
    readTime: "3 phút đọc",
  },
  {
    id: 4,
    tag: "CHĂM SÓC SẢN PHẨM",
    title: "Cách bảo quản đồ len luôn bền đẹp",
    description: "Mẹo nhỏ giúp sản phẩm len của bạn luôn mềm mại và như mới.",
    image: "/images/products/tui-hoa-cuc.png",
    date: "12/05/2024",
    readTime: "4 phút đọc",
  },
];
