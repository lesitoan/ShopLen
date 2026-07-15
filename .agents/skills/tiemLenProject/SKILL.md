---
name: tiemLenProject
description: Quy ước và đặc tả kỹ thuật cho dự án website bán móc khóa len "Tiệm Len Nhà Kiều" (2 source FE độc lập - fe-client, fe-admin - và 1 API theo MVC). Dùng skill này bất cứ khi nào tạo, sửa, review code hoặc file/folder trong 3 source này; khi cần đặt tên file/folder/biến; khi code màn hình FE (client hoặc admin); khi code route/controller/service API; khi cần biết màu sắc/spacing/component UI; khi cần biết field API trả về gì hoặc event socket nào; hoặc khi có bất kỳ câu hỏi nào về cấu trúc, quy tắc, luồng nghiệp vụ của dự án này.
---

# Tiệm Len Nhà Kiều — Skill quy ước dự án

## Bối cảnh dự án

Website bán móc khóa len handmade (hoa, quà sinh nhật, động vật...), chạy song song với kênh TikTok đang có traffic (~30-50 khách/ngày). Đặc điểm nghiệp vụ chính:
- 100% đơn hàng thanh toán trước qua QR chuyển khoản ngân hàng
- Khách có thể mua **không cần đăng nhập** (guest, tra cứu đơn qua mã đơn + SĐT) hoặc **đăng nhập** để tích điểm/giảm giá
- Có blog để tối ưu SEO, kéo traffic organic
- Áp dụng Socket.IO cho các luồng real-time (trạng thái đơn hàng, tồn kho) và Telegram bot để admin nhận thông báo đơn mới — đây là 2 điểm kỹ thuật ưu tiên đầu tư vì mục đích vừa chạy thực tế vừa làm đẹp CV backend.

## Cấu trúc dự án (3 source độc lập, không share code)

```
fe-client/     → website khách hàng (storefront)
fe-admin/      → dashboard quản trị
api/           → backend, theo MVC (routes/controllers/services/models)
```

**`fe-client` và `fe-admin` không dùng chung bất kỳ package/component/type nào.** Mỗi source tự có `components/`, `hooks/`, `constants/`, `types/` riêng. Không tạo `packages/shared-*` giữa 2 FE hay giữa FE-API.

## Quy tắc bất biến (áp dụng mọi lúc, không cần mở references)

1. **Đặt tên: camelCase cho tất cả** thư mục, file, biến, hàm — không dùng kebab-case, không dùng snake_case (trừ tên cột DB, ORM tự map). Component React vẫn export tên PascalCase nhưng **tên file** chứa nó là camelCase (vd file `productCard.tsx` chứa `export default function ProductCard()`).
2. **API theo MVC rõ ràng**: `routes/` chỉ định nghĩa endpoint → `controllers/` nhận request/validate cơ bản → `services/` chứa business logic thật → `models/` là entity/schema. Controller không tự viết logic, route không tự gọi DB.
3. **Tách biệt Constants khỏi Component**: Không khai báo các biến hằng số (constants), cấu hình tĩnh, hoặc dữ liệu mock lớn trực tiếp trong component. Nếu dùng riêng cho component ở thư mục đó, đặt trong file `constants.ts` cùng cấp. Nếu là hằng số dùng chung toàn web, đặt tại `src/constants/index.ts` (hoặc các file con thuộc thư mục `constants/` nếu dữ liệu nhiều).
4. **Trong FE, `app/**/page.tsx` chỉ làm 2 việc**: định nghĩa route + render component từ `screens/`. Toàn bộ logic/state/sub-component riêng 1 màn nằm trong `screens/<tenMan>/`. Cái gì dùng chung ≥ 2 màn mới đưa lên `components/`, `hooks/` gốc.
5. **UI phải bám đúng design token** đã định nghĩa (màu, spacing, radius, typography) — không tự chế màu/size ngoài token.
6. **Responsive cho Modal/Drawer**: Trên di động (mobile), các modal/drawer phụ (như Tìm kiếm, Giỏ hàng) phải chiếm 100% chiều ngang (full width) và trượt từ dưới lên (style Bottom Sheet) đi kèm thanh kéo drag handle và lớp phủ làm mờ nền. Trên máy tính (desktop), hiển thị dạng Popover nổi nằm ngay dưới/bên cạnh icon mà không làm mờ nền.
7. **Thư mục Modals chức năng**: Các modal chức năng (Tìm kiếm, Giỏ hàng, Đăng nhập, Voucher...) phải đặt trong thư mục `components/modals/`. Mỗi modal được viết trong 1 file duy nhất chứa cả Desktop Popover và Mobile Bottom Sheet (sử dụng các responsive utility class của Tailwind để ẩn/hiện song song).
8. **Cấm sử dụng Emoji/Icon trong chuỗi văn bản**: Tuyệt đối không sử dụng các biểu tượng cảm xúc (emoji/icon dạng text như 🔥, ✨, 🏆, 🎁, 🎉, 🔒...) trực tiếp trong các chuỗi ký tự hiển thị (text string). Không tự ý chèn thêm biểu tượng vector (như Lucide icons) hay hình ảnh kế bên văn bản trừ khi có yêu cầu cụ thể từ khách hàng. Văn bản hiển thị phải là text thuần túy, sạch sẽ.
9. **Không chạy build sau mỗi lần sửa**: Tiết kiệm tài nguyên và thời gian bằng việc không chạy lệnh build dự án (`npm run build` hoặc `next build`) sau mỗi lần sửa đổi code nhỏ. Tin tưởng vào trình hot-reload của dev server, chỉ thực hiện chạy build ở bước kiểm tra nghiệm thu hoặc đóng gói cuối cùng.
10. **Không viết comment giải thích UI**: Không chèn các comment giải thích các phần tử HTML/JSX hoặc cấu trúc layout cơ bản (ví dụ: cấm chèn `{/* Logo Section */}`, `{/* Main Container */}`, `{/* Button */}`). Chỉ viết comment giải thích đối với các đoạn logic, thuật toán phức tạp, xử lý sự kiện đặc biệt hoặc dòng code khó hiểu để giữ mã nguồn luôn sạch sẽ.

