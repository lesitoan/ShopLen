# Socket Flow — Contract Socket.IO cho toàn dự án

> Gom lại toàn bộ event Socket.IO đã rải rác trong `clientUiSpec.md` / `adminUiSpec.md` thành
> 1 bảng duy nhất để `api/`, `fe-client/`, `fe-admin/` cùng tham chiếu, tránh đặt tên event lệch nhau.

---

> CẬP NHẬT V1: Product v1 không dùng variant tồn kho riêng. Event tồn kho chỉ cần `productId`, `stockQuantity` hoặc `stockLeft`, và `status`. Nếu ví dụ cũ có `variantId`, xem đó là optional legacy, không bắt buộc implement v1.

## 1. Nguyên tắc chung

- 1 kết nối socket duy nhất mỗi app (không tạo nhiều connection ở nhiều component) — quản lý qua `hooks/useSocket.ts` (client) / `hooks/useSocketAdmin.ts` (admin) và `sockets/socketServer.ts` (api).
- Dùng **room** để giới hạn phạm vi nhận event, không broadcast toàn bộ:
  - `product:{productId}` — ai đang xem sản phẩm đó thì join
  - `order:{orderId}` — ai đang xem đơn đó (khách hoặc admin) thì join
  - `adminRoom` — tất cả admin đang online join chung 1 room để nhận thông báo tổng
- Khi socket reconnect (mất mạng, F5 SPA...), FE phải tự động join lại đúng room theo context trang hiện tại.
- Redis adapter bắt buộc dùng ở BE nếu sau này scale nhiều instance API (dù hiện traffic thấp, setup sẵn để không phải sửa lại kiến trúc sau).

---

## 2. Bảng event — Client (`fe-client`)

| Event | Chiều | Room | Payload | Dùng ở màn hình | Xử lý khi nhận |
|---|---|---|---|---|---|
| `joinProduct` | client → server | — | `{ productId }` | `productListing`, `productDetail` | server add socket vào room `product:{productId}` |
| `stockUpdate` | server → client | `product:{id}` | `{ productId, variantId?, stockLeft }` | `productListing`, `productDetail` | cập nhật số tồn kho hiển thị, disable nút mua nếu về 0 |
| `joinOrder` | client → server | — | `{ orderId }` | `paymentQr`, `orderLookup`, `account/orderDetail` | server add socket vào room `order:{orderId}` |
| `orderPaid` | server → client | `order:{id}` | `{ orderId, paidAt }` | `paymentQr` | đổi badge "Đang chờ" → "Đã thanh toán ✅", tự redirect sang `orderSuccess` sau ~2s |
| `orderStatusChanged` | server → client | `order:{id}` | `{ orderId, status, updatedAt }` | `orderLookup`, `account/orderDetail` | cập nhật timeline trạng thái không cần F5 |
| `orderExpired` | server → client | `order:{id}` | `{ orderId }` | `paymentQr` | hiện thông báo hết hạn + nút "Đặt lại đơn" |

---

## 3. Bảng event — Admin (`fe-admin`)

| Event | Chiều | Room | Payload | Dùng ở màn hình | Xử lý khi nhận |
|---|---|---|---|---|---|
| `joinAdmin` | client → server | — | `{ adminId }` | toàn bộ admin sau khi login | server add socket vào `adminRoom` |
| `orderCreated` | server → client | `adminRoom` | `{ orderId, orderCode, customerName, total }` | `dashboard`, `orders/list` | thêm dòng mới đầu bảng (highlight ngắn), tăng badge chuông thông báo, phát âm thanh (nếu bật) |
| `orderPaid` | server → client | `adminRoom` | `{ orderId, orderCode, amount, paidAt }` | `dashboard`, `orders/list`, `orders/detail` | cập nhật badge trạng thái, thêm vào notification dropdown |
| `orderStatusChanged` | server → client | `order:{id}` (nếu 2 admin cùng mở 1 đơn) | `{ orderId, status }` | `orders/detail` | đồng bộ trạng thái nếu admin khác vừa đổi |
| `stockLow` | server → client | `adminRoom` | `{ productId, productName, stockLeft }` | `dashboard` | thêm vào danh sách "sản phẩm sắp hết hàng" |

---

## 4. Ai emit các event này (phía `api/`)

| Event | Emit từ (service nào) | Khi nào |
|---|---|---|
| `stockUpdate` | `productService` (sau khi trừ/cộng tồn kho) | Ngay sau khi đơn được tạo (reserve) hoặc hủy (release) |
| `orderPaid` | `orderService.confirmPayment()` | Sau khi webhook thanh toán match thành công HOẶC admin xác nhận thủ công |
| `orderStatusChanged` | `orderService.updateStatus()` | Mỗi lần admin đổi trạng thái đơn |
| `orderExpired` | `orderExpiryJob` (cron/BullMQ) | Khi đơn quá thời gian giữ mà chưa thanh toán |
| `orderCreated` | `orderService.createOrder()` | Ngay sau khi tạo đơn thành công |
| `stockLow` | `productService` | Khi tồn kho 1 biến thể giảm xuống dưới ngưỡng cấu hình (mặc định đề xuất: < 5) |

> Toàn bộ việc emit này nên đi qua **event emitter nội bộ** trước (vd `orderService` bắn `order.paid` nội bộ), rồi 1 listener riêng (`sockets/orderSocket.ts`) mới thật sự gọi `io.to(room).emit(...)` — tách biệt business logic khỏi tầng realtime, đồng thời chỗ này cũng là nơi gọi `telegramService.notify()` song song (xem thêm luồng ở `mvcApiStructure.md` mục "Luồng xử lý 1 request theo MVC").

---

## 5. Ghi chú cho Agent

- Tên event dùng camelCase, khớp đúng chính tả ở bảng trên tại cả 3 source — sai chính tả 1 ký tự là mất kết nối event, không có type-check nào bắt lỗi này vì không dùng shared-types.
- FE luôn `socket.off(eventName)` khi unmount component để tránh nhận trùng event khi component re-mount (đặc biệt Next.js Strict Mode dev).
- Khi thêm event mới, cập nhật cả bảng ở file này lẫn code — không thêm event ngầm chỉ có trong code mà không ghi lại đây.
