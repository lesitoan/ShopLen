# Đặc tả giao diện Client — Website bán móc khóa len handmade

> Tài liệu này dùng để agent (AI coding assistant) implement phần **Client (Storefront)**.
> Không bao gồm Admin Dashboard. Backend API được giả định đã có sẵn theo REST + Socket.IO
> (xem mục 10 — API & Socket contract giả định, cần confirm lại với BE thực tế trước khi code).

---

> CẬP NHẬT V1: Các phần trong file này nói về guest checkout, guest order lookup hoặc merge cart server là legacy. Quyết định hiện hành:
> - Khách phải đăng nhập mới checkout.
> - Cart lưu localStorage ở client, không tạo API cart v1.
> - Không có guest order lookup trong API v1; lịch sử/chi tiết đơn nằm trong tài khoản customer.
> - Auth client dùng email/password và Google login.
> - Product không còn rating sao.
> - Product option hiện chỉ gồm `COLOR` và `SIZE`, lưu theo từng product bằng bảng `productOptions`.

## 0. Tech stack đề xuất (Frontend)

- **Framework**: Next.js (App Router), SSR/ISR cho SEO (đặc biệt trang Blog, Product Detail, Home)
- **Styling**: TailwindCSS
- **State quản lý giỏ hàng/user**: Zustand hoặc Context API (giỏ hàng lưu localStorage cho guest)
- **Form**: React Hook Form + Zod validate
- **Data fetching**: React Query (TanStack Query) — cache, refetch, loading/error state chuẩn
- **Realtime**: socket.io-client
- **Rich text render (blog)**: render HTML/Markdown từ CMS

Nguyên tắc chung:
- Toàn bộ trang **public** (Home, Product Listing, Product Detail, Blog) phải SSR/SSG để tối ưu SEO.
- Trang có dữ liệu cá nhân (Cart, Checkout, My Account) dùng CSR bình thường.
- Mobile-first (vì traffic chính đến từ TikTok → khách bấm link trên điện thoại).
- Toàn bộ trang cần có: loading skeleton, empty state, error state.

---

## 1. Danh sách màn hình (Sitemap)

```
/                          Home
/san-pham                 Product Listing
/san-pham/[slug]           Product Detail
/gio-hang                  Cart
/thanh-toan                Checkout
/thanh-toan/qr/[orderId]   Payment (QR)
/don-hang/thanh-cong/[orderId]   Order Success
/tra-cuu-don-hang          Order Lookup (guest)
/dang-nhap                 Login
/dang-ky                   Register
/quen-mat-khau             Forgot password
/tai-khoan                 My Account (overview)
/tai-khoan/don-hang        Order history
/tai-khoan/don-hang/[id]   Order detail (logged-in)
/tai-khoan/dia-chi         Address book
/tai-khoan/diem-thuong     Loyalty points
/blog                      Blog Listing
/blog/[slug]               Blog Detail
/gioi-thieu                About
/lien-he                   Contact
/chinh-sach/*              Policy pages (static)
```

---

## 2. Trang Home (`/`)

**Mục đích**: điểm chạm đầu tiên từ link TikTok, cần load nhanh, gây ấn tượng, dẫn khách vào sản phẩm.

**Bố cục (top → bottom)**:
1. Header (xem mục 9 — Layout chung)
2. Hero banner/slider (ảnh sản phẩm nổi bật, có thể link tới sản phẩm hoặc campaign)
3. Danh mục nổi bật — dạng grid icon/ảnh tròn (Hoa, Quà sinh nhật, Động vật, ...) → click vào filter Product Listing theo category
4. Section "Sản phẩm bán chạy" — carousel/grid card sản phẩm
5. Section "Hàng sắp hết" — hiển thị sản phẩm có tồn kho thấp (badge "Chỉ còn X cái") để tạo cảm giác khan hiếm
6. Section "Mới về"
7. Section blog nổi bật (2-3 bài mới nhất) — điều hướng SEO nội bộ
8. Footer

