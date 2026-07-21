import type { BlogTag, BlogPost, FeaturedPost } from "@/types/blog.type";

export const POSTS_PER_PAGE = 5;
export const BANNER_AUTOPLAY_INTERVAL = 4000;

export const BLOG_TAGS: BlogTag[] = [
  { key: "tat-ca", label: "Tất cả" },
  { key: "huong-dan-moc", label: "Hướng dẫn móc" },
  { key: "y-tuong-qua-tang", label: "Ý tưởng quà tặng" },
  { key: "cham-soc-len", label: "Chăm sóc len" },
  { key: "cam-hung-sang-tao", label: "Cảm hứng sáng tạo" },
  { key: "meo-hay", label: "Mẹo hay" },
];

export const BLOG_TAG_LABELS: Record<string, string> = BLOG_TAGS.reduce(
  (acc, tag) => {
    if (tag.key !== "tat-ca") {
      acc[tag.key] = tag.label;
    }
    return acc;
  },
  {} as Record<string, string>
);

export const AD_BANNERS = [
  { id: 1, src: "/images/ads/ads-1.png", alt: "Quảng cáo Tiệm Len Nhà Kiều", href: "/san-pham" },
  { id: 2, src: "/images/ads/ads-2.png", alt: "Sản phẩm handmade móc len", href: "/san-pham" },
  { id: 3, src: "/images/ads/ads-3.png", alt: "Móc khóa len dễ thương", href: "/san-pham" },
];

