export interface PolicyNavItem {
  href: string;
  label: string;
}

export const POLICY_NAV_ITEMS: PolicyNavItem[] = [
  { href: "/chinh-sach-bao-mat", label: "Chính sách bảo mật" },
  { href: "/dieu-khoan-su-dung", label: "Điều khoản sử dụng" },
  { href: "/chinh-sach-doi-tra", label: "Chính sách đổi trả & hoàn tiền" },
  { href: "/chinh-sach-van-chuyen", label: "Chính sách vận chuyển" },
  { href: "/chinh-sach-thanh-toan", label: "Chính sách thanh toán" },
];

export interface PolicySection {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export const PRIVACY_POLICY_SECTIONS: PolicySection[] = [
  {
    id: "thu-thap-thong-tin",
    title: "1. Thu thập thông tin cá nhân",
    paragraphs: [
      "Tiệm Len Nhà Kiều thu thập thông tin cá nhân của bạn khi bạn đặt hàng, đăng ký tài khoản, hoặc tương tác trên website của chúng tôi.",
      "Các thông tin thu thập bao gồm:",
    ],
    bullets: [
      "Họ và tên khách hàng",
      "Số điện thoại liên hệ",
      "Địa chỉ nhận hàng (Tỉnh/Thành phố, Quận/Huyện, Xã/Phường)",
      "Địa chỉ email (nếu có)",
      "Ghi chú đơn hàng và lịch sử giao dịch",
    ],
  },
  {
    id: "muc-dich-su-dung",
    title: "2. Mục đích sử dụng thông tin",
    paragraphs: [
      "Thông tin cá nhân thu thập được chỉ được sử dụng cho các mục đích hợp pháp sau đây:",
    ],
    bullets: [
      "Xử lý, đóng gói và giao sản phẩm móc len tới địa chỉ của bạn",
      "Xác nhận thanh toán qua chuyển khoản ngân hàng QR",
      "Hỗ trợ giải đáp thắc mắc và chăm sóc khách hàng",
      "Gửi thông báo cập nhật về trạng thái đơn hàng",
      "Nâng cao chất lượng dịch vụ và trải nghiệm mua sắm trên website",
    ],
  },
  {
    id: "cookies-adsense",
    title: "3. Quy định về Cookie và Quảng cáo Google",
    paragraphs: [
      "Website sử dụng Cookie để cải thiện trải nghiệm người dùng, lưu giữ trạng thái giỏ hàng tạm thời và ghi nhớ thông tin đăng nhập.",
      "Chúng tôi có thể hợp tác với các đối tác quảng cáo như Google AdSense và dịch vụ phân tích Google Analytics. Các dịch vụ này sử dụng Cookie để hiển thị quảng cáo phù hợp dựa trên lượt truy cập của bạn trên website của chúng tôi và các trang web khác trên Internet.",
      "Bạn có thể chủ động tắt Cookie trong phần cài đặt trình duyệt của mình bất kỳ lúc nào mà không ảnh hưởng tới việc xem bài viết và sản phẩm.",
    ],
  },
  {
    id: "cam-ket-bao-mat",
    title: "4. Cam kết bảo mật thông tin",
    paragraphs: [
      "Tiệm Len Nhà Kiều cam kết bảo mật tuyệt đối thông tin cá nhân của khách hàng theo chính sách bảo vệ dữ liệu. Chúng tôi tuyệt đối không bán, chia sẻ hoặc trao đổi thông tin cá nhân của bạn cho bất kỳ bên thứ ba nào vì mục đích thương mại.",
      "Thông tin chỉ được cung cấp cho cơ quan pháp luật khi có yêu cầu hợp pháp theo quy định của pháp luật Việt Nam.",
    ],
  },
  {
    id: "quyen-khach-hang",
    title: "5. Quyền của khách hàng và Thông tin liên hệ",
    paragraphs: [
      "Bạn có quyền kiểm tra, cập nhật, điều chỉnh hoặc yêu cầu hủy bỏ thông tin cá nhân của mình bất kỳ lúc nào bằng cách liên hệ với chúng tôi qua thông tin bên dưới:",
      "Mọi thắc mắc về chính sách bảo mật, vui lòng liên hệ:",
    ],
    bullets: [
      "Tên đơn vị: Tiệm Len Nhà Kiều",
      "Hotline / Zalo: 0987.654.321",
      "Email: hotro@tiemlennhakieu.com",
      "Thời gian làm việc: 08:00 - 21:00 (Tất cả các ngày trong tuần)",
    ],
  },
];

export const TERMS_OF_SERVICE_SECTIONS: PolicySection[] = [
  {
    id: "chap-nhan-dieu-khoan",
    title: "1. Chấp nhận điều khoản dịch vụ",
    paragraphs: [
      "Khi truy cập và sử dụng website Tiệm Len Nhà Kiều, quý khách đồng ý tuân thủ và chịu sự ràng buộc bởi các Điều khoản sử dụng này.",
      "Nếu quý khách không đồng ý với bất kỳ điều khoản nào, vui lòng ngừng sử dụng dịch vụ của chúng tôi.",
    ],
  },
  {
    id: "quyen-so-huu-tri-tue",
    title: "2. Quyền sở hữu trí tuệ",
    paragraphs: [
      "Toàn bộ nội dung trên website bao gồm hình ảnh sản phẩm handmade, bài viết hướng dẫn móc len, logo và thiết kế giao diện đều thuộc quyền sở hữu trí tuệ của Tiệm Len Nhà Kiều.",
      "Nghiêm cấm sao chép, trích dẫn hoặc sử dụng hình ảnh sản phẩm cho mục đích thương mại mà không có sự đồng ý bằng văn bản của chúng tôi.",
    ],
  },
  {
    id: "tai-khoan-nguoi-dung",
    title: "3. Quyền và trách nhiệm của khách hàng",
    paragraphs: [
      "Khách hàng có trách nhiệm cung cấp thông tin chính xác về số điện thoại và địa chỉ nhận hàng để đảm bảo việc giao nhận thành công.",
      "Không sử dụng website vào các mục đích gian lận, phá hoại hệ thống hoặc phát tán nội dung độc hại.",
    ],
  },
  {
    id: "dieu-chinh-dieu-khoan",
    title: "4. Thay đổi điều khoản",
    paragraphs: [
      "Tiệm Len Nhà Kiều có quyền thay đổi, chỉnh sửa hoặc bổ sung Điều khoản sử dụng bất kỳ lúc nào. Các thay đổi sẽ có hiệu lực ngay khi được đăng tải trên website.",
    ],
  },
];

export const RETURN_POLICY_SECTIONS: PolicySection[] = [
  {
    id: "dieu-kien-doi-tra",
    title: "1. Điều kiện đổi trả hàng",
    paragraphs: [
      "Do đặc thù sản phẩm móc len thủ công (handmade), chúng tôi hỗ trợ đổi trả sản phẩm trong các trường hợp sau:",
    ],
    bullets: [
      "Sản phẩm bị lỗi do nhà sản xuất (tuột chỉ, hỏng móc khóa, nhầm mẫu)",
      "Sản phẩm bị hư hỏng hoặc biến dạng nặng trong quá trình vận chuyển",
      "Giao sai mẫu mã, sai màu sắc hoặc thiếu số lượng so với đơn đặt hàng",
    ],
  },
  {
    id: "thoi-gian-quy-dinh",
    title: "2. Thời gian và quy định đổi trả",
    paragraphs: [
      "Thời hạn phản hồi và gửi yêu cầu đổi trả: Trong vòng 48 giờ kể từ khi nhận hàng thành công.",
      "Sản phẩm đổi trả phải còn nguyên vẹn, chưa qua sử dụng, chưa giặt tẩy và còn nguyên tem nhãn (nếu có).",
    ],
  },
  {
    id: "chinh-sach-hoan-tien",
    title: "3. Phương thức hoàn tiền",
    paragraphs: [
      "Sau khi nhận lại hàng đổi trả và kiểm tra đạt điều kiện, Tiệm Len Nhà Kiều sẽ tiến hành hoàn tiền cho quý khách:",
    ],
    bullets: [
      "Hoàn tiền 100% qua chuyển khoản ngân hàng trong vòng 24 giờ làm việc",
      "Hoặc gửi sản phẩm mới thay thế (miễn phí 100% phí ship đổi trả nếu lỗi từ shop)",
    ],
  },
];

export const SHIPPING_POLICY_SECTIONS: PolicySection[] = [
  {
    id: "pham-vi-giao-hang",
    title: "1. Phạm vi và đơn vị vận chuyển",
    paragraphs: [
      "Tiệm Len Nhà Kiều hỗ trợ giao hàng toàn quốc tới 63 tỉnh thành thông qua các đối tác vận chuyển uy tín như Giao Hàng Nhanh (GHN), Giao Hàng Tiết Kiệm (GHTK), Viettel Post.",
    ],
  },
  {
    id: "thoi-gian-giao-hang",
    title: "2. Thời gian giao hàng dự kiến",
    paragraphs: [
      "Thời gian giao hàng tính từ lúc đơn hàng được xác nhận thanh toán:",
    ],
    bullets: [
      "Khu vực nội thành TP.HCM: 1 - 2 ngày làm việc",
      "Khu vực các tỉnh thành khác: 2 - 4 ngày làm việc",
      "Đối với đơn hàng đặt làm theo yêu cầu riêng: Thời gian hoàn thiện + 2-3 ngày giao hàng",
    ],
  },
  {
    id: "cuoc-phi-van-chuyen",
    title: "3. Cước phí vận chuyển",
    paragraphs: [
      "Phí ship đồng giá 22.000đ cho đơn hàng dưới 300.000đ.",
      "Miễn phí vận chuyển (FREESHIP) cho toàn bộ đơn hàng từ 300.000đ trở lên trên toàn quốc.",
    ],
  },
];

export const PAYMENT_POLICY_SECTIONS: PolicySection[] = [
  {
    id: "phuong-thuc-thanh-toan",
    title: "1. Phương thức thanh toán áp dụng",
    paragraphs: [
      "100% đơn hàng tại Tiệm Len Nhà Kiều áp dụng hình thức thanh toán trước qua chuyển khoản ngân hàng QR (VietQR / Internet Banking).",
      "Hình thức thanh toán trước giúp chúng tôi tối ưu quy trình làm hàng handmade thủ công và đảm bảo giao đúng mẫu mã.",
    ],
  },
  {
    id: "huong-dan-thanh-toan",
    title: "2. Quy trình thanh toán qua VietQR",
    paragraphs: [
      "Khi hoàn tất đặt hàng, màn hình sẽ hiển thị mã VietQR chứa đúng số tiền và nội dung chuyển khoản (mã đơn hàng).",
      "Khách hàng chỉ cần mở app ngân hàng, quét mã QR và xác nhận chuyển khoản. Hệ thống tự động kiểm tra và xác nhận đơn hàng thành công.",
    ],
  },
  {
    id: "an-toan-giaodich",
    title: "3. Bảo mật giao dịch thanh toán",
    paragraphs: [
      "Giao dịch được thực hiện trực tiếp qua cổng thanh toán QR ngân hàng uy tín. Shop tuyệt đối không lưu trữ thông tin thẻ hay tài khoản ngân hàng của khách hàng.",
    ],
  },
];
