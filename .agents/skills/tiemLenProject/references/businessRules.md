# Business Rules — Luật nghiệp vụ cốt lõi

> ⚠️ Các con số trong file này là **giá trị mặc định đề xuất**, chưa phải quyết định cuối cùng
> của chủ shop. Agent code có thể dùng tạm các số này để implement (đưa thành **config có thể
> chỉnh trong `/admin/cauHinh`**, không hardcode cứng trong code), nhưng phải hỏi lại user để
> chốt số liệu thật trước khi vận hành chính thức.

---

## 1. Giữ đơn & hết hạn thanh toán

- Thời gian giữ đơn trước khi tự hủy: **15 phút** (đề xuất, có thể chỉnh 10-30 phút)
- Sau khi hết hạn: tự động release tồn kho đã reserve, đổi status → `cancelled`, gửi `orderExpired` qua socket
- Cấu hình này lưu ở bảng settings BE, đọc qua `GET /admin/settings`, không hardcode số phút trong code

## 2. Reserve tồn kho (chống oversell)

- Khi khách tạo đơn (`POST /orders`) → **trừ tạm** tồn kho ngay lúc đó (reserve), không đợi thanh toán xong mới trừ
- Nếu đơn hết hạn/hủy → **cộng lại** đúng số lượng đã reserve
- Nếu đơn thanh toán thành công → tồn kho giữ nguyên trạng thái đã trừ (không trừ thêm lần 2)
- Thao tác trừ/cộng tồn kho phải dùng transaction + lock (optimistic hoặc pessimistic locking) để tránh 2 khách cùng đặt 1 sản phẩm cuối cùng mà cả 2 đều thành công

## 3. Tích điểm & quy đổi

- Tỷ lệ tích điểm: **1.000đ = 1 điểm** (đề xuất), tính trên giá trị đơn hàng **sau khi trừ giảm giá**, chỉ tích khi đơn ở trạng thái `completed` (không tích ngay lúc đặt, tránh trường hợp hủy đơn vẫn giữ điểm)
- Tỷ lệ quy đổi: **100 điểm = 10.000đ giảm giá** (đề xuất)
- Điều kiện tối thiểu để dùng điểm: đơn hàng tối thiểu **100.000đ** (đề xuất), không giới hạn số điểm tối đa dùng 1 lần (có thể bổ sung giới hạn % giảm tối đa nếu cần, vd không giảm quá 50% giá trị đơn)
- Điểm dùng cho đơn nào mà đơn đó bị hủy sau khi thanh toán (hoàn tiền) → hoàn lại điểm đã dùng, trừ lại điểm đã tích (nếu có)

## 4. Mã giảm giá (Promotion)

- Mỗi mã có: % hoặc số tiền cố định, đơn tối thiểu áp dụng, ngày bắt đầu/kết thúc, số lượt dùng tối đa (tổng và/hoặc theo user)
- 1 đơn hàng chỉ áp dụng **1 mã giảm giá**, không cộng dồn nhiều mã
- Mã giảm giá và điểm tích lũy **được cộng dồn** với nhau (áp mã trước, dùng điểm giảm tiếp phần còn lại) — cần xác nhận lại với user nếu muốn giới hạn khác

## 5. Phí vận chuyển

- Mặc định đề xuất: **25.000đ toàn quốc, đồng giá** (đơn giản cho MVP, không tính theo khu vực/cân nặng)
- Có thể cấu hình miễn phí ship khi đơn đạt ngưỡng (vd đề xuất từ 300.000đ) — cần user xác nhận có áp dụng hay không

## 6. Trạng thái đơn hàng (Order Status) — enum chuẩn dùng xuyên suốt

```
pending    → Chờ xác nhận   (vừa tạo đơn, chưa thanh toán)
paid       → Đã thanh toán  (khớp thanh toán, tự động hoặc thủ công)
packing    → Đang xử lý     (đang đóng gói)
shipping   → Đang giao
completed  → Hoàn thành
cancelled  → Đã hủy         (hết hạn thanh toán HOẶC admin/khách hủy)
```
> Đúng 6 giá trị này, khớp với badge màu đã định nghĩa ở `designSystem.md` mục 8. Không tự thêm trạng thái trung gian khác nếu chưa thống nhất — vì mỗi trạng thái mới cần cập nhật đồng thời ở cả `fe-client`, `fe-admin`, `api`.

## 7. Guest checkout & tra cứu đơn

- Định danh đơn của guest: cặp **mã đơn hàng (orderCode) + số điện thoại** — cả 2 phải khớp mới xem được chi tiết đơn (tránh việc chỉ cần đoán mã đơn là xem được thông tin người khác)
- Mã đơn hàng format đề xuất: `NK` + 6 số tăng dần hoặc timestamp rút gọn (vd `NK100523`) — không dùng UUID vì khó đọc/khó nói qua điện thoại khi khách gọi hỏi shop

## 8. Xác nhận thanh toán

- Ưu tiên tự động qua webhook (SePay/Casso) match theo `transferContent = orderCode` và `transferAmount = tổng tiền đơn`
- Nếu số tiền chuyển khoản **không khớp chính xác** (thừa/thiếu) → **không tự động confirm**, chuyển sang hàng đợi để admin xử lý thủ công (tránh tự động hoá sai khi có sai lệch tiền bạc)
- Idempotency: mỗi giao dịch webhook có `referenceCode` riêng từ ngân hàng, lưu lại để không xử lý trùng nếu webhook gọi lại nhiều lần (retry)

## 9. Audit log (dành cho hành động ảnh hưởng tiền/tồn kho)

Bắt buộc ghi log các hành động sau (ai, lúc nào, giá trị trước/sau):
- Admin xác nhận thanh toán thủ công
- Admin điều chỉnh điểm tích lũy của khách
- Admin đổi tồn kho thủ công
- Admin hủy đơn hàng (kèm lý do)

## 10. Ghi chú cho Agent

- Toàn bộ số liệu ở mục 1, 3, 5 phải đọc từ bảng cấu hình (`GET /admin/settings`), **không hardcode** trong `services/` — vì đây là số dễ đổi theo thực tế kinh doanh, hardcode sẽ phải sửa code + deploy lại mỗi lần đổi chính sách.
- Trước khi go-live, nhắc user xác nhận lại toàn bộ số liệu đề xuất ở file này (đặc biệt mục 1, 3, 5, 8) vì ảnh hưởng trực tiếp tới tiền thật.
