"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import CheckoutBreadcrumbs from "./components/CheckoutBreadcrumbs";
import ShippingForm from "./components/ShippingForm";
import PaymentMethodSelector from "./components/PaymentMethodSelector";
import OrderReviewItems from "./components/OrderReviewItems";
import CheckoutSummary from "./components/CheckoutSummary";
import MobileCheckoutActionBar from "./components/MobileCheckoutActionBar";
import LoginRequiredModal from "@/components/modals/LoginRequiredModal";
import CheckoutSkeleton from "@/components/skeletons/checkout/CheckoutSkeleton";
import { useGetMeQuery } from "@/services/api/authApi";
import { useGetCartProductsMutation } from "@/services/api/cartApi";
import {
  useGetCustomerAddressesQuery,
  useCreateCustomerAddressMutation,
  CustomerAddress,
} from "@/services/api/customerAddressApi";
import { useCreateOrderMutation } from "@/services/api/orderApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCart, syncCartWithApiData } from "@/store/slices/cartSlice";
import { CartSummaryData } from "@/types/cart.type";
import { STANDARD_SHIPPING_FEE } from "@/screens/cart/constants";
import { getApiErrorMessage } from "@/utils/apiErrorUtils";
import { CheckoutFormData } from "./types";

export default function CheckoutScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const [getCartProducts, { isLoading: isSyncing }] = useGetCartProductsMutation();
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    data: user,
    isLoading: isAuthLoading,
    isError: isAuthError,
  } = useGetMeQuery(undefined, {
    skip: !mounted,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: addresses = [],
    isLoading: isAddressesLoading,
  } = useGetCustomerAddressesQuery(undefined, {
    skip: !mounted || isAuthError || !user,
    refetchOnMountOrArgChange: true,
  });

  const [createCustomerAddress] = useCreateCustomerAddressMutation();

  useEffect(() => {
    if (!mounted || cartItems.length === 0) return;
    const productIds = Array.from(
      new Set(
        cartItems
          .map((item) => item.productId || String(item.id).split("-")[0])
          .filter((id) => Boolean(id) && id.length > 0)
      )
    );

    if (productIds.length > 0) {
      getCartProducts({ ids: productIds })
        .unwrap()
        .then((res) => {
          if (res && Array.isArray(res.items)) {
            dispatch(syncCartWithApiData(res.items));
          }
        })
        .catch((err) => {
          console.error("Failed to sync cart on CheckoutScreen:", err);
        });
    }
  }, [mounted]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    defaultValues: {
      fullName: "",
      phone: "",
      address: "",
      province: "",
      note: "",
      confirmTerms: false,
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (!mounted || isAddressesLoading) return;
    if (addresses.length > 0) {
      if (!selectedAddressId && !isAddingNewAddress) {
        const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
        setSelectedAddressId(defaultAddr.id);
        setValue("fullName", defaultAddr.fullName);
        setValue("phone", defaultAddr.phone);
        setValue("address", defaultAddr.addressLine);
        setValue("province", defaultAddr.provinceName);
      }
    } else {
      setIsAddingNewAddress(true);
      if (user) {
        if (user.fullName) setValue("fullName", user.fullName);
        if (user.phone) setValue("phone", user.phone);
      }
    }
  }, [addresses, isAddressesLoading, mounted, user, setValue]);

  const handleSelectAddress = (address: CustomerAddress) => {
    setSelectedAddressId(address.id);
    setIsAddingNewAddress(false);
    setValue("fullName", address.fullName);
    setValue("phone", address.phone);
    setValue("address", address.addressLine);
    setValue("province", address.provinceName);
  };

  const handleToggleAddNewAddress = (show: boolean) => {
    setIsAddingNewAddress(show);
    if (show) {
      setSelectedAddressId(null);
      setValue("fullName", user?.fullName || "");
      setValue("phone", user?.phone || "");
      setValue("address", "");
      setValue("province", "");
    } else if (addresses.length > 0) {
      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
      handleSelectAddress(defaultAddr);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = subtotal === 0 ? 0 : STANDARD_SHIPPING_FEE;
  const voucherDiscount = 0;
  const pointsDiscount = 0;
  const total = Math.max(0, subtotal + shippingFee - voucherDiscount - pointsDiscount);

  const summaryData: CartSummaryData = {
    subtotal,
    shippingFee,
    voucherDiscount,
    pointsDiscount,
    total,
  };

  const onSubmit = async (data: CheckoutFormData) => {
    if (isAuthError || !user) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (isAddingNewAddress || addresses.length === 0) {
        await createCustomerAddress({
          fullName: data.fullName,
          phone: data.phone,
          addressLine: data.address,
          provinceName: data.province,
          isDefault: addresses.length === 0,
        }).unwrap();
      }

      const orderItemsPayload = cartItems.map((item) => {
        const prodId = item.productId || String(item.id).split("-")[0];
        
        let selectedOptionsPayload = item.selectedOptions?.map((opt) => ({
          optionType: opt.optionType,
          code: opt.code.toUpperCase(),
        }));

        if (!selectedOptionsPayload || selectedOptionsPayload.length === 0) {
          const colorCode = item.colorCode || item.color;
          const hasCustomOption =
            colorCode &&
            colorCode.toUpperCase() !== "DEFAULT" &&
            colorCode.toUpperCase() !== "DEFAULT_OPTION" &&
            colorCode !== "Mặc định";

          if (hasCustomOption) {
            selectedOptionsPayload = [
              {
                optionType: "COLOR" as const,
                code: colorCode.toUpperCase(),
              },
            ];
          }
        }

        return {
          productId: prodId,
          quantity: item.quantity,
          selectedOptions:
            selectedOptionsPayload && selectedOptionsPayload.length > 0
              ? selectedOptionsPayload
              : undefined,
        };
      });

      const createdOrder = await createOrder({
        items: orderItemsPayload,
        customerName: data.fullName,
        customerPhone: data.phone,
        customerEmail: user.email,
        shippingAddress: data.address,
        shippingProvince: data.province,
        customerNote: data.note,
        shippingFee,
      }).unwrap();

      dispatch(clearCart());
      toast.success("Tạo đơn hàng thành công!");

      const targetOrderId = createdOrder.id || createdOrder.orderCode;
      router.push(`/thanh-toan/qr/${targetOrderId}`);
    } catch (error) {
      console.error("Failed to process order creation:", error);
      toast.error(getApiErrorMessage(error, "Không thể tạo đơn hàng. Vui lòng thử lại."));
      setIsSubmitting(false);
    }
  };

  if (!mounted || isAuthLoading || isSyncing || isAddressesLoading) {
    return <CheckoutSkeleton />;
  }

  if (isAuthError || !user) {
    return (
      <>
        <CheckoutSkeleton />
        <LoginRequiredModal
          isOpen={true}
          onClose={() => router.push("/dang-nhap")}
          redirectTo="/dang-nhap"
        />
      </>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="flex-1 py-16 text-center px-4">
        <h2 className="text-[18px] font-bold text-text-primary mb-3">
          Giỏ hàng của bạn đang trống
        </h2>
        <p className="text-[13px] text-text-secondary mb-6">
          Vui lòng thêm sản phẩm vào giỏ hàng trước khi tiến hành thanh toán.
        </p>
        <button
          onClick={() => router.push("/san-pham")}
          className="px-6 py-2.5 bg-secondary text-white font-bold text-xs rounded-md"
        >
          Quay lại cửa hàng
        </button>
      </main>
    );
  }

  return (
    <main className="flex-1 py-4 md:py-8 pb-28 md:pb-0 text-left">
      <div className="max-w-6xl mx-auto px-0 md:px-6 w-full">
        <div className="px-4 md:px-0">
          <CheckoutBreadcrumbs />

          <h1 className="text-center text-[22px] md:text-[28px] font-bold text-text-primary mb-4 md:mb-6">
            Thanh toán đơn hàng
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 flex flex-col gap-6">
              <ShippingForm
                register={register}
                errors={errors}
                control={control}
                addresses={addresses}
                selectedAddressId={selectedAddressId}
                onSelectAddress={handleSelectAddress}
                isAddingNewAddress={isAddingNewAddress}
                onToggleAddNewAddress={handleToggleAddNewAddress}
              />

              <PaymentMethodSelector />
            </div>

            <div className="lg:col-span-5 flex flex-col gap-6">
              <OrderReviewItems items={cartItems} />

              <CheckoutSummary
                summary={summaryData}
                isSubmitting={isSubmitting}
                register={register}
                errors={errors}
                control={control}
              />
            </div>
          </div>

          <MobileCheckoutActionBar
            total={total}
            isSubmitting={isSubmitting}
            register={register}
            errors={errors}
            control={control}
          />
        </form>
      </div>
    </main>
  );
}
