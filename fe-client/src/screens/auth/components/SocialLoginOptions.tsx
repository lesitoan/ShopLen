"use client";

import React from "react";
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
  const [loginWithGoogle] = useLoginWithGoogleMutation();
  const [getMe] = useLazyGetMeQuery();
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const handleGoogleCredential = async (idToken?: string) => {
    onGoogleLogin?.();

    if (!idToken) {
      toast.error("Không nhận được thông tin đăng nhập Google.");
      return;
    }

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
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center gap-3 my-1">
        <div className="flex-1 h-px bg-border/40" />
        <span className="text-[12px] text-text-secondary select-none">
          Hoặc đăng nhập bằng phương thức khác
        </span>
        <div className="flex-1 h-px bg-border/40" />
      </div>

      <div className="relative w-full overflow-hidden rounded-xl">
        <button
          type="button"
          onClick={() => {
            if (!googleClientId) {
              toast.error("Chưa cấu hình Google Client ID trong biến môi trường.");
            }
          }}
          className="w-full py-3 px-4 bg-surface border border-border/80 hover:border-primary/50 hover:bg-background rounded-xl text-[14px] font-bold text-text-primary flex items-center justify-center gap-2.5 shadow-sm transition-all duration-200"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Đăng nhập bằng Google</span>
        </button>

        {googleClientId && (
          <div className="absolute inset-0 opacity-0 overflow-hidden cursor-pointer z-10 flex items-center justify-center scale-150 pointer-events-auto">
            <GoogleLogin
              onSuccess={(credentialResponse) =>
                handleGoogleCredential(credentialResponse.credential)
              }
              onError={() =>
                toast.error("Đăng nhập Google thất bại, vui lòng thử lại.")
              }
              text="signin"
              shape="rectangular"
              width="400"
            />
          </div>
        )}
      </div>

    </div>
  );
}