**Component cần có**:
- `ProductCard` (ảnh, tên, giá, badge tồn kho, nút thêm giỏ nhanh)
- `CategoryPill` / `CategoryCircle`
- `BannerSlider`
- `BlogPreviewCard`

**Trạng thái đặc biệt**: nếu sản phẩm hết hàng hoàn toàn → card hiển thị overlay "Hết hàng", disable nút thêm giỏ.

---

## 3. Trang Product Listing (`/san-pham`)

**Query params**: `?category=hoa&sort=price_asc&page=1&minPrice=&maxPrice=`

**Bố cục**:
- Sidebar (desktop) / Bottom sheet filter (mobile):
  - Lọc theo category (checkbox hoặc single-select)
  - Lọc theo khoảng giá
  - Sort: giá tăng dần/giảm dần, mới nhất, bán chạy
- Grid sản phẩm (`ProductCard`), 2 cột mobile / 4 cột desktop
- Phân trang hoặc infinite scroll (khuyến nghị infinite scroll cho mobile UX)
- Empty state: "Không tìm thấy sản phẩm phù hợp"

**Realtime**: subscribe socket theo danh sách `productId` đang hiển thị trên màn hình → cập nhật tồn kho live (event `stock:update`, xem mục 10).

---

## 4. Trang Product Detail (`/san-pham/[slug]`)

**Bố cục**:
- Gallery ảnh (nhiều ảnh, có zoom, swipe trên mobile)
- Tên sản phẩm, giá, badge tồn kho (real-time)
- Chọn biến thể nếu có (size/màu) — dùng dạng button group, disable option hết hàng
- Số lượng (quantity stepper)
- 2 nút CTA: **"Thêm vào giỏ"** và **"Mua ngay"** (mua ngay → thẳng tới Checkout với sản phẩm này)
- Mô tả sản phẩm (rich text)
- Section "Sản phẩm liên quan" (cùng category)
- (SEO) breadcrumb: Home / Category / Tên sản phẩm

**Trạng thái**:
- Hết hàng: disable CTA, hiện nút "Báo khi có hàng" (optional, có thể để form nhập email/SĐT)
- Tồn kho thấp (<5): hiện badge cảnh báo màu cam/đỏ "Chỉ còn X cái"

**Realtime**: join socket room theo `product:{id}`, lắng nghe event `stock:update` để cập nhật số tồn kho không cần reload.

---

## 5. Giỏ hàng (`/gio-hang`)

**Bố cục**:
- Danh sách item: ảnh, tên, biến thể, đơn giá, quantity stepper (+/-), nút xóa
- Ô nhập mã giảm giá (nếu chưa đăng nhập → ẩn hoặc disable + tooltip "Đăng nhập để dùng điểm/giảm giá")
- Nếu đã đăng nhập: hiển thị điểm hiện có, checkbox "Dùng điểm để giảm giá" kèm số tiền quy đổi
- Tổng tạm tính, phí ship (nếu có), tổng cộng
- Nút "Tiến hành đặt hàng" → điều hướng `/thanh-toan`

**Trạng thái**:
- Giỏ trống: hiện illustration + CTA "Tiếp tục mua sắm"
- Sản phẩm trong giỏ hết hàng lúc checkout (do người khác mua hết) → cảnh báo đỏ ngay trong item đó, không cho checkout tới khi xóa/sửa

**Lưu ý kỹ thuật**: giỏ hàng cho guest lưu ở `localStorage`, khi login thì merge với giỏ hàng server (nếu có).

---

## 6. Checkout (`/thanh-toan`)

**Bố cục** (form 1 trang, chia section rõ ràng):
1. **Thông tin người nhận**
   - Guest: Họ tên, SĐT, Địa chỉ (text input + optional chọn Tỉnh/Huyện/Xã), Ghi chú
   - Logged-in: chọn địa chỉ có sẵn (radio list) hoặc "+ Thêm địa chỉ mới"
