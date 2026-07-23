# Design System — Tiệm Len Nhà Kiều

> Trích xuất từ UI Kit thiết kế sẵn. Dùng file này làm nguồn chân lý duy nhất cho màu sắc,
> typography, spacing, và spec của từng component. Agent code UI phải bám theo đúng giá trị
> ở đây, không tự chế thêm màu/size khác ngoài token đã định nghĩa.

---

## 1. Colors (Màu sắc chủ đạo)

| Token | Hex | Dùng cho |
|---|---|---|
| `primary` | `#F9B4C7` | Màu chính của brand — nút chính, highlight |
| `primaryHover` | `#F5A389` | Trạng thái hover của primary |
| `primaryActive` | `#EE91AA` | Trạng thái active/pressed của primary |
| `primaryLight` | `#FFF1F4` | Nền nhạt (background cho badge, hover nhẹ, section) |
| `secondary` | `#B85E66` | Màu phụ — text nhấn, accent |
| `textPrimary` | `#2D2D2D` | Màu chữ chính |
| `textSecondary` | `#6B7280` | Màu chữ phụ, mô tả, placeholder |
| `border` | `#E5E7EB` | Viền input, card, divider |
| `background` | `#FAFAFC` | Nền trang (body) |
| `surface` | `#FFFFFF` | Nền card, modal, dropdown |

**Semantic colors** (trạng thái):

| Token | Hex | Ý nghĩa |
|---|---|---|
| `success` | `#22C55E` | Thành công |
| `warning` | `#F59E0B` | Cảnh báo |
| `error` | `#EF4444` | Lỗi |
| `info` | `#3B82F6` | Thông tin |

### Cấu hình Tailwind (`tailwind.config.ts`)

```ts
colors: {
  primary: {
    DEFAULT: "#F9B4C7",
    hover: "#F5A389",
    active: "#EE91AA",
    light: "#FFF1F4",
  },
  secondary: "#B85E66",
  text: {
    primary: "#2D2D2D",
    secondary: "#6B7280",
  },
  border: "#E5E7EB",
  background: "#FAFAFC",
  surface: "#FFFFFF",
  success: "#22C55E",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",
}
```

---

## 2. Typography

**Font chữ**: `Be Vietnam Pro` (được cấu hình tập trung qua CSS variables / Env để dễ dàng tùy chỉnh, weight 400/500/600/700)

| Style | Size | Weight | Line-height |
|---|---|---|---|
| H1 | 32px | 600 | 1.2 |
| H2 | 24px | 600 | 1.3 |
| H3 | 20px | 600 | 1.4 |
| H4 | 18px | 500 | 1.4 |
| Body Large | 16px | 400 | 1.6 |
| Body | 14px | 400 | 1.6 |
| Small | 12px | 400 | 1.5 |
| Caption | 11px | 400 | 1.4 |

> Quy tắc dùng: H1 chỉ dùng 1 lần/trang (tiêu đề chính). H2 cho tiêu đề section. Body dùng cho nội dung mặc định toàn site. Caption dùng cho timestamp, ghi chú nhỏ.

---

## 3. Spacing & Radius

**Spacing scale (px)**: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64`
→ Map sang Tailwind spacing tương ứng (`1, 2, 3, 4, 5, 6, 8, 10, 12, 16`). Không dùng giá trị spacing tùy ý ngoài scale này.

**Border radius scale (px)**: `2, 4, 6, 8, 10, 12`
- `2px`: chi tiết nhỏ (checkbox)
- `4-6px`: input, button nhỏ
- `8px`: button chuẩn, card nhỏ
- `10-12px`: card lớn, modal

**Quy tắc Bo góc (Border Radius)**:
- Luôn ưu tiên sử dụng trị số bo góc (border radius) nhỏ nhất có thể cho phù hợp với từng component (ví dụ: `rounded-md` hoặc `rounded-lg` cho card/modal). Tránh lạm dụng bo góc quá lớn (như `rounded-2xl`, `rounded-3xl` hoặc `rounded-full` cho các khung/modal bao ngoài lớn) nếu không có yêu cầu cụ thể từ bản thiết kế. Thiết kế hướng tới sự tinh tế, tối giản, vuông vắn vừa phải thay vì tròn trịa quá đà.

**Quy tắc đổ bóng (Shadow)**:
- Tuyệt đối không sử dụng hiệu ứng đổ bóng (box shadow) như các class `shadow-sm`, `shadow`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl` trong Tailwind cho bất kỳ UI component hay layout nào (Header, Dropdown, Modal, Drawer...), trừ khi có yêu cầu cụ thể rõ ràng từ phía khách hàng. Giao diện ưu tiên thiết kế phẳng, sắc nét, tối giản, sử dụng border rõ ràng để phân cấp thay vì dùng shadow.

