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
  readTimeMinutes: number;
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
