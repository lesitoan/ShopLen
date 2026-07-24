---
name: tiemLenProject
description: Quy ước và đặc tả kỹ thuật cho dự án website bán móc khóa len "Tiệm Len Nhà Kiều" (2 source FE độc lập - fe-client, fe-admin - và 1 API theo MVC). Dùng skill này bất cứ khi nào tạo, sửa, review code hoặc file/folder trong 3 source này; khi cần đặt tên file/folder/biến; khi code màn hình FE (client hoặc admin); khi code route/controller/service API; khi cần biết màu sắc/spacing/component UI; khi cần biết field API trả về gì hoặc event socket nào; hoặc khi có bất kỳ câu hỏi nào về cấu trúc, quy tắc, luồng nghiệp vụ của dự án này.
---

# Tiệm Len Nhà Kiều — Skill quy ước dự án

## Bối cảnh dự án

Website bán móc khóa len handmade (hoa, quà sinh nhật, động vật...), chạy song song với kênh TikTok đang có traffic (~30-50 khách/ngày). Đặc điểm nghiệp vụ chính:
- 100% đơn hàng thanh toán trước qua QR chuyển khoản ngân hàng
- V1 yêu cầu khách **đăng nhập mới được mua hàng**; không hỗ trợ guest checkout và không có API cart
- Có blog để tối ưu SEO, kéo traffic organic
- Áp dụng Socket.IO cho các luồng real-time (trạng thái đơn hàng, tồn kho) và Telegram bot để admin nhận thông báo đơn mới — đây là 2 điểm kỹ thuật ưu tiên đầu tư vì mục đích vừa chạy thực tế vừa làm đẹp CV backend.

## Quyết định API v1 hiện hành (ưu tiên hơn reference cũ)

Khi làm API hoặc chỉnh contract, ưu tiên file `api/docs/apiImplementationPlanV1.md` nếu tồn tại. Các quyết định v1 đã chốt:

- Cart lưu `localStorage` ở client, API chỉ nhận items khi checkout.
- Checkout bắt buộc đăng nhập customer; `orders.customerId` bắt buộc và lấy từ JWT, không nhận từ body.
- Customer auth dùng email/password và Google login trong cùng bảng `customers`: `isManualLogin`, `isGoogleLogin`, `googleAccountId`; không tạo bảng social provider riêng.
- Customer profile `phone` optional, nhưng phone người nhận trong order vẫn bắt buộc để giao hàng/liên hệ.
- Không làm promotions, settings table, banner/hero API trong v1.
- Config v1 lấy từ env/config: Google client id, Cloudinary, VietQR/bank, ship fee, order hold minutes, Telegram.
- Product bỏ `isFeatured`, bỏ rating sao, bỏ bảng badge riêng trong v1; dùng `highlightType?: "HOT_PRODUCT" | "TODAY_DEAL" | "HOT_TIKTOK"`.
- Product images tách bảng `productImages`, thumbnail đánh dấu bằng `isThumbnail`.
- Product options dùng một bảng `productOptions`; mỗi sản phẩm có 0-2 option, hiện chỉ `COLOR` và `SIZE`, values lưu `jsonb`.
- Order item lưu `productSnapshot` bằng `jsonb` để đơn cũ không phụ thuộc product hiện tại.
- Error response không có `details`; có `internalMessage?` chỉ ở dev/test.
- API v1 mount dưới `/api/v1`.
- Trong `api/src`, dùng path alias `@/*` trỏ tới `src/*` cho mọi import nội bộ; tránh import tương đối dài như `../../utils/...`.
- `routes/`, `controllers/`, `services/`, `dto/` tách nhánh `admin/` và `client/` khi domain có thể phân biệt theo trang quản trị và storefront.
- `dto/` chứa request/response schema hoặc DTO theo API contract; `types/` chứa type nội bộ dùng chung, không phải entity DB. Entity/schema DB vẫn nằm trong `models/`.

## Cấu trúc dự án (3 source độc lập, không share code)

```
fe-client/     → website khách hàng (storefront)
fe-admin/      → dashboard quản trị
api/           → backend, theo MVC (routes/controllers/services/models/dto/types)
```

**`fe-client` và `fe-admin` không dùng chung bất kỳ package/component/type nào.** Mỗi source tự có `components/`, `hooks/`, `constants/`, `types/` riêng. Không tạo `packages/shared-*` giữa 2 FE hay giữa FE-API.

## Quy chuẩn cấu trúc Call API bằng RTK Query & Redux Toolkit (FE Client & FE Admin)

1. **Một `baseApi.ts` duy nhất (`src/services/api/baseApi.ts`)**:
   - Sử dụng `createApi` với `fetchBaseQuery` khai báo `baseUrl: process.env.NEXT_PUBLIC_API_URL`.
   - `prepareHeaders` tự động chèn `Authorization: Bearer <token>` từ Redux State.
   - Khai báo đầy đủ `tagTypes: ["Product", "Category", "Order", "User", "Customer", "Banner"]` phục vụ cơ chế tự động re-fetch/invalidates cache.
