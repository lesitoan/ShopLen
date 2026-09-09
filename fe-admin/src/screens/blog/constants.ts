import type {
  BlogPostStatus,
  BlogSortOption,
  BlogPostListItem,
  BlogPostTag,
} from "@/types/blog.type";

export interface BlogFilterState {
  search: string;
  tagId: string;
  status: BlogPostStatus | "";
  sort: BlogSortOption;
  page: number;
  limit: number;
}

export const DEFAULT_BLOG_FILTERS: BlogFilterState = {
  search: "",
  tagId: "",
  status: "",
  sort: "NEWEST",
  page: 1,
  limit: 10,
};

export const BLOG_STATUS_MAP: Record<
  BlogPostStatus,
  {
    label: string;
    variant: "success" | "warning" | "neutral";
    description: string;
  }
> = {
  PUBLISHED: {
    label: "Đã xuất bản",
    variant: "success",
    description: "Khách hàng có thể đọc và tìm kiếm trên Google",
  },
  DRAFT: {
    label: "Bản nháp",
    variant: "warning",
    description: "Đang biên tập, chưa công khai ngoài cửa hàng",
  },
  HIDDEN: {
    label: "Lưu trữ / Ẩn",
    variant: "neutral",
    description: "Đã ẩn khỏi trang chủ và chuyên mục bài viết",
  },
};

export const BLOG_SORT_OPTIONS: { label: string; value: BlogSortOption }[] = [
  { label: "Mới nhất", value: "NEWEST" },
  { label: "Cũ nhất", value: "OLDEST" },
  { label: "Lượt xem cao nhất", value: "VIEWS_DESC" },
  { label: "Tiêu đề A - Z", value: "TITLE_ASC" },
];

export const PRESET_BLOG_TAGS: BlogPostTag[] = [
  {
    id: "tag-1",
    name: "Mẹo đan móc len",
    slug: "meo-dan-moc-len",
    displayOrder: 1,
    status: "ACTIVE",
  },
  {
    id: "tag-2",
    name: "Hướng dẫn làm móc khóa",
    slug: "huong-dan-lam-moc-khoa",
    displayOrder: 2,
    status: "ACTIVE",
  },
  {
    id: "tag-3",
    name: "Ý tưởng quà tặng handmade",
    slug: "y-tuong-qua-tang-handmade",
    displayOrder: 3,
    status: "ACTIVE",
  },
  {
    id: "tag-4",
    name: "Bảo quản & giặt đồ len",
    slug: "bao-quan-giat-do-len",
    displayOrder: 4,
    status: "ACTIVE",
  },
  {
    id: "tag-5",
    name: "Hot trend TikTok",
    slug: "hot-trend-tiktok",
    displayOrder: 5,
    status: "ACTIVE",
  },
];

