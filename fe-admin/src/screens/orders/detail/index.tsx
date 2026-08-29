"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { OrderHeaderBanner } from "./components/OrderHeaderBanner";
import { OrderItemsTable } from "./components/OrderItemsTable";
import { OrderStatusTimeline } from "./components/OrderStatusTimeline";
import { CustomerInfoCard } from "./components/CustomerInfoCard";
import { PaymentInfoCard } from "./components/PaymentInfoCard";
import { AdminNotesCard } from "./components/AdminNotesCard";
import { CancelOrderModal } from "./components/CancelOrderModal";
import { Modal } from "@/components/ui/Modal";
import { Loading } from "@/components/ui/Loading";
import {
  useGetOrderDetailQuery,
  useUpdateOrderStatusMutation,
  useConfirmPaymentMutation,
} from "@/services/api/orderApi";
import type { AdminOrderDetail } from "@/types/order.type";
import {
  OrderDetail,
  OrderLineItem,
  OrderCustomer,
  OrderPaymentInfo,
  OrderTimelineItem,
} from "./constants";
import { ORDER_STATUS_MAP, OrderStatus } from "@/constants/orders";
import { toast } from "react-toastify";

interface OrderDetailScreenProps {
  orderId: string;
}

function mapAdminOrderDetailToView(apiOrder: AdminOrderDetail): OrderDetail {
  const payment = apiOrder.payments?.[0];

  const items: OrderLineItem[] = (apiOrder.items || []).map((item) => {
    const snapshot = (item.productSnapshot as any) || {};
    const selectedOptions = Array.isArray(snapshot.selectedOptions)
      ? snapshot.selectedOptions
      : [];
    const variantName =
      selectedOptions
        .map((opt: any) => `${opt.name}: ${opt.label}`)
        .join(", ") || "Tiêu chuẩn";

    return {
      id: item.id,
      productId: item.productId || snapshot.id || "",
      title: snapshot.name || "Sản phẩm len handmade",
      variantName,
      image:
        snapshot.image ||
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=150&auto=format&fit=crop&q=80",
      price: item.unitPrice,
      quantity: item.quantity,
      total: item.totalPrice,
    };
  });

  const fullAddress = [
    apiOrder.shippingAddress,
    apiOrder.shippingWard,
    apiOrder.shippingDistrict,
    apiOrder.shippingProvince,
  ]
    .filter(Boolean)
    .join(", ");

  const customer: OrderCustomer = {
    id: apiOrder.customer?.code || apiOrder.customer?.id || apiOrder.customerId,
    name:
      apiOrder.customerName ||
      apiOrder.customer?.fullName ||
      "Khách mua hàng",
    phone: apiOrder.customerPhone || apiOrder.customer?.phone || "—",
    email: apiOrder.customerEmail || apiOrder.customer?.email || "—",
    address: fullAddress || "—",
    note: apiOrder.customerNote || undefined,
    totalOrdersCount: 1,
  };

  const paymentInfo: OrderPaymentInfo = {
    method:
      apiOrder.paymentMethod === "COD"
        ? "Thanh toán khi nhận hàng (COD)"
        : "Chuyển khoản VietQR",
    status: apiOrder.paymentStatus === "PAID" ? "PAID" : "PENDING",
    bankName: payment?.bankName || "MB Bank",
    accountNo: payment?.accountNo || "9999999999",
    accountName: payment?.accountName || "TIEM LEN NHA KIEU",
    transactionRef: payment?.transactionRef || undefined,
    paidAt: apiOrder.paidAt || payment?.paidAt || undefined,
    isMatched:
      apiOrder.paymentStatus === "PAID" || Boolean(payment?.isMatched),
  };

  const timeline: OrderTimelineItem[] = [
    {
      id: "TL-CREATE",
      title: "Đơn hàng đã được đặt",
      description: "Khách hàng hoàn tất đặt đơn hàng trên website",
      timestamp: apiOrder.createdAt,
      actor: "CUSTOMER",
      isDone: true,
    },
  ];

  if (apiOrder.paidAt || apiOrder.paymentStatus === "PAID") {
    timeline.push({
      id: "TL-PAID",
      title: "Đã thanh toán thành công",
      description: `Đơn hàng đã được thanh toán qua ${
        apiOrder.paymentMethod === "COD" ? "COD" : "VietQR"
      }`,
      timestamp: apiOrder.paidAt || apiOrder.createdAt,
      actor: "SYSTEM",
      isDone: true,
    });
  }

  if (["PACKING", "SHIPPING", "COMPLETED"].includes(apiOrder.orderStatus)) {
    timeline.push({
      id: "TL-PACKING",
      title: "Đang đóng gói hàng",
      description: "Cửa hàng đang chuẩn bị và đóng gói sản phẩm len handmade",
      timestamp: apiOrder.updatedAt,
      actor: "ADMIN",
      isDone: true,
      isCurrent: apiOrder.orderStatus === "PACKING",
    });
  }

  if (["SHIPPING", "COMPLETED"].includes(apiOrder.orderStatus)) {
    timeline.push({
      id: "TL-SHIPPING",
      title: "Đang giao hàng",
      description: apiOrder.shippingUnit
        ? `Đã giao cho đơn vị vận chuyển: ${apiOrder.shippingUnit}${
            apiOrder.trackingCode
              ? ` (Mã vận đơn: ${apiOrder.trackingCode})`
              : ""
          }`
        : "Đơn hàng đang trên đường giao tới bạn",
      timestamp: apiOrder.updatedAt,
      actor: "ADMIN",
      isDone: true,
      isCurrent: apiOrder.orderStatus === "SHIPPING",
    });
  }

  if (apiOrder.orderStatus === "COMPLETED") {
    timeline.push({
      id: "TL-COMPLETED",
      title: "Đơn hàng hoàn tất",
      description: "Khách hàng đã nhận hàng thành công",
      timestamp: apiOrder.updatedAt,
      actor: "SYSTEM",
      isDone: true,
      isCurrent: true,
    });
  }

  if (
    apiOrder.cancellationRequestedAt ||
    apiOrder.orderStatus === "CANCELLATION_REQUESTED"
  ) {
    timeline.push({
      id: "TL-CANCEL-REQ",
      title: "Yêu cầu hủy đơn",
      description: `Lý do: ${
        apiOrder.cancellationRequestReason || "Khách yêu cầu hủy đơn"
      }`,
      timestamp: apiOrder.cancellationRequestedAt || apiOrder.updatedAt,
      actor: "CUSTOMER",
      isDone: true,
      isCurrent: apiOrder.orderStatus === "CANCELLATION_REQUESTED",
    });
  }

  if (apiOrder.orderStatus === "CANCELLED" || apiOrder.cancelledAt) {
    timeline.push({
      id: "TL-CANCELLED",
      title: "Đơn hàng đã hủy",
      description: `Lý do: ${apiOrder.cancelReason || "Đơn hàng đã được hủy"}`,
      timestamp: apiOrder.cancelledAt || apiOrder.updatedAt,
      actor: "ADMIN",
      isDone: true,
      isCurrent: true,
    });
  }

  return {
    id: apiOrder.id,
    orderCode: apiOrder.orderCode,
    createdAt: apiOrder.createdAt,
    status: apiOrder.orderStatus,
    customer,
    items,
    financial: {
      subtotal: apiOrder.subtotal,
      shippingFee: apiOrder.shippingFee,
      discountAmount: apiOrder.discountAmount + (apiOrder.pointsDiscount || 0),
      totalAmount: apiOrder.totalAmount,
    },
    payment: paymentInfo,
    timeline,
    adminNotes: apiOrder.adminNotes || "",
    cancelReason: apiOrder.cancelReason || undefined,
  };
}