## Bảng con trỏ — đọc file nào khi đang làm gì

| Đang làm gì | Đọc file |
|---|---|
| Code/sửa màn hình phía `fe-client` | `references/clientUiSpec.md` |
| Code/sửa màn hình phía `fe-admin` | `references/adminUiSpec.md` |
| Cần màu sắc, typography, spacing, hoặc spec 1 component UI (Button, Input, Modal, Toast...) | `references/designSystem.md` |
| Tạo file/folder mới, đặt tên biến/hàm/class, phân vân snake vs camel | `references/namingConvention.md` (đã gộp trong `mvcApiStructure.md`, xem mục 1) |
| Code route/controller/service/model cho `api/`, hoặc cần biết luồng xử lý 1 request | `references/mvcApiStructure.md` |
| Tạo cấu trúc thư mục gốc cho 1 trong 3 source, phân vân screens/ vs components/ | `references/sourceStructure.md` |
| Cần biết endpoint API, request/response mẫu, mã lỗi | *(chưa có — hỏi user hoặc tạo `references/apiContract.md` trước khi code nếu chưa tồn tại)* |
| Cần biết event Socket.IO nào bắn lúc nào, ai lắng nghe, payload gì | *(chưa có — tham khảo phần Socket.IO rải rác trong `clientUiSpec.md`/`adminUiSpec.md` mục events, hoặc tạo `references/socketFlow.md` nếu cần gom lại)* |
| Cần biết luật nghiệp vụ (thời gian giữ đơn, công thức tích điểm, điều kiện dùng điểm, quy tắc reserve tồn kho) | *(chưa có — hỏi user để chốt số liệu cụ thể trước khi code, đừng tự bịa con số)* |

## Nguyên tắc khi thiếu thông tin

Nếu cần 1 con số/luật nghiệp vụ cụ thể chưa được định nghĩa ở đâu trong `references/` (vd: % tích điểm, số phút giữ đơn, phí ship) — **hỏi lại user để chốt**, không tự giả định rồi code cứng, vì đây là số liệu ảnh hưởng trực tiếp tới tiền và trải nghiệm khách hàng thật.

## Danh sách file trong `references/`

- `clientUiSpec.md` — toàn bộ màn hình, bố cục, component, trạng thái của `fe-client`
- `adminUiSpec.md` — toàn bộ màn hình, bố cục, component, trạng thái của `fe-admin`
- `designSystem.md` — design token (màu/typography/spacing/radius) + spec 18 nhóm component UI
- `mvcApiStructure.md` — quy ước đặt tên camelCase toàn dự án + cấu trúc MVC chi tiết cho `api/`
- `sourceStructure.md` — cây thư mục đầy đủ `fe-client`/`fe-admin` theo pattern `app/` + `screens/`