2. **Review đơn hàng**: danh sách sản phẩm, số lượng, giá (read-only, link "Sửa giỏ hàng")
3. **Áp dụng ưu đãi** (nếu login): mã giảm giá / điểm tích lũy
4. **Tổng thanh toán**
5. Nút "Xác nhận đặt hàng" → gọi API tạo order → redirect `/thanh-toan/qr/[orderId]`

**Validate**: SĐT bắt buộc đúng định dạng VN, địa chỉ bắt buộc, tên bắt buộc.

---

## 7. Payment QR (`/thanh-toan/qr/[orderId]`)

**Đây là màn hình quan trọng nhất — cần UX rõ ràng, tránh khách bối rối.**

**Bố cục**:
- Mã QR ngân hàng (ảnh QR, hiển thị to, dễ quét)
- Thông tin chuyển khoản hiển thị rõ + nút "Copy":
  - Ngân hàng, số tài khoản, chủ tài khoản
  - Số tiền (đúng số, không làm tròn)
  - Nội dung chuyển khoản = **mã đơn hàng** (bắt buộc đúng để hệ thống match tự động)
- Đồng hồ đếm ngược thời gian giữ đơn (vd 15:00 → 00:00)
- Trạng thái hiện tại: badge "Đang chờ thanh toán" (màu vàng)
- Text hướng dẫn: "Sau khi chuyển khoản, hệ thống sẽ tự động xác nhận trong vài giây"

**Realtime (bắt buộc dùng Socket.IO ở đây)**:
- Client join room `order:{orderId}` ngay khi vào trang
- Lắng nghe event `order:paid` → tự động chuyển trạng thái UI sang "Đã thanh toán ✅" + redirect sau 2s tới `/don-hang/thanh-cong/[orderId]`
- Lắng nghe event `order:expired` → hiện thông báo "Đơn hàng đã hết hạn" + nút "Đặt lại đơn"
- Fallback: nếu socket disconnect, vẫn có nút "Tôi đã chuyển khoản, kiểm tra lại" gọi API polling 1 lần

---

## 8. Order Success (`/don-hang/thanh-cong/[orderId]`)

- Icon thành công + lời cảm ơn
- Hiển thị **mã đơn hàng** to, rõ, kèm nút Copy (đặc biệt quan trọng với khách **chưa đăng nhập** vì đây là cách duy nhất họ tra cứu sau này)
- Nếu guest: nhắc nhở "Lưu lại mã này để tra cứu đơn hàng tại [link tra cứu]"
- Nếu logged-in: nút "Xem đơn hàng của tôi"
- Nút "Tiếp tục mua sắm"

---

## 9. Tra cứu đơn hàng (`/tra-cuu-don-hang`) — cho guest

- Form: mã đơn hàng + SĐT
- Sau khi submit → hiển thị chi tiết đơn:
  - Thông tin đơn, sản phẩm, tổng tiền
  - Timeline trạng thái (dạng stepper ngang hoặc dọc): Chờ thanh toán → Đã thanh toán → Đang đóng gói → Đang giao → Hoàn tất
- **Realtime**: join room `order:{orderId}` để timeline tự cập nhật nếu admin đổi trạng thái trong lúc khách đang xem trang

---

## 10. Auth: Login / Register / Forgot password

- Login: Email/SĐT + mật khẩu, hoặc OTP qua SĐT
- Register: Tên, SĐT/email, mật khẩu, xác nhận mật khẩu, OTP verify
- Forgot password: nhập SĐT/email → OTP → đặt mật khẩu mới
- Sau login thành công: merge giỏ hàng guest (nếu có) vào tài khoản

---

## 11. My Account (`/tai-khoan`)

**Layout chung**: sidebar tab (desktop) / tab ngang scroll (mobile): Tổng quan, Đơn hàng, Địa chỉ, Điểm thưởng, Thông tin cá nhân