export const MOCK_BLOG_POSTS: BlogPostListItem[] = [
  {
    id: "post-1",
    code: "BP-001",
    slug: "top-5-mau-moc-khoa-len-hoa-tulip-duoc-yeu-thich-nhat",
    title: "Top 5 mẫu móc khóa len hoa tulip xinh xắn được yêu thích nhất 2026",
    excerpt:
      "Tổng hợp các mẫu móc khóa hoa tulip đan tay bằng len cotton milk mềm mịn, màu sắc pastel ngọt ngào làm quà tặng sinh nhật hoặc kỷ niệm ý nghĩa.",
    tag: {
      id: "tag-3",
      name: "Ý tưởng quà tặng handmade",
      slug: "y-tuong-qua-tang-handmade",
    },
    author: {
      fullName: "Kiều Handmade",
      avatar: "/images/avatar-default.png",
    },
    thumbnail: {
      url: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop",
      altText: "Móc khóa len hoa tulip pastel",
    },
    status: "PUBLISHED",
    isFeatured: true,
    showOnHome: true,
    viewCount: 1420,
    readTimeMinutes: 4,
    publishedAt: "2026-03-01T08:30:00.000Z",
    createdAt: "2026-02-28T10:00:00.000Z",
    updatedAt: "2026-03-01T08:30:00.000Z",
  },
  {
    id: "post-2",
    code: "BP-002",
    slug: "huong-dan-moc-chu-ech-xanh-mini-cho-nguoi-moi-bat-dau",
    title: "Hướng dẫn chi tiết móc chú ếch xanh mini bằng len cho người mới bắt đầu",
    excerpt:
      "Bài viết hướng dẫn từng mũi móc đơn cơ bản và công thức đếm hàng để bạn tự tay làm ra một chiếc móc khóa chú ếch mắt to ngộ nghĩnh.",
    tag: {
      id: "tag-2",
      name: "Hướng dẫn làm móc khóa",
      slug: "huong-dan-lam-moc-khoa",
    },
    author: {
      fullName: "Tiệm Len Nhà Kiều",
      avatar: "/images/avatar-default.png",
    },
    thumbnail: {
      url: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=600&auto=format&fit=crop",
      altText: "Móc khóa chú ếch xanh mini",
    },
    status: "PUBLISHED",
    isFeatured: true,
    showOnHome: false,
    viewCount: 980,
    readTimeMinutes: 6,
    publishedAt: "2026-02-24T14:15:00.000Z",
    createdAt: "2026-02-24T09:00:00.000Z",
    updatedAt: "2026-02-24T14:15:00.000Z",
  },
  {
    id: "post-3",
    code: "BP-003",
    slug: "cach-giat-va-giu-form-moc-khoa-len-khong-bi-xu-long",
    title: "Bí quyết giặt và giữ phom móc khóa len handmade không lo xù lông hay phai màu",
    excerpt:
      "Chia sẻ quy trình làm sạch móc khóa và thú bông len an toàn bằng dầu gội nhẹ dịu, cách vắt khô bằng khăn bông để sản phẩm bền đẹp như mới.",
    tag: {
      id: "tag-4",
      name: "Bảo quản & giặt đồ len",
      slug: "bao-quan-giat-do-len",
    },
    author: {
      fullName: "Kiều Handmade",
      avatar: "/images/avatar-default.png",
    },
    thumbnail: {
      url: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=600&auto=format&fit=crop",
      altText: "Chăm sóc sản phẩm len handmade",
    },
    status: "PUBLISHED",
    isFeatured: false,
    showOnHome: true,
    viewCount: 750,
    readTimeMinutes: 3,
    publishedAt: "2026-02-18T16:00:00.000Z",
    createdAt: "2026-02-18T10:00:00.000Z",
    updatedAt: "2026-02-18T16:00:00.000Z",
  },
  {
    id: "post-4",
    code: "BP-004",
    slug: "trao-luu-treo-moc-khoa-len-cap-sach-hot-trend-hoc-sinh-gen-z",
    title: "Vì sao trào lưu treo móc khóa len handmade lại tạo cơn sốt trên TikTok của giới trẻ?",
    excerpt:
      "Khám phá sức hút của những chiếc móc khóa hoa mặt cười, thú cưng cá nhân hóa giúp thể hiện phong cách riêng biệt của các bạn trẻ.",
    tag: {
      id: "tag-5",
      name: "Hot trend TikTok",
      slug: "hot-trend-tiktok",
    },
    author: {
      fullName: "Admin Marketing",
      avatar: "/images/avatar-default.png",
    },
    thumbnail: {
      url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600&auto=format&fit=crop",
      altText: "Móc khóa len theo xu hướng TikTok",
    },
    status: "DRAFT",
    isFeatured: false,
    showOnHome: false,
    viewCount: 0,
    readTimeMinutes: 5,
    publishedAt: null,
    createdAt: "2026-03-05T11:20:00.000Z",
    updatedAt: "2026-03-05T11:20:00.000Z",
  },
  {
    id: "post-5",
    code: "BP-005",
    slug: "bo-suu-tap-moc-khoa-len-giang-sinh-phien-ban-gioi-han",
    title: "Bộ sưu tập móc khóa len mùa lễ hội phiên bản giới hạn của Tiệm Len Nhà Kiều",
    excerpt:
      "Những thiết kế cây thông noel mini, người tuyết và tuần lộc len ấm áp đã được lưu kho chuẩn bị cho đợt mở bán năm tiếp theo.",
    tag: {
      id: "tag-3",
      name: "Ý tưởng quà tặng handmade",
      slug: "y-tuong-qua-tang-handmade",
    },
    author: {
      fullName: "Tiệm Len Nhà Kiều",
      avatar: "/images/avatar-default.png",
    },
    thumbnail: {
      url: "https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=600&auto=format&fit=crop",
      altText: "Móc khóa giáng sinh handmade",
    },
    status: "HIDDEN",
    isFeatured: false,
    showOnHome: false,
    viewCount: 2310,
    readTimeMinutes: 4,
    publishedAt: "2025-12-01T09:00:00.000Z",
    createdAt: "2025-11-28T08:00:00.000Z",
    updatedAt: "2026-01-05T10:00:00.000Z",
  },
];
