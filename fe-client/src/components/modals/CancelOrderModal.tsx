"use client";

import React, { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import { useCancelOrderMutation } from "@/services/api/orderApi";

import Modal from "@/components/ui/Modal";
import useModal from "@/hooks/useModal";

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderCode: string;
  orderStatus: string;
}

interface CancelFormValues {
  reason: string;
}

const REASON_PRESETS = [
  "Tôi muốn thay đổi địa chỉ nhận hàng",
  "Tôi muốn đổi sang sản phẩm khác",
  "Tôi đổi ý, không muốn mua nữa",
  "Tìm thấy sản phẩm khác phù hợp hơn",
  "Lý do khác",
];

export default function CancelOrderModal({
  isOpen,
  onClose,
  orderId,
  orderCode,
  orderStatus,
}: CancelOrderModalProps) {
  const [cancelOrder, { isLoading }] = useCancelOrderMutation();
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const confirmModal = useModal();

  const [shouldRender, setShouldRender] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CancelFormValues>({
    defaultValues: { reason: "" },
    mode: "onSubmit",
  });

  const reasonValue = watch("reason") || "";

  const isModal1Active = isOpen && !confirmModal.isOpen;

  useEffect(() => {
    if (isOpen) {
      setSelectedPreset("");
      reset({ reason: "" });
    }
  }, [isOpen, reset]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isModal1Active) {
      setShouldRender(true);
      timer = setTimeout(() => {
        setIsVisible(true);
      }, 15);
    } else {
      setIsVisible(false);
      timer = setTimeout(() => {
        setShouldRender(false);
      }, 200);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [isModal1Active]);

  const handleClose = () => {
    if (isLoading) return;
    onClose();
  };

  const handleSelectPreset = (preset: string) => {
    if (isLoading) return;
    setSelectedPreset(preset);
    if (preset !== "Lý do khác") {
      setValue("reason", preset, { shouldValidate: true, shouldTouch: true });
    } else {
      setValue("reason", "", { shouldValidate: true, shouldTouch: true });
    }
  };

  const onSubmit = () => {
    confirmModal.openModal();
  };

  const handleExecuteCancel = async () => {
    const finalReason = reasonValue.trim();

    try {
      const res = await cancelOrder({
        id: orderId,
        reason: finalReason,
      }).unwrap();

      const successMsg =
        res?.message ||
        (res?.orderStatus === "CANCELLED"
          ? "Đơn hàng đã được hủy thành công!"
          : "Yêu cầu hủy đơn đã được gửi để xem xét!");
      toast.success(successMsg);
      confirmModal.closeModal();
      onClose();
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.message ||
        "Không thể thực hiện hủy đơn hàng. Vui lòng thử lại sau.";
      toast.error(msg);
      confirmModal.closeModal();
    }
  };

  return (
    <>
      {/* MODAL 1: CANCEL ORDER FORM */}
      {shouldRender && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          {/* Backdrop */}
          <div
            className={`fixed inset-0 bg-black/60 transition-opacity duration-200 ease-out ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            onClick={handleClose}
          />

          {/* Modal Window */}
          <div
            className={`relative w-full md:max-w-md bg-surface border-t md:border border-border rounded-t-2xl md:rounded-2xl shadow-2xl z-10 flex flex-col max-h-[90vh] md:max-h-[80vh] overflow-hidden transition-all duration-300 md:duration-200 ease-out ${
              isVisible
                ? "translate-y-0 opacity-100 scale-100 md:scale-100 md:translate-y-0"
                : "translate-y-full opacity-100 scale-100 md:opacity-0 md:scale-75 md:translate-y-2"
            }`}
          >
            {/* Mobile Handle Indicator */}
            <div className="flex md:hidden justify-center pt-2.5 pb-1">
              <div className="w-10 h-1.5 bg-border/80 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 md:px-5 py-3 md:py-4 border-b border-border">
              <h3 className="text-[15px] md:text-[16px] font-bold text-text-primary">
                Hủy đơn hàng <span className="font-mono text-secondary">#{orderCode}</span>
              </h3>
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="p-1 md:p-1.5 text-text-secondary hover:text-text-primary rounded-lg hover:bg-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body Form */}
            <div className="p-4 md:p-5 overflow-y-auto max-h-[calc(90vh-60px)] md:max-h-[80vh] pb-8 md:pb-5">
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 text-left">
                {/* Preset selection */}
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-text-primary">
                    Chọn lý do hủy đơn <span className="text-error">*</span>
                  </label>
                  <div className="flex flex-col gap-1.5">
                    {REASON_PRESETS.map((preset) => {
                      const isSelected = selectedPreset === preset;
                      return (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => handleSelectPreset(preset)}
                          disabled={isLoading}
                          className={`flex items-center justify-between p-2.5 rounded-xl border text-[12.5px] transition-all text-left disabled:opacity-50 ${
                            isSelected
                              ? "border-primary bg-primary-light/50 text-secondary font-semibold"
                              : "border-border/70 hover:border-primary/50 text-text-primary bg-surface"
                          }`}
                        >
                          <span>{preset}</span>
                          {isSelected && <Check size={16} className="text-secondary shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[12.5px] font-medium text-text-secondary">
                    Chi tiết lý do <span className="text-error">*</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Nhập ghi chú hoặc thông tin bổ sung cho cửa hàng (tối thiểu 20 ký tự)..."
                    disabled={isLoading}
                    className={`w-full p-3 rounded-xl border bg-background text-text-primary text-[13px] outline-none focus:outline-none focus:ring-0 transition-all resize-none disabled:opacity-50 ${
                      errors.reason
                        ? "border-error focus:border-error"
                        : "border-border/80 focus:border-primary"
                    }`}
                    {...register("reason", {
                      required: "Vui lòng nhập lý do hủy đơn hàng.",
                      minLength: {
                        value: 20,
                        message: "Lý do hủy phải có ít nhất 20 ký tự.",
                      },
                    })}
                  />
                  {errors.reason && (
                    <span className="text-[12px] font-medium text-error">
                      {errors.reason.message}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="flex-1 md:flex-none rounded-xl px-5"
                  >
                    Bỏ qua
                  </Button>
                  <Button
                    type="submit"
                    variant="danger"
                    size="md"
                    isLoading={isLoading}
                    loadingText="Đang xử lý..."
                    disabled={isLoading}
                    className="flex-1 md:flex-none rounded-xl px-6 font-bold"
                  >
                    {orderStatus === "PENDING_PAYMENT" ? "Xác nhận hủy đơn" : "Gửi yêu cầu hủy"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CONFIRMATION MODAL */}
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={confirmModal.closeModal}
        title="Xác nhận hủy đơn hàng"
        description={`Bạn có chắc chắn muốn ${
          orderStatus === "PENDING_PAYMENT" ? "hủy đơn hàng" : "gửi yêu cầu hủy đơn hàng"
        } #${orderCode}? Thao tác này không thể hoàn tác.`}
        onConfirm={handleExecuteCancel}
        confirmLabel={orderStatus === "PENDING_PAYMENT" ? "Xác nhận hủy" : "Gửi yêu cầu"}
        cancelLabel="Bỏ qua"
        isDestructive
        isLoading={isLoading}
        loadingText="Đang xử lý..."
      />
    </>
  );
}
