import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { ChevronLeft, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { ForgotPasswordStep1Data, ForgotPasswordStep2Data, AuthViewMode } from "../types";

interface ForgotPasswordFormViewProps {
  onSwitchView: (mode: AuthViewMode) => void;
}

export default function ForgotPasswordFormView({
  onSwitchView,
}: ForgotPasswordFormViewProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [sentEmail, setSentEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(""));
  const [otpError, setOtpError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register: registerStep1,
    handleSubmit: handleSubmitStep1,
    formState: { errors: errorsStep1 },
  } = useForm<ForgotPasswordStep1Data>({
    defaultValues: { email: "" },
    mode: "onTouched",
  });

  const {
    register: registerStep2,
    handleSubmit: handleSubmitStep2,
    formState: { errors: errorsStep2 },
  } = useForm<ForgotPasswordStep2Data>({
    defaultValues: { email: "", otpCode: "", newPassword: "" },
    mode: "onTouched",
  });

  const onStep1Submit = (data: ForgotPasswordStep1Data) => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSentEmail(data.email);
      setStep(2);
    }, 600);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return;
    setOtpError("");
    const updated = [...otpDigits];
    updated[index] = val;
    setOtpDigits(updated);

    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const onStep2Submit = (data: ForgotPasswordStep2Data) => {
    const fullOtp = otpDigits.join("");
    if (fullOtp.length < 6) {
      setOtpError("Vui lòng nhập đủ 6 chữ số mã xác nhận");
      return;
    }

    setIsResetting(true);
    console.log("Password reset payload:", {
      email: sentEmail,
      otpCode: fullOtp,
      newPassword: data.newPassword,
    });

    setTimeout(() => {
      setIsResetting(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSwitchView("LOGIN");
      }, 1500);
    }, 800);
  };

  return (
    <div className="flex flex-col gap-5 w-full text-left animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => (step === 2 ? setStep(1) : onSwitchView("LOGIN"))}
          className="p-1.5 -ml-1.5 text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface transition-colors flex items-center gap-1 text-[13px] font-medium"
        >
          <ChevronLeft size={18} />
          <span>{step === 2 ? "Quay lại nhập mail" : "Quay lại đăng nhập"}</span>
        </button>

        <Link
          href="/"
          className="text-[12.5px] font-semibold text-text-secondary hover:text-secondary transition-colors"
        >
          Bỏ qua
        </Link>
      </div>

      <div>
        <h2 className="text-[20px] font-bold text-text-primary">
          Khôi phục mật khẩu
        </h2>
        <p className="text-[12.5px] text-text-secondary mt-1">
          {step === 1
            ? "Nhập email đã đăng ký để nhận mã OTP khôi phục 6 số"
            : `Đã gửi mã xác nhận 6 số về email: ${sentEmail}`}
        </p>
      </div>

      {isSuccess ? (
        <div className="flex flex-col items-center justify-center text-center py-6 gap-3">
          <CheckCircle2 size={44} className="text-emerald-500" />
          <h3 className="text-[16px] font-bold text-text-primary">
            Khôi phục mật khẩu thành công!
          </h3>
          <p className="text-[12.5px] text-text-secondary">
            Đang chuyển hướng sang màn hình đăng nhập...
          </p>
        </div>
      ) : step === 1 ? (
        <form onSubmit={handleSubmitStep1(onStep1Submit)} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-text-primary">
              Địa chỉ email đăng ký
            </label>
            <Input
              {...registerStep1("email", {
                required: "Vui lòng nhập địa chỉ email",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Email không hợp lệ (ví dụ: example@gmail.com)",
                },
              })}
              type="email"
              placeholder="Nhập email của bạn"
              error={!!errorsStep1.email}
              leftIcon={<Mail size={16} />}
            />
            {errorsStep1.email && (
              <div className="flex items-center gap-1 text-[11.5px] text-error font-medium">
                <AlertCircle size={13} />
                <span>{errorsStep1.email.message}</span>
              </div>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isSending}
            className="w-full py-3 text-[14px] font-bold rounded-xl justify-center mt-2"
          >
            {isSending ? "Đang gửi mã..." : "Gửi mã 6 số về email"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleSubmitStep2(onStep2Submit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-text-primary flex items-center justify-between">
              <span>Mã xác thực OTP (6 chữ số)</span>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[11.5px] font-semibold text-secondary hover:underline"
              >
                Gửi lại mã
              </button>
            </label>

            <div className="flex justify-between gap-2 my-1">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-11 h-12 text-center text-[18px] font-bold text-text-primary bg-surface border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                />
              ))}
            </div>

            {otpError && (
              <div className="flex items-center gap-1 text-[11.5px] text-error font-medium">
                <AlertCircle size={13} />
                <span>{otpError}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-text-primary">
              Mật khẩu mới
            </label>
            <Input
              {...registerStep2("newPassword", {
                required: "Vui lòng nhập mật khẩu mới",
                minLength: {
                  value: 6,
                  message: "Mật khẩu mới phải có ít nhất 6 ký tự",
                },
              })}
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
              error={!!errorsStep2.newPassword}
              leftIcon={<Lock size={16} />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-text-secondary hover:text-text-primary transition-colors focus:outline-none p-1"
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />
            {errorsStep2.newPassword && (
              <div className="flex items-center gap-1 text-[11.5px] text-error font-medium">
                <AlertCircle size={13} />
                <span>{errorsStep2.newPassword.message}</span>
              </div>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isResetting}
            className="w-full py-3 text-[14px] font-bold rounded-xl justify-center mt-2"
          >
            {isResetting ? "Đang xử lý..." : "Khôi phục mật khẩu"}
          </Button>
        </form>
      )}
    </div>
  );
}
