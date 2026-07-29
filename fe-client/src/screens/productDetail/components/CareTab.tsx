import React from "react";

interface CareTabProps {
  careInstructionHtml?: string | null;
}

export default function CareTab({ careInstructionHtml }: CareTabProps) {
  if (careInstructionHtml) {
    return (
      <div
        className="space-y-4 animate-in fade-in duration-200 text-left text-[13px] text-text-secondary leading-relaxed prose max-w-none"
        dangerouslySetInnerHTML={{ __html: careInstructionHtml }}
      />
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-200 text-left text-[13px] text-text-secondary leading-relaxed">
      <p>
        Đồ handmade đan móc từ chất liệu len đòi hỏi sự giữ gìn và bảo quản nhẹ nhàng để giữ được form dáng cũng như màu sắc tươi mới nguyên bản lâu dài nhất.
      </p>
      <p className="font-bold text-text-primary">Quy trình vệ sinh đồ len:</p>
      <ol className="list-decimal pl-5 space-y-2">
        <li>
          <span className="font-semibold text-text-primary">Giặt nhẹ bằng tay:</span> Pha loãng một lượng nhỏ dầu gội đầu hoặc sữa tắm với nước mát. Cho sản phẩm vào ngâm nhẹ khoảng 5-10 phút. Bóp nhẹ sản phẩm bằng ngón tay để làm sạch bụi bẩn, không vắt xoắn hoặc vò chà mạnh làm giãn sợi len.
        </li>
        <li>
          <span className="font-semibold text-text-primary">Xả sạch bằng nước mát:</span> Rửa trôi bọt xà phòng bằng nước sạch nhiều lần, bóp bớt nước nhẹ nhàng.
        </li>
        <li>
          <span className="font-semibold text-text-primary">Phơi phẳng tự nhiên:</span> Đặt sản phẩm lên một chiếc khăn khô thấm nước, vỗ nhẹ cho khô bớt. Sau đó đặt nằm ngang trên một bề mặt lưới phẳng hoặc rổ thoáng dưới bóng râm mát, không treo bằng móc áo vì sẽ làm sản phẩm bị biến dạng chảy xệ.
        </li>
      </ol>
    </div>
  );
}
