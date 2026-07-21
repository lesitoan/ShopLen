export interface CoreValueItem {
  id: string;
  title: string;
  description: string;
  iconName: "Heart" | "ShieldCheck" | "Palette" | "Gift";
}

export interface CraftStepItem {
  step: string;
  title: string;
  description: string;
  image: string;
}

export const BRAND_STORY = {
  title: "Hành Trình Từ Niềm Đam Mê Đến Thương Hiệu Quà Tặng Handmade",
  subtitle: "Mỗi mũi móc len là một lời nhắn gửi yêu thương chân thành",
  paragraphs: [
    "Tiệm Len Nhà Kiều được thành lập từ một góc nhỏ ấm cúng tại TP. Đà Nẵng, xuất phát từ tình yêu đặc biệt với những sợi len màu sắc và mong muốn tự tay tạo ra những món quà độc đáo, giàu cảm xúc cho người thân.",
    "Khác với các sản phẩm công nghiệp sản xuất hàng loạt, mỗi chiếc móc khóa, chú gấu bông hay bông hoa len tại Tiệm Len Nhà Kiều đều được móc hoàn toàn bằng tay (100% handmade). Chúng tôi dành hàng giờ đồng hồ tỉ mỉ chăm chút từ khâu chọn sợi len Milk Cotton cao cấp, phối màu hài hòa đến từng đường khâu ráp cuối cùng.",
    "Đến nay, Tiệm Len Nhà Kiều đã vinh dự được đồng hành cùng hàng ngàn khách hàng trên khắp cả nước trong các dịp sinh nhật, kỷ niệm, lễ tốt nghiệp hay chỉ đơn giản là một món quà nhỏ tự thưởng cho bản thân.",
  ],
  image: "/images/products/gau-bong-tho.png",
  stats: [
    { label: "Sản phẩm đã móc", value: "5,000+" },
    { label: "Khách hàng hài lòng", value: "3,200+" },
    { label: "Mẫu mã thiết kế", value: "150+" },
  ],
};

export const CORE_VALUES: CoreValueItem[] = [
  {
    id: "handmade",
    title: "100% Thủ Công Tỉ Mỉ",
    description: "Từng mũi móc được làm thủ công bằng tay với sự chăm chút cẩn thận nhất.",
    iconName: "Heart",
  },
  {
    id: "quality",
    title: "Len Sợi An Toàn",
    description: "Sử dụng len Milk Cotton nhập khẩu cao cấp, không xù lông, an toàn cho làn da.",
    iconName: "ShieldCheck",
  },
  {
    id: "custom",
    title: "Đặt Hàng Theo Yêu Cầu",
    description: "Nhận móc thú len, hoa len theo hình ảnh, màu sắc và kích thước riêng của bạn.",
    iconName: "Palette",
  },
  {
    id: "packaging",
    title: "Đóng Gói Quà Xinh Xắn",
    description: "Mỗi sản phẩm đều đi kèm hộp quà tặng chỉn chu và thiệp nhắn gửi yêu thương.",
    iconName: "Gift",
  },
];

export const CRAFT_STEPS: CraftStepItem[] = [
  {
    step: "01",
    title: "Chọn sợi len & Phối màu",
    description: "Lựa chọn những cuộn len mềm mịn nhất với bảng màu pastel nhẹ nhàng, ngọt ngào.",
    image: "/images/products/moc-khoa-gau.png",
  },
  {
    step: "02",
    title: "Móc định hình & Nhồi bông",
    description: "Móc từng bộ phận theo công thức chuẩn xác và nhồi bông gòn công nghiệp cao cấp.",
    image: "/images/products/gau-bong-tho.png",
  },
  {
    step: "03",
    title: "Ráp chi tiết & Đóng gói",
    description: "Khâu ráp chỉn chu, đính móc khóa và đóng vào hộp quà sẵn sàng gửi tới tay bạn.",
    image: "/images/products/tui-hoa-cuc.png",
  },
];
