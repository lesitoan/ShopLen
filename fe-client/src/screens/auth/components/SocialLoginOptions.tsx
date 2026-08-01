"use client";

import React, { useEffect, useRef, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import {
  useLazyGetMeQuery,
  useLoginWithGoogleMutation,
} from "@/services/api/authApi";
import { saveAuthTokens } from "@/services/authStorage";
import { useAppDispatch } from "@/store/hooks";
import { setCustomerProfile } from "@/store/slices/authSlice";
import { getApiErrorMessage } from "@/utils/apiErrorUtils";
import { toast } from "react-toastify";

const GOOGLE_BUTTON_MIN_WIDTH = 200;
const GOOGLE_BUTTON_MAX_WIDTH = 400;

interface SocialLoginOptionsProps {
  onGoogleLogin?: () => void;
  onGoogleLoginSuccess?: () => void;
}

export default function SocialLoginOptions({
  onGoogleLogin,
  onGoogleLoginSuccess,
}: SocialLoginOptionsProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const [buttonWidth, setButtonWidth] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginWithGoogle] = useLoginWithGoogleMutation();
  const [getMe] = useLazyGetMeQuery();
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    const syncWidth = () => {
      const nextWidth = Math.floor(element.getBoundingClientRect().width);
      setButtonWidth((prev) => (prev === nextWidth ? prev : nextWidth));
    };

    syncWidth();
    const observer = new ResizeObserver(syncWidth);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const handleGoogleCredential = async (idToken?: string) => {
    if (isSubmitting) {
      return;
    }

    onGoogleLogin?.();

    if (!idToken) {
      toast.error("Không nhận được thông tin đăng nhập Google.");
      return;
    }

    setIsSubmitting(true);

    try {
      const tokens = await loginWithGoogle({ idToken }).unwrap();
      saveAuthTokens(tokens);
      const customer = await getMe().unwrap();
      dispatch(setCustomerProfile(customer));
      toast.success("Đăng nhập Google thành công.");
      onGoogleLoginSuccess?.();
      router.push("/tai-khoan");
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Đăng nhập Google thất bại, vui lòng thử lại.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!googleClientId) {
    return null;
  }

  const resolvedWidth = Math.min(
    Math.max(buttonWidth, GOOGLE_BUTTON_MIN_WIDTH),
    GOOGLE_BUTTON_MAX_WIDTH,
  );

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center gap-3 my-1">
        <div className="flex-1 h-px bg-border/40" />
        <span className="text-[12px] text-text-secondary select-none shrink-0">
          Hoặc đăng nhập bằng phương thức khác
        </span>
        <div className="flex-1 h-px bg-border/40" />
      </div>

      <div
        ref={containerRef}
        className={`relative w-full flex justify-center ${
          isSubmitting ? "pointer-events-none opacity-60" : ""
        }`}
      >
        {buttonWidth > 0 && (
          <GoogleLogin
            key={resolvedWidth}
            onSuccess={(credentialResponse) =>
              handleGoogleCredential(credentialResponse.credential)
            }
            onError={() =>
              toast.error("Đăng nhập Google thất bại, vui lòng thử lại.")
            }
            text="continue_with"
            shape="rectangular"
            theme="outline"
            size="large"
            width={String(resolvedWidth)}
            logo_alignment="left"
          />
        )}
      </div>
    </div>
  );
}
