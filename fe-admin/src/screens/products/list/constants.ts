export type ProductStatus = "ACTIVE" | "HIDDEN" | "OUT_OF_STOCK";

export type ProductStatusFilter = "ALL" | ProductStatus;

export interface ProductCategoryOption {
  id: string;
  name: string;
}

export interface ProductListItem {
  id: string;
  code: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  image: string;
  originalPrice: number;
  salePrice?: number;
  stockQuantity: number;
  status: ProductStatus;
  isFeatured: boolean;
  updatedAt: string;
}

export interface ProductFilterState {
  searchQuery: string;
  categoryIds: string[];
  statusFilters: ProductStatus[];
  page: number;
  pageSize: number;
}

export const MOCK_CATEGORIES: ProductCategoryOption[] = [
  { id: "CAT-KEYCHAIN", name: "Móc khóa len" },
  { id: "CAT-FLOWER", name: "Hoa len bó & lẻ" },
  { id: "CAT-GIFT", name: "Hộp quà sinh nhật" },
  { id: "CAT-ACCESSORY", name: "Phụ kiện len" },
];

export const MOCK_PRODUCTS: ProductListItem[] = [
  {
    id: "prod_01",
    code: "SP-LEN-001",
    name: "Móc khóa len Thỏ Mập Tai Dài Handmade",
    slug: "moc-khoa-len-tho-map-tai-dai",
    categoryId: "CAT-KEYCHAIN",
    categoryName: "Móc khóa len",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=150&auto=format&fit=crop&q=80",
    originalPrice: 75000,
    salePrice: 65000,
    stockQuantity: 24,
    status: "ACTIVE",
    isFeatured: true,
    updatedAt: "23/07/2026 10:15",
  },
  {
    id: "prod_02",
    code: "SP-LEN-002",
    name: "Móc khóa len Bơ Mini Đáng Yêu",
    slug: "moc-khoa-len-bo-mini",
    categoryId: "CAT-KEYCHAIN",
    categoryName: "Móc khóa len",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=150&auto=format&fit=crop&q=80",
    originalPrice: 45000,
    stockQuantity: 3,
    status: "ACTIVE",
    isFeatured: true,
    updatedAt: "22/07/2026 16:40",
  },
  {
    id: "prod_03",
    code: "SP-LEN-003",
    name: "Móc khóa len Hoa Hướng Dương Handcrafted",
    slug: "moc-khoa-len-hoa-huong-duong",
    categoryId: "CAT-FLOWER",
    categoryName: "Hoa len bó & lẻ",
    image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=150&auto=format&fit=crop&q=80",
    originalPrice: 40000,
    salePrice: 35000,
    stockQuantity: 18,
    status: "ACTIVE",
    isFeatured: false,
    updatedAt: "21/07/2026 14:20",
  },
  {
    id: "prod_04",
    code: "SP-LEN-004",
    name: "Bó Hoa Len Tulips Quà Sinh Nhật Xinh Xắn",
    slug: "bo-hoa-len-tulips-qua-sinh-nhat",
    categoryId: "CAT-GIFT",
    categoryName: "Hộp quà sinh nhật",
    image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=150&auto=format&fit=crop&q=80",
    originalPrice: 150000,
    salePrice: 120000,
    stockQuantity: 0,
    status: "OUT_OF_STOCK",
    isFeatured: true,
    updatedAt: "20/07/2026 09:30",
  },
  {
    id: "prod_05",
    code: "SP-LEN-005",
    name: "Móc khóa Gấu Pooh Dễ Thương Len Milk Cotton",
    slug: "moc-khoa-gau-pooh-len",
    categoryId: "CAT-KEYCHAIN",
    categoryName: "Móc khóa len",
    image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=150&auto=format&fit=crop&q=80",
    originalPrice: 85000,
    stockQuantity: 4,
    status: "ACTIVE",
    isFeatured: false,
    updatedAt: "19/07/2026 11:10",
  },
  {
    id: "prod_06",
    code: "SP-LEN-006",
    name: "Móc khóa Mèo May Mắn Maneki Neko",
    slug: "moc-khoa-meo-may-man",
    categoryId: "CAT-KEYCHAIN",
    categoryName: "Móc khóa len",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=150&auto=format&fit=crop&q=80",
    originalPrice: 95000,
    salePrice: 85000,
    stockQuantity: 12,
    status: "ACTIVE",
    isFeatured: false,
    updatedAt: "18/07/2026 15:50",
  },
  {
    id: "prod_07",
    code: "SP-LEN-007",
    name: "Hoa Cẩm Chướng Len Quà Tặng Mẹ Handcrafted",
    slug: "hoa-cam-chuong-len-qua-tang-me",
    categoryId: "CAT-FLOWER",
    categoryName: "Hoa len bó & lẻ",
    image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=150&auto=format&fit=crop&q=80",
    originalPrice: 65000,
    stockQuantity: 15,
    status: "HIDDEN",
    isFeatured: false,
    updatedAt: "17/07/2026 17:00",
  },
  {
    id: "prod_08",
    code: "SP-LEN-008",
    name: "Móc khóa Cáo Cam Nhỏ Đeo Túi",
    slug: "moc-khoa-cao-cam-nho",
    categoryId: "CAT-KEYCHAIN",
    categoryName: "Móc khóa len",
    image: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=150&auto=format&fit=crop&q=80",
    originalPrice: 75000,
    stockQuantity: 2,
    status: "ACTIVE",
    isFeatured: false,
    updatedAt: "16/07/2026 08:45",
  },
];
