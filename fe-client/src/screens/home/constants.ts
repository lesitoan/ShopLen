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
