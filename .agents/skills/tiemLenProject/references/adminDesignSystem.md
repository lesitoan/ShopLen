# Admin Design System — Tiệm Len Nhà Kiều (FE Admin)

> Nguồn chân lý duy nhất cho màu sắc, typography, spacing, border radius và quy chuẩn UI component dành riêng cho **Admin Dashboard (`fe-admin`)**.
> Tất cả các Agent khi phát triển hoặc sửa đổi màn hình Admin phải bám theo đúng quy chuẩn và token trong file này, không tự ý chế thêm màu sắc hoặc kiểu dáng ngoài token đã định nghĩa.

---

## 1. Colors & Dark Navy Slate Theme (Cấu hình `tailwind.config.ts`)

Giao diện Admin sử dụng duy nhất **Theme Nền Tối Dark Navy Slate + Màu chủ đạo Xanh Emerald**, không code logic chuyển đổi Light/Dark mode.

```ts
colors: {
  bg: {
    dark: "#111524",       // Nền chính tối sâu
    mid: "#14192B",        // Nền trung gian
    deep: "#0F121F",       // Nền tối nhất
  },
  surface: {
    DEFAULT: "#1F2438",    // Nền đặc 100% cho Card, Modal, Sidebar, Topbar
    hover: "#282F48",      // Trạng thái hover của surface
    active: "#2F3754",     // Trạng thái active/pressed của surface
    muted: "#171B2B",      // Nền phụ (Table Header, Pagination)
  },
  primary: {
    DEFAULT: "#10B981",    // Màu chính Xanh Emerald — nút chính, highlight, active item
    hover: "#059669",      // Hover của primary
    active: "#047857",     // Active/Pressed của primary
    light: "rgba(16, 185, 129, 0.15)",
    glow: "rgba(16, 185, 129, 0.3)",
  },
  secondary: {
    DEFAULT: "#34D399",    // Màu phụ accent
    hover: "#10B981",
  },
  border: {
    DEFAULT: "#2C3552",    // Viền chính cho Card, Input, Table
    light: "#384366",      // Viền phụ nhạt hơn
    subtle: "#21283E",     // Viền mờ
  },
  text: {
    primary: "#E2E8F0",    // Màu chữ chính
    secondary: "#94A3B8",  // Màu chữ phụ, nhãn bộ lọc
    muted: "#64748B",      // Màu chữ mờ, placeholder
    highlight: "#F8FAFC",  // Màu tiêu đề in đậm
  },
  status: {
    success: "#34D399",    // Đã thanh toán / Hoàn tất
    warning: "#FBBF24",    // Chờ thanh toán / Cảnh báo
    danger: "#F87171",     // Đã hủy / Xóa / Nguy hiểm
    info: "#60A5FA",       // Đang đóng gói / Thông tin
  },
}
```

---

## 2. Border Radius Scale (Bo góc vuông vắn & phẳng)

Giao diện Admin ưu tiên sự **vuông vức, phẳng và chuyên nghiệp**.

```ts
borderRadius: {
  sm: "2px",       // Chi tiết nhỏ (checkbox, badge nhỏ)
  DEFAULT: "4px",  // Mặc định
  md: "6px",       // Button, Input, Select, Sidebar Menu Item, Badge
  lg: "8px",       // Card, Modal
  xl: "10px",      // Khung bao lớn
  full: "9999px",  // Chấm chỉ báo status (dot)
}
```

---

## 3. Quy chuẩn UI Components

### 3.1 Buttons (`components/ui/Button.tsx`)
- **Variant Primary**: `bg-primary hover:bg-primary-hover active:bg-primary-active text-bg-deep font-bold shadow-md shadow-primary/30`. Màu nền xanh emerald đặc tươi rực rỡ.
- **Variant Secondary**: `bg-surface-active hover:bg-surface-hover text-text-highlight font-semibold border border-border-light shadow-sm`.
- **Variant Danger**: `bg-status-danger hover:bg-red-600 active:bg-red-700 text-white font-bold shadow-md shadow-status-danger/30`. Màu nền đỏ đặc tươi.
- **Variant Outline**: `border-2 border-primary text-primary hover:bg-primary hover:text-bg-deep font-bold`.
- **Variant Ghost**: `text-text-primary hover:bg-surface-hover font-medium`.