---

## 4. Buttons

**5 variant**: Primary, Outline, Secondary, Ghost, Danger
**5 state mỗi variant**: Default, Hover, Active, Disabled, Icon Only

| Variant | Default | Hover | Active | Disabled |
|---|---|---|---|---|
| Primary | nền `primary`, chữ trắng | nền `primaryHover` | nền `primaryActive` | nền `primaryLight`, chữ mờ |
| Outline | viền `primary`, chữ `primary`, nền trong suốt | nền `primaryLight` nhạt | viền đậm hơn | viền xám mờ, chữ mờ |
| Secondary | nền xám nhạt/trắng, viền `border`, chữ `textPrimary` | nền xám hơi đậm | nền đậm hơn nữa | mờ toàn bộ |
| Ghost | không nền, không viền, chữ `primary` | nền `primaryLight` nhạt | đậm hơn | chữ mờ, không nền |
| Danger | nền `error` nhạt/viền đỏ (outline-danger) → khi Active nền đỏ đậm `#EF4444` chữ trắng | đậm hơn | đậm nhất | mờ |

**Icon Only**: button hình vuông/tròn, chỉ chứa icon (vd icon trái tim yêu thích), có đủ 4 state như trên.

---

## 5. Inputs

**5 state**: Default, Focus, Filled, Disabled, Error

| State | Style |
|---|---|
| Default | viền `border`, nền trắng, placeholder `textSecondary` ("Nhập nội dung") |
| Focus | viền `primary` đậm hơn, có thể thêm shadow nhạt màu primary |
| Filled | viền `border`, có giá trị (không phải placeholder) |
| Disabled | nền xám nhạt, chữ mờ, không thể click |
| Error | viền `error` (đỏ) |

**Search Input**: input dạng bo tròn nhiều hơn, có icon kính lúp bên trái, placeholder "Tìm sản phẩm, danh mục..."

---

## 6. Select & Dropdown

**4 trạng thái hiển thị**: Default (chưa chọn, placeholder "Chọn danh mục"), Open (đang mở list, có icon mũi tên hướng lên, item đang hover highlight màu `primaryLight`), Selected (đã chọn 1 giá trị, vd "Móc khóa"), Switch (dropdown dùng để chuyển đổi nhanh — cùng style Default nhưng ngữ cảnh khác)

**Danh sách item mẫu trong dropdown** (danh mục sản phẩm): Móc khóa, Thú bông, Hoa len, Phụ kiện, Đồ decor

---

## 7. Checkbox, Radio & Switch

**Checkbox**: Default (viền vuông bo nhẹ, rỗng), Checked (nền `primary`, dấu tick trắng), Disabled (nền xám mờ)

**Radio**: Default (viền tròn rỗng), Selected (chấm tròn `primary` ở giữa), Disabled (mờ)

**Switch**: off (nền xám), on (nền `primary`), disabled (mờ, không thao tác được)

---

## 8. Badges & Tags

**Badge sản phẩm** (dùng trên `ProductCard`, góc ảnh):
| Label | Màu nền gợi ý |
|---|---|
| New | xanh lá nhạt |
| Best seller | đỏ/hồng đậm |
| Hot TikTok | cam/đỏ, có icon lửa 🔥 |
| Sale | hồng `primary` |
| Limited | tím/xám đậm |
| Sold out | xám, chữ mờ |

**Badge trạng thái đơn hàng** (dùng ở Order Timeline, Admin Order List):
| Label | Màu nền gợi ý |
|---|---|
| Chờ xác nhận | vàng nhạt |
| Đã thanh toán | xanh dương nhạt |
| Đang xử lý | tím nhạt |
| Đang giao | hồng `primary` nhạt |
| Hoàn thành | xanh lá nhạt |
| Đã hủy | đỏ nhạt |

