"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AuthLandingView from "./components/AuthLandingView";
import LoginFormView from "./components/LoginFormView";
import RegisterFormView from "./components/RegisterFormView";
import ForgotPasswordFormView from "./components/ForgotPasswordFormView";
import MobileBottomSheet from "@/components/ui/MobileBottomSheet";

import { AuthViewMode } from "@/types/auth.type";
import { AUTH_SHARED_BG_IMAGE, AUTH_BRAND_NAME } from "./constants";

interface AuthScreenProps {
  initialMode?: AuthViewMode;
}

export default function AuthScreen({ initialMode = "LANDING" }: AuthScreenProps) {
  const [viewMode, setViewMode] = useState<AuthViewMode>(initialMode);

  return (
    <main className="h-screen w-full flex flex-col items-center py-8 px-4 bg-background select-none relative overflow-y-auto">
      {/* MOBILE FULLSCREEN WRAPPER WITH DARK BLURRED COVER BACKGROUND & BOTTOM SHEET */}
      <div className="md:hidden fixed inset-0 z-40 bg-black overflow-hidden flex flex-col justify-between">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Image
            src={AUTH_SHARED_BG_IMAGE}
            alt="Tiệm Len Nhà Kiều Background"
            fill
            sizes="100vw"
            className="object-cover opacity-75 blur-[2px]"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative z-10 w-full flex items-center justify-between p-5 pointer-events-auto">
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-primary/40 bg-surface">
                <Image
                  src="/logo.png"
                  alt={AUTH_BRAND_NAME}
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              </div>
              <span className="text-[14px] font-bold text-white tracking-wide">
                {AUTH_BRAND_NAME}
              </span>
            </div>

            <Link
              href="/"
              className="text-[12px] font-semibold text-white hover:text-primary px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/20"
            >
              Bỏ qua
            </Link>
          </div>
        </div>

        <MobileBottomSheet
          isOpen={true}
          onClose={() => {}}
          showCloseButton={false}
          showDragHandle={true}
          maxHeightClass="max-h-[85vh]"
          paddingClass="px-6 pt-2 pb-24"
        >
          {viewMode === "LANDING" && (
            <AuthLandingView onSwitchView={setViewMode} />
          )}

          {viewMode === "LOGIN" && (
            <LoginFormView onSwitchView={setViewMode} />
          )}

          {viewMode === "REGISTER" && (
            <RegisterFormView onSwitchView={setViewMode} />
          )}

          {viewMode === "FORGOT_PASSWORD" && (
            <ForgotPasswordFormView onSwitchView={setViewMode} />
          )}
        </MobileBottomSheet>
      </div>

      {/* DESKTOP SPLIT CONTAINER WITH FULL COVER LEFT BANNER */}
      <div className="hidden md:flex max-w-4xl lg:max-w-5xl w-full bg-surface border border-border rounded-3xl overflow-hidden flex-row items-stretch min-h-[500px] md:min-h-[560px] relative z-10 my-auto shrink-0">
        <div className="w-1/2 p-8 flex flex-col justify-between relative overflow-hidden border-r border-border/60">
          <Image
            src={AUTH_SHARED_BG_IMAGE}
            alt={AUTH_BRAND_NAME}
            fill
            sizes="50vw"
            className="object-cover z-0"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70 z-0" />

          <div className="flex items-center gap-3 relative z-10">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/30 bg-surface">
              <Image
                src="/logo.png"
                alt={AUTH_BRAND_NAME}
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <span className="text-[16px] font-bold text-white tracking-wide drop-shadow-sm">
              {AUTH_BRAND_NAME}
            </span>
          </div>

          <div className="relative z-10 text-[12px] text-white/90 font-medium text-center drop-shadow-sm">
            2026 Tiệm Len Nhà Kiều. Bảo lưu mọi quyền.
          </div>
        </div>

        <div className="w-1/2 p-10 flex flex-col justify-center bg-surface">
          {viewMode === "LANDING" && (
            <AuthLandingView onSwitchView={setViewMode} />
          )}

          {viewMode === "LOGIN" && (
            <LoginFormView onSwitchView={setViewMode} />
          )}

          {viewMode === "REGISTER" && (
            <RegisterFormView onSwitchView={setViewMode} />
          )}

          {viewMode === "FORGOT_PASSWORD" && (
            <ForgotPasswordFormView onSwitchView={setViewMode} />
          )}
        </div>
      </div>
    </main>
  );
}