### 3.2 Status Badges (`components/ui/Badge.tsx`)
- **Style Nền Pastel Dịu Nhẹ + Chữ Nổi Bật + Chấm Dot**:
  - `success`: `bg-status-success/20 text-status-success border-status-success/30 font-semibold` + `dot: bg-status-success`.
  - `warning`: `bg-status-warning/20 text-status-warning border-status-warning/30 font-semibold` + `dot: bg-status-warning`.
  - `danger`: `bg-status-danger/20 text-status-danger border-status-danger/30 font-semibold` + `dot: bg-status-danger`.
  - `info`: `bg-status-info/20 text-status-info border-status-info/30 font-semibold` + `dot: bg-status-info`.
  - `primary`: `bg-primary/20 text-primary border-primary/30 font-semibold` + `dot: bg-primary`.

### 3.3 Metric Icon Boxes (Dashboard Stat Cards)
- Các khối icon chỉ số kinh doanh chính sử dụng **màu nền đặc tươi rực rỡ (Solid Filled)** kết hợp với **icon màu trắng tinh** và bóng đổ nhẹ:
  - Doanh thu: `bg-emerald-500 text-white shadow-md shadow-emerald-500/30 p-2.5 rounded-md`
  - Đơn mới: `bg-blue-500 text-white shadow-md shadow-blue-500/30 p-2.5 rounded-md`
  - Chờ thanh toán: `bg-amber-500 text-white shadow-md shadow-amber-500/30 p-2.5 rounded-md`
  - Khách mới: `bg-purple-500 text-white shadow-md shadow-purple-500/30 p-2.5 rounded-md`

### 3.4 Cards (`components/ui/Card.tsx`)
- Thẻ khung rêu xám tối đặc 100% opacity (`bg-surface`), viền `border-border` (`#2C3552`), bo góc `rounded-lg` (8px). Không dùng `backdrop-blur` mờ mờ.

### 3.5 Sidebar Navigation (`components/layout/Sidebar.tsx`)
- Nền đặc 100% `bg-surface`.
- Item active: Khối bo góc nhẹ `rounded-md` gradient xanh emerald `bg-gradient-to-r from-primary to-emerald-600 text-bg-deep font-bold shadow-md shadow-primary/20`.

### 3.6 Topbar Header (`components/layout/Topbar.tsx`)
- Nền đặc 100% `bg-surface`, viền dưới `border-border`.
- Tích hợp Breadcrumb đường dẫn tiếng Anh, ô tìm kiếm nhanh (bo góc `rounded-md`), icon chuông thông báo realtime với badge đỏ nảy số, và avatar Admin dropdown.

### 3.7 Data Tables (`components/ui/DataTable.tsx`)
- Nền đặc `bg-surface`, tiêu đề cột `bg-surface-muted` (`#171B2B`), dòng dữ liệu `hover:bg-surface-hover` (`#282F48`).
- Tích hợp sẵn phân trang server (`Pagination`) và empty state.

---

## 4. Quy tắc Đồng bộ URL Search Params (`useUrlParams`)

Mọi màn hình dạng danh sách (List View) như Đơn hàng (`/orders`), Sản phẩm (`/products`), Khách hàng (`/customers`), Bài viết (`/blog`) bắt buộc:
1. Đọc/ghi các tham số bộ lọc (`status`, `category`, `search`, `page`) lên thanh địa chỉ `window.location.search` qua hook `useUrlParams`.
2. Khi người dùng bấm tab trạng thái (`Tabs`), nhập từ khóa tìm kiếm (`Input`), hoặc chuyển trang (`DataTable`), URL tự động cập nhật (ví dụ: `/orders?status=PAID&search=0987&page=1`) để người dùng có thể lưu bookmark hoặc chia sẻ link trực tiếp.

---

## 5. Cấu trúc Naming & Source Alignment (Khớp 100% với `fe-client`)

- **Tên folder trong `screens/`**: Sử dụng dạng `camelCase` (`dashboard`, `orders/list`, `orders/detail`, `products/list`, `auth/login`).
- **Tệp giao diện chính**: Đặt tên là **`index.tsx`**.
- **Tệp hằng số / mock data**: Đặt tên là **`constants.ts`** cùng cấp.
- **Tệp sub-component**: Đặt trong **`components/`** cùng cấp.
- **Route `app/**/page.tsx`**: Chỉ import `index.tsx` từ `screens/`.
