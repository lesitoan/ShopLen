export interface ContactInfoItem {
  id: string;
  title: string;
  value: string;
  subValue?: string;
  iconName: "MapPin" | "Phone" | "Mail" | "Clock";
  actionHref?: string;
  actionLabel?: string;
}

export interface ContactFaqItem {
  id: string;
  question: string;
  answer: string;
}

export const SUBJECT_OPTIONS = [
  { value: "Tư vấn món quà len handmade", label: "Tư vấn món quà len handmade" },
  { value: "Đặt móc len theo ảnh mẫu riêng", label: "Đặt móc len theo ảnh mẫu riêng" },
  { value: "Đặt quà tặng sự kiện số lượng lớn", label: "Đặt quà tặng sự kiện số lượng lớn" },
  { value: "Tra cứu trạng thái đơn hàng", label: "Tra cứu trạng thái đơn hàng" },
  { value: "Khác", label: "Chủ đề khác" },
];

export const CONTACT_INFO_ITEMS: ContactInfoItem[] = [
  {
    id: "address",
    title: "Địa chỉ cửa hàng",
    value: "TP. Đà Nẵng, Việt Nam",
    subValue: "Hỗ trợ mua hàng & xem trực tiếp",
    iconName: "MapPin",
  },
  {
    id: "phone",
    title: "Hotline / Zalo hỗ trợ",
    value: "0987.654.321",
    subValue: "Tư vấn báo giá quà tặng nhanh",
    iconName: "Phone",
    actionHref: "tel:0987654321",
    actionLabel: "Gọi ngay",
  },
  {
    id: "email",
    title: "Email liên hệ",
    value: "hotro@tiemlennhakieu.com",
    subValue: "Phản hồi trong 2-4 giờ làm việc",
    iconName: "Mail",
    actionHref: "mailto:hotro@tiemlennhakieu.com",
    actionLabel: "Gửi email",
  },
  {
    id: "hours",
    title: "Thời gian làm việc",
    value: "08:00 - 21:00",
    subValue: "Tất cả các ngày trong tuần (T2 - CN)",
    iconName: "Clock",
  },
];

export const CONTACT_FAQS: ContactFaqItem[] = [
  {
    id: "custom-order",
    question: "Tiệm Len Nhà Kiều có nhận móc theo ảnh mẫu cá nhân không?",
    answer: "Có! Chúng tôi chuyên nhận móc thú bông, móc khóa và hoa len theo hình ảnh hoặc ý tưởng riêng của khách hàng. Bạn chỉ cần gửi ảnh mẫu qua Zalo hoặc Form liên hệ, shop sẽ tư vấn và báo giá chi tiết.",
  },
  {
    id: "delivery-time",
    question: "Thời gian làm hàng handmade và giao hàng mất bao lâu?",
    answer: "Sản phẩm có sẵn sẽ được đóng gói giao trong 1-2 ngày. Đối với đơn hàng móc theo yêu cầu riêng, thời gian làm thủ công khoảng 2-4 ngày + thời gian giao hàng toàn quốc từ 2-3 ngày.",
  },
  {
    id: "bulk-order",
    question: "Shop có nhận làm quà tặng sự kiện / quà cưới số lượng lớn không?",
    answer: "Có! Tiệm Len Nhà Kiều có chính sách ưu đãi cước phí và chiết khấu hấp dẫn cho các đơn hàng quà tặng doanh nghiệp, lễ tốt nghiệp hay quà cưới với số lượng từ 20 sản phẩm trở lên.",
  },
];
