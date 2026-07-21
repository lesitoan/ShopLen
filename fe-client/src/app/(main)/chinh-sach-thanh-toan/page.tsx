import PolicyScreen from "@/screens/privacyPolicy";
import { PAYMENT_POLICY_SECTIONS } from "@/screens/privacyPolicy/constants";

export const metadata = {
  title: "Chính sách thanh toán | Tiệm Len Nhà Kiều",
  description: "Hướng dẫn thanh toán chuyển khoản ngân hàng qua mã QR tại Tiệm Len Nhà Kiều.",
};

export default function Page() {
  return (
    <PolicyScreen
      currentPath="/chinh-sach-thanh-toan"
      pageTitle="Chính sách thanh toán"
      sections={PAYMENT_POLICY_SECTIONS}
      commitmentTitle="Cam kết thanh toán an toàn 100%"
      commitmentDesc="Áp dụng hình thức thanh toán QR ngân hàng tự động nhanh chóng, bảo mật tuyệt đối qua hạ tầng ngân hàng Việt Nam."
    />
  );
}