2. **Inject Endpoints theo Feature Domain**:
   - Chia nhỏ file API theo miền dữ liệu: `productApi.ts`, `categoryApi.ts`, `orderApi.ts`, `authApi.ts`, `bannerApi.ts`.
   - Sử dụng `baseApi.injectEndpoints()` để định nghĩa các builder query/mutation.
3. **Phân định rõ ràng 2 loại State trong FE**:
   - **Server State**: Do RTK Query quản lý hoàn toàn (tự động cache, tự động re-fetch).
   - **Client Local State**: Do Redux Slices (`src/store/slices/`) quản lý (`cartSlice` lưu LocalStorage qua Redux middleware, `authSlice` lưu thông tin user/token).
4. **Quy tắc gọi trong Screen Component**:
   - Các màn hình tại `src/screens/<ten-man>/` chỉ được import và sử dụng trực tiếp các Auto-Generated React Hooks sinh ra từ RTK Query (ví dụ: `useGetProductsQuery()`, `useCreateOrderMutation()`). Tuyệt đối không tự viết lệnh `fetch` hay `axios` trực tiếp trong UI components.

## Quy tắc bất biến (áp dụng mọi lúc, không cần mở references)

1. **Đặt tên**: Sử dụng **camelCase** cho tất cả thư mục, biến, hàm, và các tệp tin không chứa giao diện UI (như helper, service, controller, route, constants) — không dùng kebab-case hay snake_case (trừ tên cột DB). Đối với các **tệp tin component UI (React components)**, bắt buộc phải đặt tên tệp theo định dạng **PascalCase** (ví dụ: `Button.tsx`, `Header.tsx`, `SearchModal.tsx`). Đối với các giá trị **Enum** hoặc các hằng số chế độ/trạng thái (**Enum / Union Type string values** như `AuthViewMode`, `OrderStatus`), bắt buộc phải sử dụng định dạng **UPPER_SNAKE_CASE** (ví dụ: `"LANDING"`, `"LOGIN"`, `"REGISTER"`, `"FORGOT_PASSWORD"`, `"PENDING_PAYMENT"`).
2. **API theo MVC rõ ràng**: `routes/` chỉ định nghĩa endpoint → `controllers/` nhận request/validate cơ bản → `services/` chứa business logic thật → `models/` là entity/schema. `dto/` chứa request/response schema/type, `types/` chứa type nội bộ dùng chung. Controller không tự viết logic, route không tự gọi DB.
3. **Tách biệt Constants khỏi Component**: Không khai báo các biến hằng số (constants), cấu hình tĩnh, dữ liệu mappers/options dùng chung hoặc dữ liệu mock lớn trực tiếp trong component. Nếu là hằng số/mock data chỉ dùng riêng cho 1 màn hình, đặt trong file `constants.ts` cùng cấp màn hình đó. Nếu là hằng số/mapper/config dùng chung cho nhiều màn hình (ví dụ: mappers trạng thái đơn hàng `orders.ts`, options danh mục, loại thanh toán...), bắt buộc phải đặt tại thư mục `/src/constants/` chung (như `src/constants/orders.ts`, `src/constants/mappers.ts`...).
4. **Trong FE, `app/**/page.tsx` chỉ làm 2 việc**: định nghĩa route + render component từ `screens/`. Toàn bộ logic/state/sub-component riêng 1 màn nằm trong `screens/<tenMan>/`. Cái gì dùng chung ≥ 2 màn mới đưa lên `components/`, `hooks/` gốc.
5. **UI phải bám đúng design token** đã định nghĩa (màu, spacing, radius, typography) — không tự chế màu/size ngoài token.
6. **Responsive cho Modal/Drawer**: Trên di động (mobile), các modal/drawer phụ (như Tìm kiếm, Giỏ hàng) phải chiếm 100% chiều ngang (full width) và trượt từ dưới lên (style Bottom Sheet) đi kèm thanh kéo drag handle và lớp phủ làm mờ nền. Trên máy tính (desktop), hiển thị dạng Popover nổi nằm ngay dưới/bên cạnh icon mà không làm mờ nền.
7. **Thư mục Modals chức năng**: Các modal chức năng (Tìm kiếm, Giỏ hàng, Đăng nhập, Voucher...) phải đặt trong thư mục `components/modals/`. Mỗi modal được viết trong 1 file duy nhất chứa cả Desktop Popover và Mobile Bottom Sheet (sử dụng các responsive utility class của Tailwind để ẩn/hiện song song).
8. **Cấm sử dụng Emoji/Icon trong chuỗi văn bản**: Tuyệt đối không sử dụng các biểu tượng cảm xúc (emoji/icon dạng text như 🔥, ✨, 🏆, 🎁, 🎉, 🔒...) trực tiếp trong các chuỗi ký tự hiển thị (text string). Không tự ý chèn thêm biểu tượng vector (như Lucide icons) hay hình ảnh kế bên văn bản trừ khi có yêu cầu cụ thể từ khách hàng. Văn bản hiển thị phải là text thuần túy, sạch sẽ.
9. **Không chạy build sau mỗi lần sửa**: Tiết kiệm tài nguyên và thời gian bằng việc không chạy lệnh build dự án (`npm run build` hoặc `next build`) sau mỗi lần sửa đổi code nhỏ. Tin tưởng vào trình hot-reload của dev server, chỉ thực hiện chạy build ở bước kiểm tra nghiệm thu hoặc đóng gói cuối cùng.
10. **Không viết comment giải thích UI**: Không chèn các comment giải thích các phần tử HTML/JSX hoặc cấu trúc layout cơ bản (ví dụ: cấm chèn `{/* Logo Section */}`, `{/* Main Container */}`, `{/* Button */}`). Chỉ viết comment giải thích đối với các đoạn logic, thuật toán phức tạp, xử lý sự kiện đặc biệt hoặc dòng code khó hiểu để giữ mã nguồn luôn sạch sẽ.
11. **Quy tắc đặt thẻ liên kết & điều hướng trong Next.js**:
    - **Dùng `<Link href="...">` từ `next/link`**: Cho tất cả đường dẫn chuyển trang nội bộ (`/san-pham`, `/bai-viet`, `/gioi-thieu`, `/lien-he`, `/faq`, `/tra-cuu-don-hang`, `/tai-khoan`...). Tuyệt đối không dùng thẻ `<a>` chuẩn HTML hay `window.location.href` cho liên kết nội bộ để tránh gây Hard Reload trang và tận dụng cơ chế Pre-fetching/SPA client routing mượt mà.
    - **Dùng `useRouter().push(...)` từ `next/navigation`**: Cho các luồng điều hướng bằng JavaScript (submit form tìm kiếm, sau khi đăng nhập/đăng xuất, chuyển trang tự động). Không dùng `window.location.href = ...`.
    - **Dùng thẻ `<a>` chuẩn HTML nguyên bản**: Chỉ dùng cho 4 trường hợp bắt buộc: (1) Link ra mạng xã hội/ứng dụng ngoài (`zalo.me`, `m.me`, `facebook.com`...) kèm `target="_blank" rel="noopener noreferrer"`; (2) Link giao thức thiết bị (`tel:` gọi điện, `mailto:` gửi mail); (3) Link neo cuộn trang tại chỗ (`href="#id"` cuộn mượt); (4) Link cho thư viện JS nguyên bản (như PhotoSwipe Lightbox xem ảnh).
