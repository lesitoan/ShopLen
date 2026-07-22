export interface FaqCategory {
  id: string;
  label: string;
}

export interface FaqDetailItem {
  id: string;
  categoryId: string;
  question: string;
  answer: string;
  bullets?: string[];
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  { id: "all", label: "Tất cả câu hỏi" },
  { id: "custom", label: "Đặt móc theo ảnh" },
  { id: "shipping", label: "Thanh toán & Giao hàng" },
  { id: "return", label: "Đổi trả & Hoàn tiền" },
  { id: "care", label: "Bảo quản sản phẩm len" },
];

export const FAQ_LIST: FaqDetailItem[] = [
  {
    id: "faq-custom-1",
    categoryId: "custom",
    question: "Tiệm Len Nhà Kiều có nhận làm mẫu theo ảnh riêng không?",
    answer: "Có! Chúng tôi chuyên nhận móc thú bông, móc khóa và hoa len theo hình ảnh hoặc ý tưởng riêng của khách hàng.",
    bullets: [
      "Bước 1: Gửi ảnh mẫu bạn muốn làm qua Zalo (0987.654.321) hoặc Fanpage.",
      "Bước 2: Shop tư vấn kích thước, phối màu sợi len và gửi báo giá chi tiết.",
      "Bước 3: Chốt đơn và làm mẫu thủ công trong vòng 2-4 ngày làm việc.",
    ],
  },
  {
    id: "faq-custom-2",
    categoryId: "custom",
    question: "Giá sản phẩm đặt làm theo yêu cầu có đắt hơn sản phẩm có sẵn không?",
    answer: "Giá sản phẩm phụ thuộc vào kích thước, mức độ phức tạp của chi tiết và thời gian hoàn thiện. Tiệm Len Nhà Kiều luôn hỗ trợ mức giá hợp lý nhất tương đương các sản phẩm cùng kích thước trên web.",
  },
  {
    id: "faq-shipping-1",
    categoryId: "shipping",
    question: "Thời gian và cước phí giao hàng toàn quốc như thế nào?",
    answer: "Chúng tôi hợp tác với các đơn vị vận chuyển uy tín như GHN, GHTK, Viettel Post để giao hàng tới 63 tỉnh thành.",
    bullets: [
      "Khu vực TP.HCM / Đà Nẵng: 1-2 ngày làm việc.",
      "Khu vực các tỉnh thành khác: 2-4 ngày làm việc.",
      "Phí ship đồng giá 22.000đ. MIỄN PHÍ SHIP cho đơn từ 300.000đ.",
    ],
  },
  {
    id: "faq-shipping-2",
    categoryId: "shipping",
    question: "Quy trình thanh toán qua VietQR hoạt động ra sao?",
    answer: "Khi hoàn tất đặt hàng, màn hình hiển thị mã VietQR chính xác số tiền và nội dung đơn. Bạn chỉ cần mở app ngân hàng, quét mã QR và xác nhận. Hệ thống tự động xác nhận đơn hàng thành công.",
  },
  {
    id: "faq-return-1",
    categoryId: "return",
    question: "Chính sách đổi trả sản phẩm bị lỗi như thế nào?",
    answer: "Shop hỗ trợ đổi mới 100% hoặc hoàn tiền trong vòng 48h kể từ khi nhận hàng đối với các trường hợp:",
    bullets: [
      "Sản phẩm bị bẩn, bung chỉ hoặc hư hỏng do nhà sản xuất/vận chuyển.",
      "Giao sai mẫu mã hoặc thiếu phụ kiện móc khóa.",
      "Shop chịu 100% phí ship đổi trả 2 chiều.",
    ],
  },
  {
    id: "faq-care-1",
    categoryId: "care",
    question: "Làm thế nào để giặt và bảo quản sản phẩm len không bị xù lông?",
    answer: "Sản phẩm sử dụng sợi Milk Cotton cao cấp rất bền màu. Để giữ sản phẩm luôn mới, bạn nên áp dụng các mẹo bảo quản sau:",
    bullets: [
      "Nên giặt tay nhẹ nhàng bằng xà phòng giặt dịu nhẹ hoặc dầu gội đầu.",
      "Không vắt quá mạnh hoặc dùng bàn chải chà xát lên bề mặt len.",
      "Phơi sản phẩm trên bề mặt phẳng nơi thoáng mát, tránh ánh nắng gay gắt trực tiếp.",
    ],
  },
];