> Đây chính là bộ label cần đưa vào `constants/orderStatus.ts` đã thiết kế ở tài liệu trước — dùng đúng 6 giá trị này xuyên suốt client + admin.

---

## 9. Toast Notifications

Vị trí: góc màn hình (thường top-right), tự ẩn sau vài giây, có nút đóng (×).

| Loại | Icon | Ví dụ nội dung |
|---|---|---|
| Success | ✓ xanh lá | "Thành công! Sản phẩm đã được thêm vào giỏ hàng." |
| Error | ✕ đỏ | "Có lỗi xảy ra! Vui lòng thử lại sau." |
| Warning | ⚠ vàng | "Sắp hết hàng! Chỉ còn 2 sản phẩm trong kho." |
| Info | ℹ xanh dương | "Thông báo: Đơn hàng của bạn đang được xử lý." |
| Loading | spinner hồng | "Đang xử lý... Vui lòng chờ trong giây lát." |
| Undo | icon xoay lại | "Đã xóa sản phẩm. Sản phẩm đã được xóa khỏi giỏ hàng." + link "Hoàn tác" |

---

## 10. Alerts (banner, không tự ẩn — khác Toast)

Dạng banner nằm trong nội dung trang (không phải popup góc màn hình), có icon + tiêu đề in đậm + mô tả + nút đóng:
- Success: "Success! Thao tác của bạn đã được thực hiện thành công."
- Warning: "Cảnh báo! Vui lòng kiểm tra lại thông tin trước khi tiếp tục."
- Error: "Lỗi! Có lỗi xảy ra, vui lòng thử lại sau."
- Info: "Thông tin! Đây là thông tin dành cho bạn."

---

## 11. Tooltip

Nền đen/xám đậm, chữ trắng, bo góc nhỏ, mũi tên chỉ xuống phần tử được hover. Dùng cho icon action (yêu thích, share, help, info) ở nơi không đủ chỗ ghi chữ.

---

## 12. Tabs

Style underline: tab đang chọn có gạch chân màu `primary` + chữ màu `primary` đậm, các tab khác chữ `textSecondary`. Có thể kèm badge số lượng (vd "Đánh giá (128)").

Ví dụ tab dùng ở Product Detail: Mô tả sản phẩm / Đánh giá (128) / Hướng dẫn / Chính sách

---

## 13. Pagination

Dạng số trang + nút prev/next (‹ ›), trang hiện tại có nền `primary` bo tròn, có dấu "..." khi nhiều trang (vd `1 2 3 ... 10`).

---

## 14. Breadcrumb

Dạng text phân cách bằng icon `>`, trang hiện tại in đậm màu `textPrimary`, các cấp trước màu `textSecondary`. Ví dụ: `Trang chủ > Móc khóa len > Mèo hồng dễ thương`

---

## 15. Card Example (Product Card)

Thành phần: ảnh sản phẩm (bo góc trên), badge góc trái trên (vd "Hot"), icon yêu thích góc phải trên, tên sản phẩm, giá (màu `primary`/đậm), rating (sao + số lượt đánh giá), nút "Thêm vào giỏ" (primary) + icon giỏ hàng nhỏ bên cạnh.

---

## 16. Empty States

Mỗi empty state gồm: illustration/icon xám nhạt, tiêu đề in đậm, mô tả phụ (`textSecondary`), 1 nút CTA màu primary để điều hướng tiếp.

| Ngữ cảnh | Tiêu đề | Mô tả | CTA |
|---|---|---|---|
| Giỏ hàng trống | "Giỏ hàng trống" | "Bạn chưa có sản phẩm nào trong giỏ hàng." | "Mua sắm ngay" |
| Không tìm thấy sản phẩm | "Không tìm thấy sản phẩm" | "Sản phẩm bạn tìm kiếm không tồn tại hoặc đã bị xóa." | "Xem tất cả sản phẩm" |
| Chưa có đơn hàng | "Chưa có đơn hàng" | "Bạn chưa đặt đơn hàng nào." | "Đặt hàng ngay" |

---

## 17. Upload File

Vùng kéo-thả bo nét đứt (dashed border), icon upload cloud, text "Kéo & thả ảnh vào đây" + "hoặc" + nút "Chọn ảnh từ thiết bị" (outline/primary), ghi chú định dạng cho phép + dung lượng tối đa ("JPG, PNG tối đa 5MB").

