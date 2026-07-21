import PolicyScreen from "@/screens/privacyPolicy";
import { PRIVACY_POLICY_SECTIONS } from "@/screens/privacyPolicy/constants";

export const metadata = {
  title: "Chính sách bảo mật | Tiệm Len Nhà Kiều",
  description: "Chính sách bảo mật thông tin cá nhân và quy định sử dụng dữ liệu khách hàng tại Tiệm Len Nhà Kiều.",
};

export default function Page() {
  return (
    <PolicyScreen
      currentPath="/chinh-sach-bao-mat"
      pageTitle="Chính sách bảo mật"
      sections={PRIVACY_POLICY_SECTIONS}
      commitmentTitle="Cam kết bảo vệ dữ liệu khách hàng"
      commitmentDesc="Tiệm Len Nhà Kiều cam kết bảo vệ thông tin riêng tư và dữ liệu cá nhân của quý khách. Mọi dữ liệu thu thập đều tuân thủ các quy định pháp luật và chính sách bảo mật của Google."
    />
  );
}
