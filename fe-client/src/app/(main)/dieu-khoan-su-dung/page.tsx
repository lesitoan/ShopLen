import PolicyScreen from "@/screens/privacyPolicy";
import { TERMS_OF_SERVICE_SECTIONS } from "@/screens/privacyPolicy/constants";

export const metadata = {
  title: "Điều khoản sử dụng | Tiệm Len Nhà Kiều",
  description: "Điều khoản sử dụng và quy định dịch vụ mua sắm trực tuyến tại Tiệm Len Nhà Kiều.",
};

export default function Page() {
  return (
    <PolicyScreen
      currentPath="/dieu-khoan-su-dung"
      pageTitle="Điều khoản sử dụng"
      sections={TERMS_OF_SERVICE_SECTIONS}
      commitmentTitle="Cam kết tuân thủ quy định pháp luật"
      commitmentDesc="Các điều khoản sử dụng giúp đảm bảo quyền lợi hợp pháp của cả khách hàng và Tiệm Len Nhà Kiều khi tham gia giao dịch."
    />
  );
}