---

## 18. Modal Example

Overlay tối phía sau, card trắng bo góc lớn ở giữa, có nút đóng (×) góc phải trên, tiêu đề in đậm, nội dung mô tả, 2 nút hành động cuối modal: nút "Hủy" (secondary/outline) bên trái, nút hành động chính (vd "Xóa" — màu `error` nếu là hành động phá hủy) bên phải.

Ví dụ: modal "Xác nhận xóa sản phẩm" — "Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác." → [Hủy] [Xóa]

**Quy tắc Responsive cho Modal/Drawer**:
- Trên di động (mobile, < 768px): Các modal/drawer phụ (như Tìm kiếm, Giỏ hàng) bắt buộc chiếm 100% chiều ngang (full width), xuất hiện từ dưới lên (kiểu Bottom Sheet) có thanh kéo drag handle ở đầu và có lớp phủ làm mờ nền (backdrop).
- Trên máy tính (desktop, >= 768px): Các modal/drawer này hiển thị dưới dạng Popover nổi nằm ngay dưới/bên cạnh icon bấm mà không làm mờ nền (không dùng backdrop).

---

## 19. Áp dụng riêng biệt cho `fe-client` và `fe-admin` (không dùng chung)

Vì `fe-client` và `fe-admin` là 2 source **độc lập hoàn toàn, không share code/package**:
- **FE Client (`fe-client`)**: Sử dụng hệ thống token màu sắc thương hiệu chính (Theme hồng tươi `primary: #F9B4C7`) quy định trong file này (`designSystem.md`).
- **FE Admin (`fe-admin`)**: Sử dụng dải màu Dark Navy Slate + Xanh Emerald (`primary: #10B981`) được quy định riêng biệt trong **`references/adminDesignSystem.md`**.

```
fe-client/src/components/ui/     ← Button, Input, Select, Badge, Modal... (Theme Hồng tươi)
fe-admin/src/components/ui/      ← Button, Input, Select, Badge, Modal... (Theme Dark Navy Slate + Emerald Green)
```

- Cả 2 nơi cùng áp dụng đúng token màu/spacing/radius ở mục 1-3, và copy cùng giá trị `colors` trong `tailwind.config.ts` sang cả 2 source — nhưng đây là **copy tay**, không phải import chung 1 package.
- Nếu sau này UI kit có thay đổi (đổi màu primary, đổi spacing scale...), phải cập nhật thủ công ở **cả 2 source**, không có cơ chế tự động đồng bộ — đây là đánh đổi đã chọn (đơn giản, độc lập) thay vì dùng shared package.
- Admin có thể không cần đủ toàn bộ component (vd Admin ít khi cần "Card sản phẩm" kiểu client), chỉ build những component thực sự dùng đến ở màn hình admin tương ứng (`admin-ui-spec.md`).

## 20. Ghi chú cho Agent khi code component

1. Build component trong `components/ui/` của **từng source riêng** theo đúng token màu/spacing/radius ở mục 1-3 — **không hardcode hex màu trực tiếp trong component**, luôn dùng token Tailwind đã cấu hình.
2. Mỗi component (`Button`, `Input`, `Select`, `Checkbox`, `Radio`, `Switch`, `Badge`, `Toast`, `Alert`, `Tooltip`, `Tabs`, `Pagination`, `Breadcrumb`, `Modal`) code đủ toàn bộ state/variant liệt kê ở trên qua props, không tạo riêng nhiều component trùng lặp cho từng state.
3. Text label mặc định trong ví dụ (placeholder, message toast/alert, badge trạng thái) đưa vào `constants/messages.ts` và `constants/orderStatus.ts` của **chính source đó** như đã thiết kế trước đó — component chỉ nhận text qua props, không hardcode chữ tiếng Việt trực tiếp trong component UI.
4. Ưu tiên dùng Radix UI/shadcn (Dialog, Tooltip, Select, Tabs, Switch...) làm nền accessibility ở **cả 2 source độc lập**, rồi style lại theo token trong file này — không tự build từ đầu các phần liên quan đến keyboard navigation/focus trap (đặc biệt Modal, Dropdown).
