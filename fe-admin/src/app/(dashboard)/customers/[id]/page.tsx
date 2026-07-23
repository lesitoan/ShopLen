import { CustomerDetailScreen } from "@/screens/customers/detail";

export const metadata = {
  title: "Chi Tiết Khách Hàng | Tiệm Len Nhà Kiều Admin",
  description: "Hồ sơ chi tiết và lịch sử tích điểm của khách hàng",
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CustomerDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <CustomerDetailScreen customerId={resolvedParams.id} />;
}