### 11.1 Tổng quan
- Thông tin cơ bản, điểm hiện có, đơn hàng gần nhất

### 11.2 Lịch sử đơn hàng (`/tai-khoan/don-hang`)
- Danh sách đơn, filter theo trạng thái
- Click vào → `/tai-khoan/don-hang/[id]` xem chi tiết + timeline realtime (join room `order:{id}` như mục 9)

### 11.3 Sổ địa chỉ (`/tai-khoan/dia-chi`)
- CRUD địa chỉ, đặt địa chỉ mặc định

### 11.4 Điểm thưởng (`/tai-khoan/diem-thuong`)
- Số điểm hiện tại
- Lịch sử tích/tiêu điểm (bảng: ngày, đơn hàng liên quan, +/- điểm)
- Bảng quy đổi điểm → giảm giá

---

## 12. Blog

### 12.1 Blog Listing (`/blog`)
- Grid bài viết: thumbnail, tiêu đề, mô tả ngắn, ngày đăng, tag
- Filter theo tag
- Search
- Phân trang (SSR, không infinite scroll — tốt hơn cho SEO crawl)

### 12.2 Blog Detail (`/blog/[slug]`)
- Breadcrumb (SEO)
- Nội dung render từ HTML/Markdown (heading chuẩn h1-h3, ảnh có alt)
- Nếu bài viết có gắn sản phẩm liên quan → hiển thị `ProductCard` inline hoặc block cuối bài
- Bài viết liên quan (internal link)
- Social share button
- Meta title/description lấy từ CMS field riêng (không tự generate từ content)

---

## 13. Layout chung (Header/Footer) — mục 9 tham chiếu

**Header**:
- Logo, thanh search (optional), icon giỏ hàng (badge số lượng), icon tài khoản
- Menu: Trang chủ / Sản phẩm (dropdown category) / Blog / Giới thiệu / Liên hệ
- Nếu chưa login: nút "Đăng nhập"
- Mobile: hamburger menu

**Footer**:
- Thông tin shop, link social (TikTok, Zalo, Facebook)
- Chính sách (đổi trả, vận chuyển, thanh toán)
- Link tra cứu đơn hàng (đặt dễ thấy vì nhiều khách sẽ quay lại tìm)

---

## 14. Socket.IO — events client cần lắng nghe/emit (contract giả định, confirm lại với BE)

| Event | Chiều | Payload (ví dụ) | Dùng ở màn hình |
|---|---|---|---|
| `join:product` | client → server | `{ productId }` | Product Listing, Product Detail |
| `stock:update` | server → client | `{ productId, stockLeft }` | Product Listing, Product Detail |
| `join:order` | client → server | `{ orderId }` | Payment QR, Order Lookup, Order Detail |
| `order:paid` | server → client | `{ orderId, paidAt }` | Payment QR |
| `order:status_changed` | server → client | `{ orderId, status, updatedAt }` | Order Lookup, Order Detail |
| `order:expired` | server → client | `{ orderId }` | Payment QR |

> Client cần xử lý reconnect: khi socket mất kết nối và reconnect lại, phải tự động `join:order`/`join:product` lại theo context trang hiện tại.

---

## 15. Ghi chú cho Agent khi code

1. Ưu tiên implement theo thứ tự: **Layout chung → Home → Product Listing/Detail → Cart → Checkout → Payment QR → Order Success/Lookup → Auth → My Account → Blog**.
2. Mỗi màn hình cần: responsive (mobile-first), loading state, empty state, error state.
3. Không hardcode dữ liệu — dùng mock API/service layer riêng để dễ swap sang API thật.
4. Đặt tên component/route theo đúng slug tiếng Việt ở mục 1 (SEO-friendly URL).
5. Tách riêng `socket.ts` (khởi tạo 1 instance socket dùng chung toàn app) — không tạo connection mới ở mỗi component.
6. Toàn bộ trang public bắt buộc set `<title>` và `<meta name="description">` riêng — không dùng chung 1 meta mặc định.
