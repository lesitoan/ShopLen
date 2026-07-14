"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Eye, EyeOff } from "lucide-react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Vui lòng điền đầy đủ tài khoản và mật khẩu.");
      return;
    }

    setIsLoading(true);

    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      if (username === "admin" && password === "admin123") {
        router.push("/");
      } else {
        setError("Tên đăng nhập hoặc mật khẩu không chính xác.");
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-border p-8 rounded-3xl shadow-xl flex flex-col select-none transition-all duration-300">
        
        {/* Brand/Logo Header */}
        <div className="text-center mb-8">
          <span className="text-3xl">🌸</span>
          <h2 className="text-[20px] font-bold text-text-primary mt-2">
            Đăng Nhập Quản Trị
          </h2>
          <p className="text-[12px] text-text-secondary mt-1">
            Hệ thống quản lý website Tiệm Len Nhà Kiều
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-text-secondary mb-1.5 uppercase">Tên đăng nhập</label>
            <Input
              type="text"
              placeholder="Nhập tên đăng nhập..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              leftIcon={<User size={16} />}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-text-secondary mb-1.5 uppercase">Mật khẩu</label>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock size={16} />}
              disabled={isLoading}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-text-primary focus:outline-none"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-[12px] text-error font-medium">{error}</p>
          )}

          {/* Action Button */}
          <Button
            type="submit"
            variant="primary"
            className="w-full rounded-full py-2.5 font-bold shadow-md hover:shadow mt-2"
            disabled={isLoading}
          >
            {isLoading ? "Đang đăng nhập..." : "Đăng Nhập"}
          </Button>
        </form>

        {/* Footer Info */}
        <div className="mt-8 text-center text-[11px] text-text-secondary/70">
          <p>Tài khoản dùng thử: <strong className="text-secondary">admin</strong> / <strong className="text-secondary">admin123</strong></p>
        </div>

      </div>
    </div>
  );
}