export function OrderDetailScreen({ orderId }: OrderDetailScreenProps) {
  const {
    data: apiOrder,
    isLoading,
    isError,
  } = useGetOrderDetailQuery(orderId);

  const [updateOrderStatus, { isLoading: isUpdatingStatus }] =
    useUpdateOrderStatusMutation();

  const [confirmPayment, { isLoading: isConfirmingPayment }] =
    useConfirmPaymentMutation();

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isPaymentConfirmModalOpen, setIsPaymentConfirmModalOpen] = useState(false);
  const [pendingTargetStatus, setPendingTargetStatus] =
    useState<OrderStatus | null>(null);

  const order = useMemo(() => {
    if (!apiOrder) return null;
    return mapAdminOrderDetailToView(apiOrder);
  }, [apiOrder]);

  const handleRequestStatusChange = (nextStatus: OrderStatus) => {
    setPendingTargetStatus(nextStatus);
  };

  const handleStatusChange = async (nextStatus: OrderStatus) => {
    try {
      if (nextStatus === "PAID" && apiOrder?.paymentStatus === "PENDING") {
        await confirmPayment(orderId).unwrap();
        toast.success("Xác nhận thanh toán đơn hàng thành công!");
      } else {
        await updateOrderStatus({
          id: orderId,
          body: { orderStatus: nextStatus },
        }).unwrap();
        toast.success(
          `Cập nhật trạng thái sang "${
            ORDER_STATUS_MAP[nextStatus]?.label || nextStatus
          }" thành công!`
        );
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Cập nhật trạng thái đơn hàng thất bại."
      );
    } finally {
      setPendingTargetStatus(null);
    }
  };

  const handleConfirmManualPayment = async () => {
    try {
      await confirmPayment(orderId).unwrap();
      toast.success("Xác nhận thanh toán đơn hàng thành công!");
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Xác nhận thanh toán thất bại."
      );
    }
  };

  const handleConfirmCancel = async (reason: string) => {
    try {
      await updateOrderStatus({
        id: orderId,
        body: {
          orderStatus: "CANCELLED",
          cancelReason: reason,
        },
      }).unwrap();
      toast.success("Đã hủy đơn hàng thành công!");
      setIsCancelModalOpen(false);
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Hủy đơn hàng thất bại."
      );
    }
  };

  const handleSaveNotes = async (notes: string) => {
    try {
      if (!apiOrder) return;
      await updateOrderStatus({
        id: orderId,
        body: {
          orderStatus: apiOrder.orderStatus,
          adminNotes: notes,
        },
      }).unwrap();
      toast.success("Đã lưu ghi chú quản trị viên!");
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Lưu ghi chú thất bại."
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loading size="lg" />
        <span className="text-xs text-text-muted">
          Đang tải thông tin chi tiết đơn hàng...
        </span>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="bg-surface p-8 rounded-xl border border-border text-center space-y-3">
        <p className="text-sm font-bold text-status-danger">
          Không tìm thấy thông tin đơn hàng này hoặc đã xảy ra lỗi khi tải dữ liệu.
        </p>
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-bg-deep font-bold text-xs shadow-md hover:bg-primary-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách đơn hàng</span>
        </Link>
      </div>
    );
  }

  const targetConfig = pendingTargetStatus
    ? ORDER_STATUS_MAP[pendingTargetStatus]
    : null;

  return (
    <div className="space-y-5 pb-10">
      <OrderHeaderBanner
        order={order}
        onStatusChange={handleRequestStatusChange}
        onOpenCancelModal={() => setIsCancelModalOpen(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 space-y-5">
          <OrderItemsTable items={order.items} financial={order.financial} />
          <OrderStatusTimeline timeline={order.timeline} />
        </div>

        <div className="lg:col-span-4 space-y-5">
          <CustomerInfoCard customer={order.customer} />
          <PaymentInfoCard
            payment={order.payment}
            isPendingPayment={order.status === "PENDING_PAYMENT"}
            onConfirmManualPayment={() => setIsPaymentConfirmModalOpen(true)}
          />
          {/* <AdminNotesCard
            initialNotes={order.adminNotes}
            onSaveNotes={handleSaveNotes}
          /> */}
        </div>
      </div>

      <Modal
        isOpen={Boolean(pendingTargetStatus)}
        onClose={() => setPendingTargetStatus(null)}
        onConfirm={() => {
          if (pendingTargetStatus) handleStatusChange(pendingTargetStatus);
        }}
        type="CONFIRM"
        title={
          pendingTargetStatus === "PAID"
            ? "Xác nhận đã nhận chuyển khoản"
            : "Xác nhận chuyển trạng thái đơn hàng"
        }
        description={
          pendingTargetStatus === "PAID"
            ? `Bạn có chắc chắn đã kiểm tra tài khoản ngân hàng và xác nhận đơn hàng ${
                order.orderCode
              } đã thanh toán đủ số tiền ${order.financial.totalAmount.toLocaleString(
                "vi-VN"
              )}đ không? Hệ thống sẽ chuyển trạng thái đơn sang "Đã thanh toán" (PAID).`
            : `Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng ${
                order.orderCode
              } sang "${targetConfig?.label || pendingTargetStatus}" không?`
        }
        confirmText={
          isUpdatingStatus || isConfirmingPayment
            ? "Đang xử lý..."
            : pendingTargetStatus === "PAID"
            ? "Xác nhận đã nhận tiền"
            : "Xác nhận chuyển"
        }
        cancelText="Hủy bỏ"
        size="sm"
      />

      {/* Modal xác nhận đã nhận chuyển khoản thủ công */}
      <Modal
        isOpen={isPaymentConfirmModalOpen}
        onClose={() => setIsPaymentConfirmModalOpen(false)}
        onConfirm={async () => {
          setIsPaymentConfirmModalOpen(false);
          await handleConfirmManualPayment();
        }}
        type="CONFIRM"
        title="Xác nhận đã nhận chuyển khoản"
        description={`Bạn có chắc chắn đã kiểm tra tài khoản ngân hàng và xác nhận đơn hàng ${
          order.orderCode
        } đã thanh toán đủ số tiền ${order.financial.totalAmount.toLocaleString(
          "vi-VN"
        )}đ không? Hệ thống sẽ chuyển trạng thái đơn sang "Đã thanh toán" (PAID).`}
        confirmText={
          isConfirmingPayment ? "Đang xử lý..." : "Xác nhận đã nhận tiền"
        }
        cancelText="Bỏ qua"
        size="sm"
      />

      <CancelOrderModal
        isOpen={isCancelModalOpen}
        orderCode={order.orderCode}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirmCancel={handleConfirmCancel}
      />
    </div>
  );
}
