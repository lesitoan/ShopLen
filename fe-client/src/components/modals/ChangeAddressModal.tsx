"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Check, MapPin, User, Phone, Plus, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Checkbox from "@/components/ui/Checkbox";
import Modal from "@/components/ui/Modal";
import LoadingDots from "@/components/ui/LoadingDots";
import useModal from "@/hooks/useModal";
import { useUpdateOrderShippingAddressMutation } from "@/services/api/orderApi";
import {
  useGetCustomerAddressesQuery,
  useCreateCustomerAddressMutation,
} from "@/services/api/customerAddressApi";
import { PROVINCE_OPTIONS } from "@/constants/location";
import { getApiErrorMessage } from "@/utils/apiErrorUtils";

interface ChangeAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderCode: string;
  orderStatus: string;
  currentCustomerName: string;
  currentCustomerPhone: string;
  currentShippingAddress: string;
}

interface NewAddressFormValues {
  fullName: string;
  phone: string;
  province: string;
  address: string;
  saveToAddressBook: boolean;
}

export default function ChangeAddressModal({
  isOpen,
  onClose,
  orderId,
  orderCode,
  orderStatus,
  currentCustomerName,
  currentCustomerPhone,
  currentShippingAddress,
}: ChangeAddressModalProps) {
  const [updateShippingAddress, { isLoading: isUpdating }] =
    useUpdateOrderShippingAddressMutation();
  const [createCustomerAddress, { isLoading: isCreatingAddress }] =
    useCreateCustomerAddressMutation();

  const isBusy = isUpdating || isCreatingAddress;

  const {
    data: savedAddresses = [],
    isLoading: isLoadingAddresses,
    isFetching,
  } = useGetCustomerAddressesQuery(undefined, { skip: !isOpen });

  const confirmModal = useModal();

  const [mode, setMode] = useState<"SAVED" | "NEW">("SAVED");
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [pendingPayload, setPendingPayload] = useState<{
    customerName: string;
    customerPhone: string;
    shippingAddress: string;
    shippingProvince?: string;
    saveToAddressBookData?: {
      fullName: string;
      phone: string;
      provinceName: string;
      addressLine: string;
    };
  } | null>(null);

  const [shouldRender, setShouldRender] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<NewAddressFormValues>({
    defaultValues: {
      fullName: currentCustomerName || "",
      phone: currentCustomerPhone || "",
      province: "",
      address: "",
      saveToAddressBook: false,
    },
    mode: "onTouched",
  });

  const isModal1Active = isOpen && !confirmModal.isOpen;
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      hasInitializedRef.current = false;
      return;
    }

    if (isOpen && !isLoadingAddresses && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      if (savedAddresses.length > 0) {
        setMode("SAVED");
        const defaultAddr = savedAddresses.find((a) => a.isDefault) || savedAddresses[0];
        setSelectedAddressId(defaultAddr?.id || "");
      } else {
        setMode("NEW");
      }
      reset({
        fullName: currentCustomerName || "",
        phone: currentCustomerPhone || "",
        province: "",
        address: "",
        saveToAddressBook: false,
      });
    }
  }, [
    isOpen,
    isLoadingAddresses,
    savedAddresses,
    currentCustomerName,
    currentCustomerPhone,
    reset,
  ]);

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

  if (!isOpen && !shouldRender) return null;

  const handleClose = () => {
    if (isBusy) return;
    onClose();
  };

  const handleSelectSavedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetAddr = savedAddresses.find((a) => a.id === selectedAddressId);
    if (!targetAddr) {
      toast.error("Vui lòng chọn 1 địa chỉ nhận hàng.");
      return;
    }

    const fullAddrString = [
      targetAddr.addressLine,
      targetAddr.districtName,
      targetAddr.wardName,
      targetAddr.provinceName,
    ]
      .filter(Boolean)
      .join(", ");

    setPendingPayload({
      customerName: targetAddr.fullName,
      customerPhone: targetAddr.phone,
      shippingAddress: fullAddrString,
      shippingProvince: targetAddr.provinceName,
    });
    confirmModal.openModal();
  };

  const handleNewAddressSubmit = (data: NewAddressFormValues) => {
    const provinceObj = PROVINCE_OPTIONS.find((opt) => opt.value === data.province);
    const provinceName = provinceObj ? provinceObj.label : data.province;

    const fullAddrString = [data.address.trim(), provinceName].filter(Boolean).join(", ");

    setPendingPayload({
      customerName: data.fullName.trim(),
      customerPhone: data.phone.trim(),
      shippingAddress: fullAddrString,
      shippingProvince: provinceName,
      saveToAddressBookData: data.saveToAddressBook
        ? {
            fullName: data.fullName.trim(),
            phone: data.phone.trim(),
            provinceName: provinceName.trim(),
            addressLine: data.address.trim(),
          }
        : undefined,
    });
    confirmModal.openModal();
  };

  const handleExecuteUpdate = async () => {
    if (!pendingPayload) return;

    try {
      await updateShippingAddress({
        id: orderId,
        customerName: pendingPayload.customerName,
        customerPhone: pendingPayload.customerPhone,
        shippingAddress: pendingPayload.shippingAddress,
        shippingProvince: pendingPayload.shippingProvince,
      }).unwrap();

      if (pendingPayload.saveToAddressBookData) {
        try {
          await createCustomerAddress({
            ...pendingPayload.saveToAddressBookData,
            isDefault: false,
          }).unwrap();
        } catch {
        }
      }

      toast.success("Cập nhật địa chỉ giao hàng thành công!");
      confirmModal.closeModal();
      onClose();
    } catch (err: any) {
      toast.error(
        getApiErrorMessage(err, "Không thể cập nhật địa chỉ giao hàng. Vui lòng thử lại sau.")
      );
      confirmModal.closeModal();
    }
  };

  return (
    <>
      {shouldRender && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          <div
            className={`fixed inset-0 bg-black/60 transition-opacity duration-200 ease-out ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            onClick={handleClose}
          />

          <div
            className={`relative w-full md:max-w-lg bg-surface md:border border-border/30 rounded-t-2xl md:rounded-2xl shadow-2xl z-10 flex flex-col max-h-[90vh] md:max-h-[85vh] overflow-hidden transition-all duration-300 md:duration-200 ease-out ${
              isVisible
                ? "translate-y-0 opacity-100 scale-100 md:scale-100 md:translate-y-0"
                : "translate-y-full opacity-100 scale-100 md:opacity-0 md:scale-75 md:translate-y-2"
            }`}
          >
            <div className="flex md:hidden justify-center pt-2.5 pb-1">
              <div className="w-10 h-1.5 bg-border/80 rounded-full" />
            </div>

            <div className="flex items-center justify-between px-4 md:px-5 py-3 md:py-4 border-b border-border">
              <h3 className="text-[15px] md:text-[16px] font-bold text-text-primary">
                Đổi địa chỉ giao hàng <span className="font-mono text-secondary">#{orderCode}</span>
              </h3>
              <button
                type="button"
                onClick={handleClose}
                disabled={isBusy}
                className="p-1 md:p-1.5 text-text-secondary hover:text-text-primary rounded-lg hover:bg-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 md:p-5 overflow-y-auto max-h-[calc(90vh-60px)] md:max-h-[80vh] pb-8 md:pb-5">
              {isLoadingAddresses || isFetching ? (
                <div className="py-12 text-center flex flex-col items-center justify-center gap-3 animate-in fade-in duration-200">
                  <LoadingDots size="md" color="bg-primary" />
                  <span className="text-[13px] font-medium text-text-secondary">
                    Đang tải danh sách địa chỉ...
                  </span>
                </div>
              ) : (
                <>
                  {savedAddresses.length > 0 && (
                    <div className="flex items-center gap-2 p-1 bg-background rounded-xl border border-border/60 mb-4">
                      <button
                        type="button"
                        onClick={() => setMode("SAVED")}
                        disabled={isBusy}
                        className={`flex-1 py-2 text-[12.5px] font-bold rounded-lg transition-all ${
                          mode === "SAVED"
                            ? "bg-surface text-secondary shadow-xs"
                            : "text-text-secondary hover:text-text-primary"
                        }`}
                      >
                        Địa chỉ đã lưu ({savedAddresses.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setMode("NEW")}
                        disabled={isBusy}
                        className={`flex-1 py-2 text-[12.5px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                          mode === "NEW"
                            ? "bg-surface text-secondary shadow-xs"
                            : "text-text-secondary hover:text-text-primary"
                        }`}
                      >
                        <Plus size={14} />
                        <span>Nhập địa chỉ mới</span>
                      </button>
                    </div>
                  )}

                  {mode === "SAVED" && savedAddresses.length > 0 && (
                    <form
                      onSubmit={handleSelectSavedSubmit}
                      className="flex flex-col gap-3 animate-in fade-in duration-200"
                    >
                      <span className="text-[12.5px] font-medium text-text-secondary">
                        Chọn địa chỉ từ sổ địa chỉ tài khoản của bạn:
                      </span>
                      <div className="flex flex-col gap-2.5 max-h-[45vh] overflow-y-auto pr-1">
                        {savedAddresses.map((addr) => {
                          const isSelected = selectedAddressId === addr.id;
                          const fullAddr = [
                            addr.addressLine,
                            addr.districtName,
                            addr.wardName,
                            addr.provinceName,
                          ]
                            .filter(Boolean)
                            .join(", ");

                          return (
                            <div
                              key={addr.id}
                              onClick={() => {
                                if (!isBusy) setSelectedAddressId(addr.id);
                              }}
                              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 text-left ${
                                isSelected
                                  ? "border-primary bg-primary-light/40 text-text-primary"
                                  : "border-border/70 hover:border-primary/40 bg-surface"
                              }`}
                            >
                              <div className="flex flex-col gap-1 text-[12.5px] flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-text-primary">
                                    {addr.fullName}
                                  </span>
                                  <span className="text-text-secondary font-mono text-[12px]">
                                    {addr.phone}
                                  </span>
                                  {addr.isDefault && (
                                    <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-primary-light text-secondary border border-primary/30">
                                      Mặc định
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-start gap-1.5 text-text-secondary mt-0.5">
                                  <MapPin size={14} className="shrink-0 mt-0.5 text-secondary" />
                                  <span>{fullAddr}</span>
                                </div>
                              </div>
                              <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-1 transition-all ${
                                  isSelected
                                    ? "border-primary bg-primary text-white"
                                    : "border-border/80 bg-background"
                                }`}
                              >
                                {isSelected && <Check size={13} strokeWidth={3} />}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-3 w-full">
                        <Button
                          type="button"
                          variant="outline"
                          size="md"
                          onClick={handleClose}
                          disabled={isBusy}
                          className="flex-1 md:flex-none rounded-xl px-5"
                        >
                          Bỏ qua
                        </Button>
                        <Button
                          type="submit"
                          variant="primary"
                          size="md"
                          isLoading={isBusy}
                          loadingText="Đang xử lý..."
                          disabled={isBusy}
                          className="flex-1 md:flex-none rounded-xl px-6 font-bold"
                        >
                          Xác nhận chọn
                        </Button>
                      </div>
                    </form>
                  )}

                  {mode === "NEW" && (
                    <form
                      onSubmit={handleSubmit(handleNewAddressSubmit)}
                      className="flex flex-col gap-3.5 text-left animate-in fade-in duration-200"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[12.5px] font-bold text-text-primary">
                            Họ và tên người nhận <span className="text-error">*</span>
                          </label>
                          <Input
                            {...register("fullName", {
                              required: "Vui lòng nhập họ và tên người nhận",
                              minLength: {
                                value: 2,
                                message: "Họ và tên phải có ít nhất 2 ký tự",
                              },
                            })}
                            placeholder="Họ và tên người nhận"
                            error={!!errors.fullName}
                            disabled={isBusy}
                            leftIcon={<User size={16} />}
                          />
                          {errors.fullName && (
                            <div className="flex items-center gap-1 text-[11.5px] text-error font-medium">
                              <AlertCircle size={13} />
                              <span>{errors.fullName.message}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[12.5px] font-bold text-text-primary">
                            Số điện thoại <span className="text-error">*</span>
                          </label>
                          <Input
                            {...register("phone", {
                              required: "Vui lòng nhập số điện thoại",
                              pattern: {
                                value: /^(0[3|5|7|8|9])+([0-9]{8})$/,
                                message: "Số điện thoại không hợp lệ (ví dụ: 0912345678)",
                              },
                            })}
                            placeholder="Số điện thoại người nhận"
                            type="tel"
                            error={!!errors.phone}
                            disabled={isBusy}
                            leftIcon={<Phone size={16} />}
                          />
                          {errors.phone && (
                            <div className="flex items-center gap-1 text-[11.5px] text-error font-medium">
                              <AlertCircle size={13} />
                              <span>{errors.phone.message}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[12.5px] font-bold text-text-primary">
                            Tỉnh / Thành phố <span className="text-error">*</span>
                          </label>
                          <Controller
                            name="province"
                            control={control}
                            rules={{ required: "Vui lòng chọn Tỉnh / Thành phố" }}
                            render={({ field }) => (
                              <Select
                                options={PROVINCE_OPTIONS}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Chọn Tỉnh / Thành phố"
                                error={!!errors.province}
                                disabled={isBusy}
                              />
                            )}
                          />
                          {errors.province && (
                            <div className="flex items-center gap-1 text-[11.5px] text-error font-medium">
                              <AlertCircle size={13} />
                              <span>{errors.province.message}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[12.5px] font-bold text-text-primary">
                            Địa chỉ chi tiết <span className="text-error">*</span>
                          </label>
                          <Input
                            {...register("address", {
                              required: "Vui lòng nhập địa chỉ chi tiết",
                              minLength: {
                                value: 5,
                                message: "Địa chỉ chi tiết phải có ít nhất 5 ký tự",
                              },
                            })}
                            placeholder="Tòa nhà, số nhà, tên đường, phường/xã..."
                            error={!!errors.address}
                            disabled={isBusy}
                            leftIcon={<MapPin size={16} />}
                          />
                          {errors.address && (
                            <div className="flex items-center gap-1 text-[11.5px] text-error font-medium">
                              <AlertCircle size={13} />
                              <span>{errors.address.message}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-1">
                        <Controller
                          name="saveToAddressBook"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                              label="Lưu vào sổ địa chỉ cá nhân của tôi"
                              disabled={isBusy}
                            />
                          )}
                        />
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-3 w-full">
                        <Button
                          type="button"
                          variant="outline"
                          size="md"
                          onClick={handleClose}
                          disabled={isBusy}
                          className="flex-1 md:flex-none rounded-xl px-5"
                        >
                          Bỏ qua
                        </Button>
                        <Button
                          type="submit"
                          variant="primary"
                          size="md"
                          isLoading={isBusy}
                          loadingText="Đang xử lý..."
                          disabled={isBusy}
                          className="flex-1 md:flex-none rounded-xl px-6 font-bold"
                        >
                          Cập nhật địa chỉ
                        </Button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={confirmModal.isOpen}
        onClose={confirmModal.closeModal}
        title="Xác nhận thay đổi địa chỉ"
        description={`Bạn có chắc chắn muốn cập nhật địa chỉ giao hàng cho đơn hàng #${orderCode}? Thao tác này không thể hoàn tác.`}
        onConfirm={handleExecuteUpdate}
        confirmLabel="Xác nhận đổi"
        cancelLabel="Bỏ qua"
        isLoading={isBusy}
        loadingText="Đang cập nhật..."
      />
    </>
  );
}
