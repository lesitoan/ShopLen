"use client";

import React from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { LoginForm } from "./components/LoginForm";

export function LoginScreen() {
  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden select-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md space-y-6 relative z-10">
          <LoginForm />

        </div>
      </div>
    </AuthGuard>
  );
}