export const FEATURED_POSTS: FeaturedPost[] = [
  {
    id: 1,
    slug: "cach-moc-gau-bong-tu-len-soi-chi-tiet",
    title: "Cách móc gấu bông từ len sợi chi tiết từ A đến Z cho người mới bắt đầu",
    excerpt: "Hướng dẫn đầy đủ từng bước móc gấu bông len với các mũi móc cơ bản, phù hợp cho người chưa có kinh nghiệm.",
    thumbnail: "/images/products/gau-bong-tho.png",
    tag: "huong-dan-moc",
    author: "Nhà Kiều",
    authorAvatar: "/logo.png",
    publishedAt: "20 tháng 7, 2025",
    readTime: "8 phút đọc",
    isMainHero: true,
  },
  {
    id: 2,
    slug: "qua-tang-handmade-y-nghia-cho-ban-than",
    title: "Quà tặng handmade ý nghĩa cho bạn thân dịp sinh nhật",
    excerpt: "Những ý tưởng quà tặng móc len độc đáo, tự tay làm mang theo tình cảm chân thành nhất.",
    thumbnail: "/images/products/binh-hoa-tulip.png",
    tag: "y-tuong-qua-tang",
    author: "Nhà Kiều",
    authorAvatar: "/logo.png",
    publishedAt: "18 tháng 7, 2025",
    readTime: "5 phút đọc",
    isMainHero: false,
  },
  {
    id: 3,
    slug: "meo-chon-len-soi-chat-luong-cho-nguoi-moi",
    title: "Mẹo chọn len sợi chất lượng cho người mới học móc len",
    excerpt: "Phân biệt các loại sợi len phổ biến và cách chọn sợi phù hợp với từng loại sản phẩm.",
    thumbnail: "/images/products/moc-khoa-meo.png",
    tag: "meo-hay",
    author: "Nhà Kiều",
    authorAvatar: "/logo.png",
    publishedAt: "15 tháng 7, 2025",
    readTime: "6 phút đọc",
    isMainHero: false,
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 4,
    slug: "huong-dan-moc-hoa-tulip-len-dep",
    title: "Hướng dẫn móc hoa tulip len đẹp như thật tặng người thân yêu",
    excerpt: "Móc hoa tulip không hề khó như bạn nghĩ. Với hướng dẫn chi tiết này, bạn sẽ có ngay bó hoa len xinh xắn.",
    thumbnail: "/images/products/hoa-tulip.png",
    tag: "huong-dan-moc",
    author: "Nhà Kiều",
    authorAvatar: "/logo.png",
    publishedAt: "14 tháng 7, 2025",
    readTime: "7 phút đọc",
  },
  {
    id: 5,
    slug: "moc-khoa-meo-mini-de-thuong",
    title: "Móc khóa mèo mini dễ thương — mẫu hot nhất TikTok tháng này",
    excerpt: "Mẫu móc khóa mèo mini đang cực kỳ hot trên TikTok với hàng triệu lượt xem. Cùng làm thử nhé!",
    thumbnail: "/images/products/moc-khoa-meo.png",
    tag: "cam-hung-sang-tao",
    author: "Nhà Kiều",
    authorAvatar: "/logo.png",
    publishedAt: "12 tháng 7, 2025",
    readTime: "5 phút đọc",
  },
  {
    id: 6,
    slug: "cach-giu-len-khong-bi-xo-sau-giat",
    title: "Cách giữ đồ len không bị xù sau khi giặt — bí quyết từ người có kinh nghiệm",
    excerpt: "Len dễ bị xù và mất hình nếu không được chăm sóc đúng cách. Bài viết này chia sẻ các mẹo bảo quản hiệu quả.",
    thumbnail: "/images/products/gau-bong-tho.png",
    tag: "cham-soc-len",
    author: "Nhà Kiều",
    authorAvatar: "/logo.png",
    publishedAt: "10 tháng 7, 2025",
    readTime: "4 phút đọc",
  },
  {
    id: 7,
    slug: "tui-hoa-cuc-moc-len-cho-he",
    title: "Túi hoa cúc móc len xinh xắn cho mùa hè — tự làm trong 2 ngày",
    excerpt: "Chiếc túi hoa cúc kết hợp màu sắc tươi sáng là món phụ kiện hoàn hảo cho mùa hè năng động.",
    thumbnail: "/images/products/tui-hoa-cuc.png",
    tag: "cam-hung-sang-tao",
    author: "Nhà Kiều",
    authorAvatar: "/logo.png",
    publishedAt: "8 tháng 7, 2025",
    readTime: "6 phút đọc",
  },
  {
    id: 8,
    slug: "qua-tang-moc-khoa-gau-cho-ban-trai",
    title: "Quà tặng độc đáo: Móc khóa gấu handmade khiến người nhận bất ngờ",
    excerpt: "Một món quà tự tay làm luôn mang ý nghĩa đặc biệt hơn bất kỳ thứ gì mua sẵn. Cùng xem cách làm nhé.",
    thumbnail: "/images/products/moc-khoa-gau.png",
    tag: "y-tuong-qua-tang",
    author: "Nhà Kiều",
    authorAvatar: "/logo.png",
    publishedAt: "5 tháng 7, 2025",
    readTime: "5 phút đọc",
  },
  {
    id: 9,
    slug: "len-cotton-hay-len-acrylic-nen-chon-loai-nao",
    title: "Len cotton hay len acrylic — nên chọn loại nào cho sản phẩm handmade?",
    excerpt: "So sánh chi tiết ưu nhược điểm của 2 loại sợi phổ biến nhất để bạn lựa chọn đúng cho từng dự án.",
    thumbnail: "/images/products/binh-hoa-tulip.png",
    tag: "meo-hay",
    author: "Nhà Kiều",
    authorAvatar: "/logo.png",
    publishedAt: "2 tháng 7, 2025",
    readTime: "6 phút đọc",
  },
  {
    id: 10,
    slug: "cam-hung-moc-len-tu-phim-hoat-hinh",
    title: "Cảm hứng móc len từ thế giới hoạt hình — những nhân vật siêu cute",
    excerpt: "Từ Totoro đến Pikachu, các nhân vật hoạt hình được tái hiện qua len sợi theo cách thú vị và đáng yêu.",
    thumbnail: "/images/products/gau-bong-tho.png",
    tag: "cam-hung-sang-tao",
    author: "Nhà Kiều",
    authorAvatar: "/logo.png",
    publishedAt: "28 tháng 6, 2025",
    readTime: "4 phút đọc",
  },
  {
    id: 11,
    slug: "huong-dan-moc-binh-hoa-don-gian",
    title: "Hướng dẫn móc bình hoa len đơn giản trang trí góc học tập",
    excerpt: "Bình hoa len nhỏ xinh là món trang trí bàn làm việc được giới trẻ yêu thích. Cùng làm trong 1 buổi tối!",
    thumbnail: "/images/products/hoa-tulip.png",
    tag: "huong-dan-moc",
    author: "Nhà Kiều",
    authorAvatar: "/logo.png",
    publishedAt: "25 tháng 6, 2025",
    readTime: "7 phút đọc",
  },
];
