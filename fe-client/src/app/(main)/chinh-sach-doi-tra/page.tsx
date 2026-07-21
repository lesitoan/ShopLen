import PolicyScreen from "@/screens/privacyPolicy";
import { RETURN_POLICY_SECTIONS } from "@/screens/privacyPolicy/constants";

export const metadata = {
  title: "Chính sách đổi trả & hoàn tiền | Tiệm Len Nhà Kiều",
  description: "Chính sách đổi trả sản phẩm móc len lỗi và quy trình hoàn tiền tại Tiệm Len Nhà Kiều.",
};

export default function Page() {
  return (
    <PolicyScreen
      currentPath="/chinh-sach-doi-tra"
      pageTitle="Chính sách đổi trả & hoàn tiền"
      sections={RETURN_POLICY_SECTIONS}
      commitmentTitle="Cam kết bảo vệ quyền lợi mua sắm"
      commitmentDesc="Hỗ trợ đổi mới hoặc hoàn tiền 100% đối với các sản phẩm len thủ công bị lỗi từ nhà sản xuất hoặc bị hư hỏng do vận chuyển."
    />
  );
}
