export type CategoryStatus = "ACTIVE" | "HIDDEN";

export interface CategoryListItem {
  id: string;
  code: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  displayOrder: number;
  productCount: number;
  status: CategoryStatus;
  createdAt: string;
  updatedAt: string;
}

export type CategoryStatusFilter = "ALL" | CategoryStatus;
export type CategorySortKey = "displayOrder" | "productCount";
export type SortOrder = "asc" | "desc";

export interface CategoryFilterState {
  searchQuery: string;
  statusFilter: CategoryStatusFilter;
  sortBy: CategorySortKey;
  sortOrder: SortOrder;
  page: number;
  pageSize: number;
}

export const MOCK_CATEGORIES_DATA: CategoryListItem[] = [
  {
    id: "cat_01",
    code: "CAT-KEYCHAIN",
    name: "Móc khóa len",
    slug: "moc-khoa-len",
    description: "Các mẫu móc khóa len handmade siêu dễ thương dành cho cặp đôi, móc ba lô, chìa khóa xe",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&auto=format&fit=crop&q=80",
    displayOrder: 1,
    productCount: 24,
    status: "ACTIVE",
    createdAt: "2024-01-15",
    updatedAt: "Vừa xong",
  },
  {
    id: "cat_02",
    code: "CAT-FLOWER",
    name: "Hoa len bó & lẻ",
    slug: "hoa-len-bo-le",
    description: "Hoa len làm quà tặng sinh nhật, tốt nghiệp, 8/3 bền đẹp không bao giờ héo",
    image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=300&auto=format&fit=crop&q=80",
    displayOrder: 2,
    productCount: 18,
    status: "ACTIVE",
    createdAt: "2024-01-18",
    updatedAt: "Vừa xong",
  },
  {
    id: "cat_03",
    code: "CAT-GIFT",
    name: "Hộp quà sinh nhật",
    slug: "hop-qua-sinh-nhat",
    description: "Combo quà tặng móc khóa len kết hợp thiệp chúc mừng đóng hộp nơ sang trọng",
    image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=300&auto=format&fit=crop&q=80",
    displayOrder: 3,
    productCount: 8,
    status: "ACTIVE",
    createdAt: "2024-02-01",
    updatedAt: "2 ngày trước",
  },
  {
    id: "cat_04",
    code: "CAT-ACCESSORY",
    name: "Phụ kiện len",
    slug: "phu-kien-len",
    description: "Băng đô, túi xách len mini, kẹp tóc len thủ công",
    image: "https://images.unsplash.com/photo-1606760227091-3dd850d97f1d?w=300&auto=format&fit=crop&q=80",
    displayOrder: 4,
    productCount: 12,
    status: "HIDDEN",
    createdAt: "2024-02-10",
    updatedAt: "5 ngày trước",
  },
];
