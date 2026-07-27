"use client";

import React from "react";
import { MapPin, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Modal from "@/components/ui/Modal";
import { useModal } from "@/hooks/useModal";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "@/utils/apiErrorUtils";
import {
  useUpdateCustomerAddressMutation,
  useDeleteCustomerAddressMutation,
  CustomerAddress,
} from "@/services/api/customerAddressApi";

interface ListAddressProps {
  addresses: CustomerAddress[];
}

interface ConfirmModalData {
  type: "SET_DEFAULT" | "DELETE";
  address: CustomerAddress;
}

export default function ListAddress({ addresses }: ListAddressProps) {
  const {
    isOpen: isModalOpen,
    data: modalData,
    openModal,
    closeModal,
  } = useModal<ConfirmModalData>();

  const [updateCustomerAddress, { isLoading: isUpdating }] =
    useUpdateCustomerAddressMutation();
  const [deleteCustomerAddress, { isLoading: isDeleting }] =
    useDeleteCustomerAddressMutation();

  const handleOpenSetDefaultModal = (item: CustomerAddress) => {
    openModal({ type: "SET_DEFAULT", address: item });
  };

  const handleOpenDeleteModal = (item: CustomerAddress) => {
    openModal({ type: "DELETE", address: item });
  };

  const handleCloseModal = () => {
    if (isUpdating || isDeleting) return;
    closeModal();
  };

  const handleConfirmAction = async () => {
    if (!modalData) return;
    const { type, address } = modalData;

    if (type === "SET_DEFAULT") {
      try {
        await updateCustomerAddress({ id: address.id, isDefault: true }).unwrap();
        toast.success("Đã thiết lập làm địa chỉ mặc định!");
        closeModal();
      } catch (error) {
        toast.error(
          getApiErrorMessage(error, "Không thể cập nhật địa chỉ mặc định.")
        );
      }
    } else if (type === "DELETE") {
      try {
        await deleteCustomerAddress(address.id).unwrap();
        toast.success("Đã xóa địa chỉ thành công!");
        closeModal();
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Không thể xóa địa chỉ."));
      }
    }
  };

  if (addresses.length === 0) {
    return (
      <div className="py-6">
        <EmptyState
          title="Chưa có địa chỉ giao hàng"
          description="Thêm địa chỉ giao hàng để thuận tiện khi đặt mua sản phẩm."
        />
      </div>
    );
  }

  const isDeleteType = modalData?.type === "DELETE";

  const modalTitle = isDeleteType
    ? "Xác nhận xóa địa chỉ"
    : "Xác nhận đặt địa chỉ mặc định";

  const modalDescription = isDeleteType
    ? `Bạn có chắc chắn muốn xóa địa chỉ của "${modalData?.address.fullName}" (${modalData?.address.addressLine}, ${modalData?.address.provinceName})? Thao tác này không thể hoàn tác.`
    : `Bạn có muốn đặt địa chỉ của "${modalData?.address.fullName}" (${modalData?.address.addressLine}, ${modalData?.address.provinceName}) làm địa chỉ nhận hàng mặc định?`;

  const confirmBtnLabel = isDeleteType
    ? isDeleting
      ? "Đang xóa..."
      : "Xóa địa chỉ"
    : isUpdating
    ? "Đang xử lý..."
    : "Xác nhận";

  return (
    <>
      <div className="flex flex-col gap-4">
        {addresses.map((item: CustomerAddress) => (
          <div
            key={item.id}
            className={`border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
              item.isDefault
                ? "border-primary/40 bg-primary-light/10"
                : "border-border bg-background/30"
            }`}
          >
            <div className="flex flex-col gap-1.5 text-left flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <span className="text-[14.5px] font-bold text-text-primary">
                  {item.fullName}
                </span>
                <span className="hidden sm:inline text-text-secondary text-[12.5px]">
                  • {item.phone}
                </span>
                {item.isDefault && (
                  <span className="px-2.5 py-0.5 rounded-md bg-primary text-white text-[11px] font-bold shrink-0 whitespace-nowrap">
                    Mặc định
                  </span>
                )}
              </div>

              <span className="sm:hidden text-text-secondary text-[12.5px] font-medium">
                SĐT: {item.phone}
              </span>

              <p className="text-[13px] text-text-secondary flex items-start gap-1.5 mt-0.5">
                <MapPin size={15} className="shrink-0 text-secondary mt-0.5" />
                <span>
                  {item.addressLine}, {item.provinceName}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2 justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border/40">
              {!item.isDefault && (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isUpdating || isDeleting}
                  onClick={() => handleOpenSetDefaultModal(item)}
                  className="rounded-lg text-xs py-1.5"
                >
                  Thiết lập mặc định
                </Button>
              )}
              <button
                type="button"
                disabled={isDeleting || isUpdating}
                onClick={() => handleOpenDeleteModal(item)}
                className="p-1.5 text-text-secondary/60 hover:text-error rounded-lg hover:bg-background transition-colors disabled:opacity-40"
                title="Xóa địa chỉ"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalTitle}
        description={modalDescription}
        onConfirm={handleConfirmAction}
        confirmLabel={confirmBtnLabel}
        cancelLabel="Hủy"
        isDestructive={isDeleteType}
      />
    </>
  );
}
