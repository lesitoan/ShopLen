import { OrderDetailScreen } from "@/screens/orders/detail";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <OrderDetailScreen orderId={resolvedParams.id} />;
}