12. **Hiển thị Tooltip/Title cho Text bị rút gọn (Truncated Text)**: Bắt buộc thêm thuộc tính `title={textFull}` (hoặc component Tooltip) cho tất cả các phần tử văn bản (tên sản phẩm, địa chỉ, mã đơn, tiêu đề...) có nguy cơ bị ẩn/rút gọn bằng `truncate` hoặc `line-clamp-1` do giới hạn chiều rộng UI trên cả `fe-client` và `fe-admin`. Việc này đảm bảo khi người dùng di chuột (hover) vào văn bản bị cắt ngắn, toàn bộ nội dung đầy đủ sẽ tự động hiển thị trong thẻ mô tả popup.

## Bảng con trỏ — đọc file nào khi đang làm gì

| Đang làm gì | Đọc file |
|---|---|
| Code/sửa màn hình phía `fe-client` | `references/clientUiSpec.md` & `references/designSystem.md` |
| Code/sửa màn hình phía `fe-admin` | `references/adminUiSpec.md` & `references/adminDesignSystem.md` |
| Cần màu sắc, typography, spacing, hoặc spec UI Component cho `fe-client` | `references/designSystem.md` |
| Cần dải màu Dark Navy Slate, bo góc, hoặc spec UI Component cho `fe-admin` | `references/adminDesignSystem.md` |
| Tạo file/folder mới, đặt tên biến/hàm/class, phân vân snake vs camel | `references/namingConvention.md` (đã gộp trong `mvcApiStructure.md`, xem mục 1) |
| Code route/controller/service/model cho `api/`, hoặc cần biết luồng xử lý 1 request | `references/mvcApiStructure.md` |
| Tạo cấu trúc thư mục gốc cho 1 trong 3 source, phân vân screens/ vs components/ | `references/sourceStructure.md` |
| Cần biết endpoint API, request/response mẫu, mã lỗi, DB schema V2 | `api/docs/apiImplementationPlanV2.md` |
| Cần biết event Socket.IO nào bắn lúc nào, ai lắng nghe, payload gì | `references/socketFlow.md` |
| Cần biết luật nghiệp vụ (thời gian giữ đơn, công thức tích điểm, quy tắc tồn kho) | `references/businessRules.md` |

## Nguyên tắc khi thiếu thông tin

Nếu cần 1 con số/luật nghiệp vụ cụ thể chưa được định nghĩa ở đâu trong `references/` (vd: % tích điểm, số phút giữ đơn, phí ship) — **hỏi lại user để chốt**, không tự giả định rồi code cứng, vì đây là số liệu ảnh hưởng trực tiếp tới tiền và trải nghiệm khách hàng thật.
