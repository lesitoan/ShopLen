import React from "react";

interface DescriptionTabProps {
  productName: string;
}

export default function DescriptionTab({ productName }: DescriptionTabProps) {
  return (
    <div className="space-y-4 animate-in fade-in duration-200 text-left text-[13px] text-text-secondary leading-relaxed">
      <p>
        Sản phẩm {productName} được làm thủ công tỉ mỉ bằng tình yêu của đội ngũ nghệ nhân tại Tiệm Len Nhà Kiều. Mỗi mũi móc đan đều đặn thể hiện sự kiên nhẫn và đam mê trong từng chi tiết sản phẩm.
      </p>
      <p className="font-bold text-text-primary">Thông số sản phẩm:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li>Kích thước: Chiều cao khoảng 6-8cm (phù hợp treo các loại balo, túi xách, khóa xe máy, khóa nhà).</li>
        <li>Trọng lượng: Khoảng 30g nhẹ nhàng, tiện lợi di chuyển.</li>
        <li>Chất liệu chính: Len Milk Cotton 125g nhập khẩu sợi mềm mịn, màu sắc tươi sáng lâu dài, tuyệt đối không xơ xù khi giặt giũ.</li>
        <li>Lõi bông bên trong: Bông gòn bi hạt đàn hồi cao cấp, thân thiện với môi trường và cực sạch sẽ, giữ dáng bóng bền vững.</li>
      </ul>
      <p>
        Chúng tôi có nhận đan móc theo yêu cầu thay đổi màu sắc hoặc kích thước riêng. Vui lòng nhắn tin trực tiếp qua fanpage hoặc kênh thông tin liên hệ để được hỗ trợ tận tâm nhất.
      </p>
    </div>
  );
}
