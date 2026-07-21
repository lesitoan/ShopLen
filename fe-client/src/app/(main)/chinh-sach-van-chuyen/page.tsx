import PolicyScreen from "@/screens/privacyPolicy";
import { SHIPPING_POLICY_SECTIONS } from "@/screens/privacyPolicy/constants";

export const metadata = {
  title: "Chính sách vận chuyển | Tiệm Len Nhà Kiều",
  description: "Thông tin phí vận chuyển, thời gian giao hàng toàn quốc tại Tiệm Len Nhà Kiều.",
};

export default function Page() {
  return (
    <PolicyScreen
      currentPath="/chinh-sach-van-chuyen"
      pageTitle="Chính sách vận chuyển"
      sections={SHIPPING_POLICY_SECTIONS}
      commitmentTitle="Cam kết giao hàng an toàn & nhanh chóng"
      commitmentDesc="Hợp tác với các đơn vị vận chuyển uy tín (GHN, GHTK, Viettel Post) để giao sản phẩm tận tay khách hàng trên 63 tỉnh thành."
    />
  );
}
